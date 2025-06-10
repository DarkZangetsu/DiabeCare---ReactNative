export type GlycemiaUnit = 'mg/dL' | 'mmol/L';

export interface GlycemiaReading {
  id: string;
  value: number; // Always stored in mg/dL
  unit: GlycemiaUnit; // Original unit entered by user
  date: Date;
  time: string;
  notes?: string;
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  time: string;
  isActive: boolean;
  type: 'medication' | 'measurement' | 'meal' | 'exercise';
}

export interface Meal {
  id: string;
  name: string;
  carbohydrates: number; // grams
  calories: number;
  date: Date;
  time: string;
}

export interface Advice {
  id: string;
  title: string;
  content: string;
  category: 'nutrition' | 'exercise' | 'medication' | 'general';
  readTime: number; // minutes
}

export type RootTabParamList = {
  Rappels: undefined;
  Glycémie: undefined;
  Conseils: undefined;
};

export type RemindersStackParamList = {
  RemindersHome: undefined;
  AddReminder: undefined;
};

export type GlycemiaStackParamList = {
  GlycemiaHome: undefined;
  AddGlycemia: undefined;
  GlycemiaHistory: undefined;
  GlycemiaChart: undefined;
};

export type AdviceStackParamList = {
  AdviceHome: undefined;
  AdviceDetail: { advice: Advice };
  DiabetesInfo: undefined;
};
