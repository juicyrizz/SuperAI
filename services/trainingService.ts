
import { Persona } from '../types';
import type { FineTuningExample } from '../types';

const STORAGE_KEY = 'super-syntax-fine-tuning-examples';

const isBrowser = typeof window !== 'undefined';

const getStoredExamples = (): Record<Persona, FineTuningExample[]> => {
  if (!isBrowser) return {} as Record<Persona, FineTuningExample[]>;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : ({} as Record<Persona, FineTuningExample[]>);
  } catch (error) {
    console.error('Error parsing fine-tuning examples from localStorage:', error);
    return {} as Record<Persona, FineTuningExample[]>;
  }
};

export const getExamples = (persona: Persona): FineTuningExample[] => {
  if (!isBrowser) return [];
  const allExamples = getStoredExamples();
  return allExamples[persona] || [];
};

export const addExample = (persona: Persona, example: FineTuningExample) => {
  if (!isBrowser) return;
  const allExamples = getStoredExamples();
  const personaExamples = allExamples[persona] || [];
  
  // Keep the 10 most recent examples to avoid overly large context.
  const updatedExamples = [example, ...personaExamples].slice(0, 10);

  allExamples[persona] = updatedExamples;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allExamples));
  } catch (error) {
    console.error('Error saving fine-tuning example to localStorage:', error);
  }
};