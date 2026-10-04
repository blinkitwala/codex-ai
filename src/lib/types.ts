export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string;
}

export interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  url: string;
  domain: string;
  engine: string;
  tab: 'web' | 'images' | 'news' | 'videos';
  imageUrl?: string;
}

export interface Message {
  id: string;
  chatId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  attachments?: Attachment[];
  searchResults?: SearchResult[];
  activeSearchTab?: 'web' | 'images' | 'news' | 'videos';
  isDeepSearch?: boolean;
  citations?: { number: number; title: string; url: string }[];
  model?: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  category?: 'Today' | 'Yesterday' | '3 days ago' | '7 days ago' | 'Last 30 days';
}

export interface VoiceSettings {
  pitch: number; // default 0.75 for deep male voice
  rate: number;  // default 0.95
  voiceName: string;
  autoSpeak: boolean;
}
