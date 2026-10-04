import { NextRequest, NextResponse } from 'next/server';
import { performMultiSearch } from '@/lib/searchEngine';

export async function POST(req: NextRequest) {
  try {
    const { query, tab = 'web' } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const results = await performMultiSearch(query, tab);
    return NextResponse.json({ success: true, query, tab, results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Search execution failed' }, { status: 500 });
  }
}
