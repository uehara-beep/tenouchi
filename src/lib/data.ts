// Data types for TENOUCHI - Real data will come from APIs

export interface TimelineItem {
  id: number;
  src: "gmail" | "lineworks" | "line" | "timetree";
  from: string;
  subj: string;
  ai: string;
  pr: "urgent" | "today" | "this_week";
  time: string;
  draft?: boolean;
}

export const TIMELINE_DATA: TimelineItem[] = [];

export interface MoneyData {
  income: number;
  expense: number;
  cats: { n: string; a: number; p: number }[];
  recent: { d: string; c: string; a: number; dir: "in" | "out"; n: string }[];
}

export const MONEY_DATA: MoneyData = {
  income: 0,
  expense: 0,
  cats: [],
  recent: [],
};

export interface StashData {
  balance: number;
  target: number;
  recent: { d: string; a: number; n: string; dir: "in" | "out" }[];
}

export const STASH_DATA: StashData = {
  balance: 0,
  target: 0,
  recent: [],
};

export interface Woman {
  id: number;
  nm: string;
  age: number;
  job: string;
  sex: number;
  looks: number;
  per: number;
  ov: number;
  st: "active" | "paused";
  cost: number;
  dates: number;
  av: string;
}

export const WOMEN_DATA: Woman[] = [];

export interface BusinessContact {
  nm: string;
  co: string;
  pos: string;
}

export const BUSINESS_CONTACTS: BusinessContact[] = [];

export interface FamilyEvent {
  id: number;
  title: string;
  date: string;
  cat: string;
  color: string;
}

export const FAMILY_EVENTS: FamilyEvent[] = [];

export interface Note {
  t: string;
  c: string;
  pin?: boolean;
  color: string;
  rot: number;
  tape?: boolean;
  sticker?: string;
}

export const NOTES_DATA: Note[] = [];

export interface TrendData {
  src: string;
  color: string;
  items: string[];
}

export const TRENDS_DATA: TrendData[] = [];
