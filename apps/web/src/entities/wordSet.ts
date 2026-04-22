export interface WordSet {
  id: string;
  title: string;
  words: { id: string }[];
  studiedCount: number;
  dueCount: number;
}
