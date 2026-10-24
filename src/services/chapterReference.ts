export type ParsedVerseReference = {
  chapterReference: string;
  verseNumber: number;
};

export function parseVerseReference(reference: string): ParsedVerseReference | null {
  const match = reference.trim().match(/^(.+?)\s+(\d+):(\d+)/);
  if (!match) return null;

  return {
    chapterReference: `${match[1]} ${match[2]}`,
    verseNumber: Number(match[3]),
  };
}