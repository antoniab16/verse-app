export type Mood = {
  id: string;
  label: string;
  references: string[];
};

// References only: verse text is fetched from the public-domain Bible API.
export const moods: Mood[] = [
  { id: 'anxious', label: 'Anxious', references: ['Philippians 4:6-7', 'Isaiah 41:10', 'John 14:27', 'Psalm 55:22', '1 Peter 5:7', 'Psalm 56:3', 'Matthew 6:34', 'Psalm 94:19'] },
  { id: 'sad', label: 'Sad', references: ['Psalm 34:18', 'Psalm 30:5', 'Matthew 5:4', 'Revelation 21:4', 'Psalm 147:3', 'John 16:33', 'Psalm 42:11', '2 Corinthians 1:3-4'] },
  { id: 'lonely', label: 'Lonely', references: ['Deuteronomy 31:8', 'Psalm 68:6', 'Matthew 28:20', 'Psalm 23:4', 'Hebrews 13:5', 'Isaiah 43:2', 'Psalm 139:7-10', 'John 14:18'] },
  { id: 'tired', label: 'Tired', references: ['Matthew 11:28', 'Isaiah 40:31', 'Psalm 23:1-3', 'Exodus 33:14', 'Psalm 4:8', 'Jeremiah 31:25', 'Psalm 127:2', 'Mark 6:31'] },
  { id: 'overwhelmed', label: 'Overwhelmed', references: ['Psalm 46:1', 'Isaiah 43:2', 'Psalm 61:2', 'Psalm 62:5-6', 'Nahum 1:7', 'Psalm 121:1-2', 'John 16:33', '2 Thessalonians 3:16'] },
  { id: 'angry', label: 'Angry', references: ['Proverbs 15:1', 'James 1:19-20', 'Ephesians 4:26-27', 'Proverbs 14:29', 'Proverbs 16:32', 'Colossians 3:8', 'Proverbs 19:11', 'Psalm 37:8'] },
  { id: 'grieving', label: 'Grieving', references: ['Matthew 5:4', 'Psalm 34:18', 'Psalm 23:4', 'John 11:35', 'Psalm 73:26', 'Lamentations 3:22-23', 'Psalm 147:3', '2 Corinthians 1:3-4'] },
  { id: 'hopeful', label: 'Hopeful', references: ['Romans 15:13', 'Jeremiah 29:11', 'Isaiah 43:19', 'Psalm 130:5', 'Lamentations 3:24', 'Hebrews 10:23', 'Romans 8:28', 'Psalm 42:11'] },
  { id: 'grateful', label: 'Grateful', references: ['Psalm 107:1', '1 Thessalonians 5:18', 'Colossians 3:15', 'Psalm 100:4', 'James 1:17', 'Psalm 103:2', 'Colossians 4:2', 'Psalm 92:1'] },
  { id: 'guidance', label: 'Seeking guidance', references: ['Proverbs 3:5-6', 'Psalm 32:8', 'James 1:5', 'Psalm 25:4-5', 'Isaiah 30:21', 'Psalm 119:105', 'Proverbs 16:9', 'John 16:13'] },
];
