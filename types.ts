
export interface Revision {
  id: string;
  timestamp: string;
  content: string;
  label: string;
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  revisions: Revision[];
}

export interface LayoutPreference {
  paperSize: string;
  fontScale: number;
  margins: string;
  columns: number;
  lineHeight: number;
  styleName: string;
  fontFamily: string;
}

export interface CoverStyle {
  typography: 'serif' | 'sans' | 'script';
  filter: 'none' | 'sepia' | 'vintage' | 'noir' | 'warm' | 'cold' | 'high-contrast' | 'dreamy';
  overlayOpacity: number;
}

export interface BookMetadata {
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  genre: string;
  series?: string;
  seriesIndex?: number;
  language: string;
  description: string;
  tags: string[];
  coverUrl?: string;
  coverStyle?: CoverStyle;
  copyrightHolder: string;
  copyrightYear: string;
  license: string;
  legalNotice: string;
  layoutPreference?: LayoutPreference;
}

export interface Book {
  id: string;
  metadata: BookMetadata;
  chapters: Chapter[];
  lastSaved?: string;
}

export enum ViewMode {
  Write = 'write',
  Layout = 'layout',
  Publish = 'publish',
  Library = 'library'
}

export type PlanType = 'free' | 'pro' | 'studio';

export interface User {
  id: string;
  email: string;
  name: string;
  plan: PlanType;
  trialEndsAt?: string;
  isLoggedIn: boolean;
}
