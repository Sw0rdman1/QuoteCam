import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Button, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { MOCK_QUOTES } from '../constants/quotes';

const quote = MOCK_QUOTES[Math.floor(Math.random() * MOCK_QUOTES.length)];

export default function EditorScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();

  const [textColor, setTextColor] = useState('#ffffff');
  const [position, setPosition] = useState<'top' | 'center' | 'bottom'>('bottom');
  const [font, setFont] = useState<'normal' | 'serif' | 'monospace'>('normal');

  const textStyle = [
    styles.quoteText,
    { color: textColor },
    font === 'serif' && { fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }) },
    font === 'monospace' && { fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }) },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.previewWrapper}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <View style={[styles.overlay, styles[position]]}>
          <Text style={textStyle}>"{quote?.text}"</Text>
          <Text style={[textStyle, { fontSize: 14, opacity: 0.8 }]}>- {quote?.author}</Text>
        </View>
      </View>

      {/* POSITION CONTROLS */}
      <Text style={styles.label}>Position</Text>
      <View style={styles.row}>
        {['top', 'center', 'bottom'].map((pos) => (
          <TouchableOpacity key={pos} onPress={() => setPosition(pos as any)} style={styles.button}>
            <Text>{pos}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* COLOR CONTROLS */}
      <Text style={styles.label}>Color</Text>
      <View style={styles.row}>
        {['#ffffff', '#000000', '#ff69b4', '#00ffff'].map((color) => (
          <TouchableOpacity key={color} onPress={() => setTextColor(color)} style={[styles.colorButton, { backgroundColor: color }]} />
        ))}
      </View>

      {/* FONT CONTROLS */}
      <Text style={styles.label}>Font</Text>
      <View style={styles.row}>
        {['normal', 'serif', 'monospace'].map((f) => (
          <TouchableOpacity key={f} onPress={() => setFont(f as any)} style={styles.button}>
            <Text>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button
        title="Next: Share"
        onPress={() =>
          router.push({
            pathname: '/share',
            params: {
              imageUri,
              quoteId: quote.id,
              textColor,
              position,
              font,
            },
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  previewWrapper: { width: '100%', height: 350, position: 'relative', marginBottom: 20 },
  image: { width: '100%', height: '100%', borderRadius: 10 },
  overlay: {
    position: 'absolute',
    left: 10,
    right: 10,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
  },
  top: { top: 10 },
  center: { top: '40%' },
  bottom: { bottom: 10 },
  quoteText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
  },
  label: { marginTop: 12, fontWeight: 'bold' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginVertical: 6 },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 6,
  },
  colorButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#888',
    marginRight: 8,
  },
});
