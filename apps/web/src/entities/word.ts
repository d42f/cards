export interface WordProgress {
  id: string;
  nextReviewAt: string | null;
  easeFactor: number;
  interval: number;
  repetitions: number;
}

export interface DueWord {
  id: string;
  wordSetId: string;
  word: string;
  translation: string;
  transcription: string | null;
  progress: WordProgress | null;
}
