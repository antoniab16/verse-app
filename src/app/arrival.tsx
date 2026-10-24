import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { cancelAnimation, useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moods } from '../data/moods';
import { fetchVerse, VerseResponse } from '../services/verseApi';
import { chooseRandomReference, parseSeenReferences } from '../services/verseSelection';
import { colors } from '../theme/colors';

export default function ArrivalScreen() {
  const { moodId, reference: requestedReference, seenReferences: seenReferencesParam, reflect } = useLocalSearchParams<{
    moodId?: string;
    reference?: string;
    seenReferences?: string;
    reflect?: string;
  }>();
  const seenReferences = parseSeenReferences(seenReferencesParam);
  const [verse, setVerse] = useState<VerseResponse | null>(null);
  const [error, setError] = useState(false);
  const [isReflecting, setIsReflecting] = useState(reflect === 'true');
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [selectedReference, setSelectedReference] = useState<string | null>(requestedReference ?? null);
  const [showDetails, setShowDetails] = useState(reflect === 'true');
  const breathingProgress = useSharedValue(0);
  const verseOpacity = useSharedValue(reflect === 'true' ? 1 : 0);
  const detailsOpacity = useSharedValue(reflect === 'true' ? 1 : 0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const mood = moods.find((item) => item.id === moodId);
    const reference = requestedReference ?? chooseRandomReference(mood?.references ?? [], seenReferences);

    if (!reference) {
      setError(true);
      return;
    }

    setVerse(null);
    setError(false);
    setShowDetails(reflect === 'true');
    verseOpacity.value = reflect === 'true' ? 1 : 0;
    detailsOpacity.value = reflect === 'true' ? 1 : 0;
    setSelectedReference(reference);
    fetchVerse(reference).then(setVerse).catch(() => setError(true));
  }, [moodId, requestedReference, seenReferencesParam]);

  useEffect(() => {
    if (!verse || isReflecting) return;

    if (reduceMotion) {
      verseOpacity.value = 1;
      detailsOpacity.value = 1;
      setShowDetails(true);
      return;
    }

    verseOpacity.value = withTiming(1, { duration: 1800 });
    const detailsTimer = setTimeout(() => {
      setShowDetails(true);
      detailsOpacity.value = withTiming(1, { duration: 600 });
    }, 2200);

    return () => clearTimeout(detailsTimer);
  }, [detailsOpacity, isReflecting, reduceMotion, verse, verseOpacity]);

  useEffect(() => {
    if (!isReflecting) return;

    void activateKeepAwakeAsync('verse-reflection');

    return () => {
      void deactivateKeepAwake('verse-reflection');
    };
  }, [isReflecting]);

  useEffect(() => {
    if (isReflecting) {
      breathingProgress.value = withRepeat(withTiming(1, { duration: 4000 }), -1, true);
    } else {
      cancelAnimation(breathingProgress);
      breathingProgress.value = 0;
    }
  }, [breathingProgress, isReflecting]);

  useEffect(() => {
    if (!isReflecting) return;

    if (secondsLeft <= 0) {
      openClosing();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((current) => current - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isReflecting, secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = String(secondsLeft % 60).padStart(2, '0');
  const progress = ((60 - secondsLeft) / 60) * 100;
  const breathingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + breathingProgress.value * 0.035 }],
  }));
  const verseRevealStyle = useAnimatedStyle(() => ({
    opacity: verseOpacity.value,
  }));
  const detailsRevealStyle = useAnimatedStyle(() => ({
    opacity: detailsOpacity.value,
  }));

  const openClosing = () => {
    if (!verse || !moodId) return;

    router.replace({
      pathname: '/closing',
      params: {
        moodId,
        reference: selectedReference ?? verse.reference,
        seenReferences: JSON.stringify([...seenReferences, selectedReference ?? verse.reference]),
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {verse ? (
          <>
            <Animated.View style={[styles.eyebrowSlot, detailsRevealStyle]}>
              <Text style={styles.eyebrow}>For this moment</Text>
            </Animated.View>
            {isReflecting ? (
              <View style={styles.timerArea}>
                <Text style={styles.prompt}>Breathe in. Breathe out.</Text>
                <Text style={styles.secondaryPrompt}>Focus on yourself and the verse. Leave the world behind.</Text>
                <Text style={styles.time}>{minutes}:{seconds}</Text>
                <View style={styles.progressTrack}>
                  <View style={[styles.progress, { width: `${progress}%` }]} />
                </View>
              </View>
            ) : null}
            <Animated.Text style={[styles.verse, isReflecting ? breathingStyle : verseRevealStyle]}>
              {verse.text.trim()}
            </Animated.Text>
            <Animated.View
              pointerEvents={showDetails ? 'auto' : 'none'}
              style={detailsRevealStyle}
            >
              <View style={styles.referenceRow}>
                <Text style={styles.reference}>{verse.reference}</Text>
                <Pressable
                  onPress={() => router.push({ pathname: '/context', params: { reference: verse.reference } })}
                  style={styles.contextButton}
                >
                  <Text style={styles.contextLabel}>Read chapter</Text>
                </Pressable>
              </View>
              <Text style={styles.translation}>{verse.translation_name ?? 'World English Bible'}</Text>
              {isReflecting ? (
                <View style={styles.reflectionActions}>
                  <Pressable onPress={openClosing} style={styles.endButton}>
                    <Text style={styles.endLabel}>End reflection</Text>
                  </Pressable>
                </View>
              ) : (
                <View style={styles.arrivalActions}>
                  <Pressable onPress={() => setIsReflecting(true)} style={styles.button}>
                    <Text style={styles.buttonLabel}>Stay with this verse</Text>
                  </Pressable>
                  <Pressable onPress={() => router.replace('/')} style={styles.homeButton}>
                    <Text style={styles.homeLabel}>Back to moods</Text>
                  </Pressable>
                </View>
              )}
            </Animated.View>
          </>
        ) : error ? (
          <>
            <Text style={styles.title}>The verse is taking a moment.</Text>
            <Text style={styles.message}>Please check your connection and try again.</Text>
            <Pressable onPress={() => router.back()} style={styles.button}>
              <Text style={styles.buttonLabel}>Go back</Text>
            </Pressable>
          </>
        ) : (
          <View />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, justifyContent: 'center', padding: 28, zIndex: 1 },
  eyebrow: { color: colors.muted, fontSize: 14, letterSpacing: 1.1, textTransform: 'uppercase' },
  eyebrowSlot: { minHeight: 17 },
  verse: { color: colors.ink, fontFamily: 'Georgia', fontSize: 26, lineHeight: 38, marginTop: 22, textAlign: 'center' },
  referenceRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 22 },
  reference: { color: colors.accentText, flex: 1, fontSize: 15, fontWeight: '600' },
  translation: { color: colors.muted, fontSize: 13, marginTop: 6 },
  contextButton: { alignItems: 'flex-end', justifyContent: 'center', minHeight: 40, paddingLeft: 12 },
  contextLabel: { color: colors.muted, fontSize: 13, textDecorationLine: 'underline' },
  title: { color: colors.ink, fontSize: 28, fontWeight: '600', lineHeight: 36 },
  message: { color: colors.muted, fontSize: 16, lineHeight: 24, marginTop: 14 },
  loading: { color: colors.muted, fontSize: 16, marginTop: 16, textAlign: 'center' },
  button: { alignItems: 'center', alignSelf: 'stretch', backgroundColor: colors.accent, borderRadius: 28, justifyContent: 'center', marginTop: 40, minHeight: 56, paddingHorizontal: 20 },
  buttonLabel: { color: colors.ink, fontSize: 16, fontWeight: '600' },
  arrivalActions: { alignItems: 'center' },
  homeButton: { alignItems: 'center', justifyContent: 'center', minHeight: 44, marginTop: 8, paddingHorizontal: 20 },
  homeLabel: { color: colors.muted, fontSize: 15 },
  timerArea: { alignItems: 'center', marginTop: 28 },
  prompt: { color: colors.muted, fontSize: 15, textAlign: 'center' },
  secondaryPrompt: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 6, opacity: 0.68, textAlign: 'center' },
  time: { color: colors.ink, fontSize: 22, fontVariant: ['tabular-nums'], marginTop: 8 },
  progressTrack: { backgroundColor: colors.border, borderRadius: 2, height: 3, marginTop: 10, overflow: 'hidden', width: '72%' },
  progress: { backgroundColor: colors.accent, height: '100%' },
  reflectionActions: { alignItems: 'center', marginTop: 12 },
  endButton: { padding: 8 },
  endLabel: { color: colors.muted, fontSize: 14 },
});
