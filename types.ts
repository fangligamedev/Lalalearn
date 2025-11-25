
export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export type Language = 'en' | 'zh';

export type CoachPersona = 'gentle' | 'sarcastic' | 'professional' | 'concise' | 'stepbystep';

export interface ChatMessage {
  role: MessageRole;
  text: string;
  isError?: boolean;
}

export interface LevelVariant {
  task: string;
  starterCode: string;
  hint: string;
  description?: string; // Optional override description
}

export interface LevelData {
  id: number;
  title: string;
  description: string;
  task: string;
  starterCode: string;
  concepts: string[];
  hint: string;
  timeLimit: number;
  variants?: LevelVariant[]; // New: Array of alternative questions
}

// Updated UserState
export interface UserState {
  id: string; // Unique ID
  name: string;
  currentLevel: number;
  stars: number;
  levelStars: Record<number, number>;
  xp: number;
  unlockedBadges: string[];
  language: Language;
  hasSeenTutorial: boolean;
  settings: {
    voiceURI: string | null;
    persona: CoachPersona;
  };
  currentBank: 'A' | 'B' | 'C'; // Question Bank
}

export interface AIContext {
  currentLevel: number;
  levelTitle?: string;
  levelTask?: string;
  currentCode: string;
  userXp: number;
}

export interface ValidationResult {
  success: boolean;
  output: string;
  feedback: string;
  starsEarned?: number;
}
