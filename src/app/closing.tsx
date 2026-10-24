import { useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

export default function ClosingScreen() {
  const { moodId, reference, seenReferences } = useLocalSearchParams<{
    moodId?: string;
    reference?: string;
    seenReferences?: string;
  }>();

  useEffect(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>You can stay here a little longer or find another verse for the moment.</Text>
        <Text style={styles.message}>Let the quiet moment continue, or return when you are ready.</Text>

        <Pressable
          accessibilityRole="button"
          onPress={() =>
            router.replace({
              pathname: '/arrival',
              params: { moodId, reference, seenReferences, reflect: 'true' },
            })
          }
          style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
        >
          <Text style={styles.primaryLabel}>Stay a little longer</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            router.replace({
              pathname: '/arrival',
              params: { moodId, seenReferences },
            })
          }
          style={({ pressed }) => [styles.outlineButton, pressed && styles.buttonPressed]}
        >
          <Text style={styles.outlineLabel}>Another verse</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace('/')}
          style={({ pressed }) => [styles.doneButton, pressed && styles.buttonPressed]}
        >
          <Text style={styles.doneLabel}>Done</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F0E8' },
  container: { flex: 1, justifyContent: 'center', padding: 28 },
  title: { color: colors.ink, fontFamily: 'Georgia', fontSize: 32, lineHeight: 42 },
  message: { color: colors.muted, fontSize: 17, lineHeight: 25, marginTop: 16 },
  primaryButton: { alignItems: 'center', backgroundColor: colors.accent, borderRadius: 28, marginTop: 42, minHeight: 56, justifyContent: 'center', paddingHorizontal: 20 },
  primaryLabel: { color: colors.ink, fontSize: 16, fontWeight: '600' },
  outlineButton: { alignItems: 'center', borderColor: colors.accent, borderRadius: 28, borderWidth: 1, marginTop: 12, minHeight: 56, justifyContent: 'center', paddingHorizontal: 20 },
  outlineLabel: { color: colors.accentText, fontSize: 16, fontWeight: '600' },
  doneButton: { alignItems: 'center', minHeight: 48, justifyContent: 'center', marginTop: 8, paddingHorizontal: 20 },
  doneLabel: { color: colors.muted, fontSize: 15 },
  buttonPressed: { opacity: 0.72 },
});
