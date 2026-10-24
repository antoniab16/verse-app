import AsyncStorage from '@react-native-async-storage/async-storage';

export type VerseResponse = {
  text: string;
  reference: string;
  translation_name?: string;
};

export type ChapterVerse = {
  verse: number;
  text: string;
};

export type ChapterResponse = {
  reference: string;
  verses: ChapterVerse[];
};

const BIBLE_API_URL = 'https://bible-api.com';
const VERSE_CACHE_PREFIX = '@verse/cache/';
const CHAPTER_CACHE_PREFIX = '@verse/chapter-cache/';

export async function fetchVerse(reference: string): Promise<VerseResponse> {
  const cacheKey = getCacheKey(reference);
  const cachedVerse = await readCachedVerse(cacheKey);

  if (cachedVerse) {
    return cachedVerse;
  }

  const response = await fetch(
    `${BIBLE_API_URL}/${encodeURIComponent(reference)}?translation=web`,
  );

  if (!response.ok) {
    throw new Error('Verse unavailable');
  }

  const verse = (await response.json()) as VerseResponse;
  await writeCachedVerse(cacheKey, verse);
  return verse;
}

export async function fetchChapter(reference: string): Promise<ChapterResponse> {
  const cacheKey = getChapterCacheKey(reference);
  const cachedChapter = await readCachedChapter(cacheKey);

  if (cachedChapter) return cachedChapter;

  const response = await fetch(
    `${BIBLE_API_URL}/${encodeURIComponent(reference)}?translation=web`,
  );

  if (!response.ok) {
    throw new Error('Chapter unavailable');
  }

  const chapter = (await response.json()) as ChapterResponse;
  await writeCachedChapter(cacheKey, chapter);
  return chapter;
}

function getCacheKey(reference: string) {
  return `${VERSE_CACHE_PREFIX}${reference.trim().toLowerCase()}`;
}

function getChapterCacheKey(reference: string) {
  return `${CHAPTER_CACHE_PREFIX}${reference.trim().toLowerCase()}`;
}

async function readCachedVerse(cacheKey: string) {
  try {
    const cachedValue = await AsyncStorage.getItem(cacheKey);
    if (!cachedValue) return null;

    const parsedValue = JSON.parse(cachedValue) as Partial<VerseResponse>;
    if (typeof parsedValue.text !== 'string' || typeof parsedValue.reference !== 'string') {
      return null;
    }

    return parsedValue as VerseResponse;
  } catch {
    return null;
  }
}

async function writeCachedVerse(cacheKey: string, verse: VerseResponse) {
  try {
    await AsyncStorage.setItem(cacheKey, JSON.stringify(verse));
  } catch {
    // Caching is best effort; a storage failure should not hide a fetched verse.
  }
}

async function readCachedChapter(cacheKey: string) {
  try {
    const cachedValue = await AsyncStorage.getItem(cacheKey);
    if (!cachedValue) return null;

    const parsedValue = JSON.parse(cachedValue) as Partial<ChapterResponse>;
    if (
      typeof parsedValue.reference !== 'string' ||
      !Array.isArray(parsedValue.verses) ||
      !parsedValue.verses.every(
        (item) =>
          typeof item === 'object' &&
          item !== null &&
          typeof item.verse === 'number' &&
          typeof item.text === 'string',
      )
    ) {
      return null;
    }

    return parsedValue as ChapterResponse;
  } catch {
    return null;
  }
}

async function writeCachedChapter(cacheKey: string, chapter: ChapterResponse) {
  try {
    await AsyncStorage.setItem(cacheKey, JSON.stringify(chapter));
  } catch {
    // Caching is best effort; a storage failure should not hide a fetched chapter.
  }
}
