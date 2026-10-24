import { useState } from 'react';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moods } from '../data/moods';
import { colors } from '../theme/colors';

export default function MoodScreen() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const chooseMood = (moodId: string) => {
    setSelectedMood(moodId);
    void Haptics.selectionAsync();
  };

  const continueToVerse = () => {
    if (!selectedMood) return;

    router.push({
      pathname: '/arrival',
      params: { moodId: selectedMood },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.intro}>
          <Text style={styles.eyebrow}>A quiet moment</Text>
          <Text style={styles.title}>How are you feeling?</Text>
          <Text style={styles.subtitle}>Choose what is closest. There is no wrong answer.</Text>
        </View>

        <View style={styles.moodList}>
          {moods.map((mood) => {
            const isSelected = selectedMood === mood.id;

            return (
              <Pressable
                key={mood.id}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => chooseMood(mood.id)}
                style={[styles.moodChip, isSelected && styles.moodChipSelected]}
              >
                <Text style={styles.moodLabel}>{mood.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={!selectedMood}
          onPress={continueToVerse}
          style={[styles.continueButton, !selectedMood && styles.continueButtonDisabled]}
        >
          <Text style={styles.continueLabel}>Continue</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 28,
  },
  intro: {
    marginBottom: 32,
  },
  eyebrow: {
    color: colors.muted,
    fontSize: 14,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 14,
    color: colors.ink,
    fontSize: 34,
    fontWeight: '600',
  },
  subtitle: {
    marginTop: 12,
    color: colors.muted,
    fontSize: 17,
    lineHeight: 25,
  },
  moodList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  moodChip: {
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 17,
    paddingVertical: 12,
  },
  moodChipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  moodLabel: {
    color: colors.ink,
    fontSize: 16,
  },
  continueButton: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 28,
    marginTop: 36,
    paddingVertical: 17,
  },
  continueButtonDisabled: {
    backgroundColor: colors.disabled,
  },
  continueLabel: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '600',
  },
});
