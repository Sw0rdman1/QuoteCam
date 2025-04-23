import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Button,
  Platform,
  ScrollView,
} from 'react-native';
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.previewWrapper}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <View style={[styles.overlay, styles[position]]}>
          <Text style={textStyle}>"{quote?.text}"</Text>
          <Text style={[textStyle, { fontSize: 14, opacity: 0.8 }]}>- {quote?.author}</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', }}>
        <Text style={styles.label}>🧭 Position</Text>
        <View style={styles.row}>
          {['top', 'center', 'bottom'].map((pos) => (
            <TouchableOpacity
              key={pos}
              onPress={() => setPosition(pos as any)}
              style={[styles.button, position === pos && styles.activeButton]}
            >
              <Text style={[styles.buttonText, position === pos && styles.activeButtonText]}>
                {pos.charAt(0).toUpperCase() + pos.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', }}>
        <Text style={styles.label}>🎨 Text Color</Text>
        <View style={styles.row}>
          {['#ffffff', '#000000', '#ff69b4', '#00ffff', '#FFD700'].map((color) => (
            <TouchableOpacity
              key={color}
              onPress={() => setTextColor(color)}
              style={[
                styles.colorButton,
                { backgroundColor: color },
                textColor === color && styles.selectedColor,
              ]}
            />
          ))}
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', }}>

        <Text style={styles.label}>🔤 Font</Text>
        <View style={styles.row}>
          {['normal', 'serif', 'monospace'].map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFont(f as any)}
              style={[styles.button, font === f && styles.activeButton]}
            >
              <Text style={[styles.buttonText, font === f && styles.activeButtonText]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.shareButton, { marginTop: 20 }]}
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
      >
        <Text style={styles.shareTexts}>💾 Save & Share</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 14,
    textAlign: 'center',
  },
  previewWrapper: {
    width: '100%',
    height: 350,
    position: 'relative',
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  image: {
    width: '100%',
    height: '100%',
  },
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
  },
  label: {
    fontWeight: '600',
    fontSize: 20,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
    alignItems: 'center',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    backgroundColor: '#fff',
    marginRight: 8,
    marginBottom: 6,
  },
  activeButton: {
    backgroundColor: '#d0ebff',
    borderColor: '#339af0',
  },
  buttonText: {
    fontSize: 14,
  },
  activeButtonText: {
    fontWeight: 'bold',
    color: '#339af0',
  },
  colorButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#888',
    marginRight: 8,
  },
  selectedColor: {
    borderColor: '#339af0',
    borderWidth: 2,
  },
  shareButton: {
    backgroundColor: '#339af0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareTexts: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: 'Lato_400Regular',
  },
});
