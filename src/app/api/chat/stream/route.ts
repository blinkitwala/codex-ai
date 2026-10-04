import { NextRequest, NextResponse } from 'next/server';
import { generateAIStreamResponse } from '@/lib/aiEngine';
import { performMultiSearch, executeDeepSearch } from '@/lib/searchEngine';
import { saveChatSession, getChatById } from '@/lib/db';
import { Message, ChatSession, SearchResult } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chatId, userId, prompt, attachments, isSearchEnabled, isDeepSearch, activeSearchTab = 'web' } = body;

    if (!prompt || !userId) {
      return NextResponse.json({ error: 'Prompt and userId are required.' }, { status: 400 });
    }

    const currentChatId = chatId || `chat-${Date.now()}`;
    let existingChat = getChatById(currentChatId, userId);

    if (!existingChat) {
      existingChat = {
        id: currentChatId,
        userId,
        title: prompt.slice(0, 35) + (prompt.length > 35 ? '...' : ''),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: []
      };
    }

    // Save User Message
    const userMsg: Message = {
      id: `msg-${Date.now()}-user`,
      chatId: currentChatId,
      role: 'user',
      content: prompt,
      timestamp: new Date().toISOString(),
      attachments: attachments || []
    };

    existingChat.messages.push(userMsg);
    saveChatSession(existingChat);

    // Multi-Engine Search Lookup if requested or Deep Search enabled
    let searchResults: SearchResult[] = [];
    let citations: { number: number; title: string; url: string }[] = [];

    if (isDeepSearch) {
      const deepRes = await executeDeepSearch(prompt);
      searchResults = deepRes.searchResults;
      citations = deepRes.citations;
    } else if (isSearchEnabled) {
      searchResults = await performMultiSearch(prompt, activeSearchTab);
      citations = searchResults.map((sr, idx) => ({ number: idx + 1, title: sr.title, url: sr.url }));
    }

    const encoder = new TextEncoder();
    let accumulatedContent = '';

    const stream = new ReadableStream({
      async start(controller) {
        // Send initial metadata chunk (JSON payload header)
        const metaChunk = JSON.stringify({
          type: 'metadata',
          chatId: currentChatId,
          searchResults,
          citations,
          activeSearchTab,
          isDeepSearch
        }) + '\n---CODEX_SPLIT---\n';
        
        controller.enqueue(encoder.encode(metaChunk));

        await generateAIStreamResponse({
          messages: existingChat.messages,
          prompt,
          attachments,
          searchResults,
          isDeepSearch,
          onChunk: (textChunk) => {
            accumulatedContent += textChunk;
            controller.enqueue(encoder.encode(textChunk));
          }
        });

        // Save Assistant Message when streaming completes
        const assistantMsg: Message = {
          id: `msg-${Date.now()}-assistant`,
          chatId: currentChatId,
          role: 'assistant',
          content: accumulatedContent,
          timestamp: new Date().toISOString(),
          searchResults: searchResults.length > 0 ? searchResults : undefined,
          citations: citations.length > 0 ? citations : undefined,
          activeSearchTab,
          isDeepSearch
        };

        existingChat.messages.push(assistantMsg);
        saveChatSession(existingChat);

        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });

  } catch (err: any) {
    console.error('Streaming API Error:', err);
    return NextResponse.json({ error: err.message || 'Stream generation failed.' }, { status: 500 });
  }
}
