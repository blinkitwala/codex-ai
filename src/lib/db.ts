import fs from 'fs';
import path from 'path';
import { User, ChatSession, Message } from './types';

export interface UserRecord extends User {
  passwordHash: string;
}

interface DatabaseSchema {
  users: UserRecord[];
  chats: ChatSession[];
}

const DB_FILE = path.join(process.cwd(), 'data', 'codex_db.json');

// Memory cache fallback for serverless
let inMemoryDb: DatabaseSchema = {
  users: [],
  chats: [],
};

export function ensureDbExists(): DatabaseSchema {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      inMemoryDb = JSON.parse(content);
      return inMemoryDb;
    } else {
      fs.writeFileSync(DB_FILE, JSON.stringify(inMemoryDb, null, 2), 'utf-8');
      return inMemoryDb;
    }
  } catch (err) {
    console.warn('File system DB write failed, using memory fallback', err);
    return inMemoryDb;
  }
}

function saveDb(db: DatabaseSchema) {
  inMemoryDb = db;
  try {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    // Ignore serverless fs write error
  }
}

// User helper methods
export function findUserByEmail(email: string): UserRecord | undefined {
  if (!email) return undefined;
  const db = ensureDbExists();
  const target = email.trim().toLowerCase();
  return db.users.find((u) => u.email && u.email.trim().toLowerCase() === target);
}

export function createUser(user: UserRecord): User {
  const db = ensureDbExists();
  const normalizedEmail = user.email.trim().toLowerCase();
  const cleanUser: UserRecord = {
    ...user,
    email: normalizedEmail,
  };
  const existingIdx = db.users.findIndex((u) => u.email && u.email.trim().toLowerCase() === normalizedEmail);
  if (existingIdx >= 0) {
    db.users[existingIdx] = { ...db.users[existingIdx], ...cleanUser };
  } else {
    db.users.push(cleanUser);
  }
  saveDb(db);
  const { passwordHash, ...publicUser } = cleanUser;
  return publicUser;
}

// Chat helper methods
export function getUserChats(userId: string): ChatSession[] {
  const db = ensureDbExists();
  const userChats = db.chats.filter((c) => c.userId === userId);
  
  // Categorize by date
  const now = new Date();
  return userChats.map((chat) => {
    const chatDate = new Date(chat.updatedAt || chat.createdAt);
    const diffDays = Math.floor((now.getTime() - chatDate.getTime()) / (1000 * 60 * 60 * 24));
    let category: 'Today' | 'Yesterday' | '3 days ago' | '7 days ago' | 'Last 30 days' = 'Today';
    if (diffDays === 1) category = 'Yesterday';
    else if (diffDays > 1 && diffDays <= 3) category = '3 days ago';
    else if (diffDays > 3 && diffDays <= 7) category = '7 days ago';
    else if (diffDays > 7) category = 'Last 30 days';
    
    return { ...chat, category };
  }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function getChatById(chatId: string, userId: string): ChatSession | undefined {
  const db = ensureDbExists();
  return db.chats.find((c) => c.id === chatId && c.userId === userId);
}

export function saveChatSession(chat: ChatSession): ChatSession {
  const db = ensureDbExists();
  const index = db.chats.findIndex((c) => c.id === chat.id);
  chat.updatedAt = new Date().toISOString();
  if (index >= 0) {
    db.chats[index] = chat;
  } else {
    db.chats.push(chat);
  }
  saveDb(db);
  return chat;
}

export function deleteChatSession(chatId: string, userId: string): boolean {
  const db = ensureDbExists();
  const initialLength = db.chats.length;
  db.chats = db.chats.filter((c) => !(c.id === chatId && c.userId === userId));
  saveDb(db);
  return db.chats.length < initialLength;
}

export function renameChatSession(chatId: string, userId: string, newTitle: string): ChatSession | null {
  const db = ensureDbExists();
  const chat = db.chats.find((c) => c.id === chatId && c.userId === userId);
  if (chat) {
    chat.title = newTitle;
    chat.updatedAt = new Date().toISOString();
    saveDb(db);
    return chat;
  }
  return null;
}
