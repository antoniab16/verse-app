import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchChapter, ChapterResponse } from '../services/verseApi';
import { parseVerseReference } from '../services/chapterReference';
import { colors } from '../theme/colors';

export default function ContextScreen() {
  const { reference } = useLocalSearchParams<{ reference?: string }>();
  const [chapter, setChapter] = useState<ChapterResponse | null>(null);
  const [error, setError] = useState(false);
  const parsedReference = reference ? parseVerseReference(reference) : null;

  useEffect(() => {
    if (!parsedReference) {
      setError(true);
      return;
    }

    fetchChapter(parsedReference.chapterReference)
      .then(setChapter)
      .catch(() => setError(true));
  }, [reference]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backLabel}>Back to verse</Text>
        </Pressable>
        {chapter ? (
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.eyebrow}>A little more around it</Text>
            <Text style={styles.title}>{chapter.reference}</Text>
            {chapter.verses.map((item) => {
              const isSelected = item.verse === parsedReference?.verseNumber;

              return (
                <View key={item.verse} style={[styles.verseRow, isSelected && styles.selectedVerse]}>
                  <Text style={[styles.number, isSelected && styles.selectedText]}>{item.verse}</Text>
                  <Text style={[styles.verseText, isSelected && styles.selectedText]}>{item.text.trim()}</Text>
                </View>
              );
            })}
          </ScrollView>
        ) : error ? (
          <View style={styles.messageArea}>
            <Text style={styles.messageTitle}>The chapter is unavailable right now.</Text>
            <Text style={styles.message}>You can return to the verse and keep your quiet moment.</Text>
          </View>
        ) : (
          <View style={styles.messageArea}>
            <ActivityIndicator color={colors.accent} />
            <Text style={styles.message}>Gathering the surrounding words...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, padding: 28 },
  backButton: { alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center' },
  backLabel: { color: colors.muted, fontSize: 15 },
  content: { paddingBottom: 32 },
  eyebrow: { color: colors.muted, fontSize: 14, letterSpacing: 1.1, marginTop: 18, textTransform: 'uppercase' },
  title: { color: colors.ink, fontFamily: 'Georgia', fontSize: 30, marginTop: 12 },
  verseRow: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 12 },
  selectedVerse: { backgroundColor: '#F3E9DE', borderRadius: 8 },
  number: { color: colors.muted, fontSize: 13, paddingTop: 3, width: 28 },
  verseText: { color: colors.ink, flex: 1, fontFamily: 'Georgia', fontSize: 18, lineHeight: 29 },
  selectedText: { color: colors.accentText },
  messageArea: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  messageTitle: { color: colors.ink, fontSize: 22, textAlign: 'center' },
  message: { color: colors.muted, fontSize: 16, lineHeight: 24, marginTop: 12, textAlign: 'center' },
});