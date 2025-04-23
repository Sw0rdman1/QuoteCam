import React, { useRef } from 'react';
import { View, Text, Button, Image, StyleSheet, Share, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MOCK_QUOTES } from '../constants/quotes';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

export default function ShareScreen() {
    const { imageUri, quoteId, textColor, position, font } = useLocalSearchParams<{
        imageUri: string;
        quoteId: string;
        textColor: string;
        position: 'top' | 'center' | 'bottom';
        font: 'normal' | 'serif' | 'monospace';
    }>();

    const quote = MOCK_QUOTES.find((q) => q.id === quoteId);
    const viewRef = useRef<View>(null);

    // Handle image sharing
    const onShareImage = async () => {
        try {
            if (!viewRef.current) return;

            const uri = await captureRef(viewRef, {
                format: 'png',
                quality: 1,
            });

            const permission = await MediaLibrary.requestPermissionsAsync();
            if (!permission.granted) {
                Alert.alert('Permission required', 'Please allow media access to save the image.');
                return;
            }

            await MediaLibrary.saveToLibraryAsync(uri);

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri);
            } else {
                await Share.share({ url: uri });
            }
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Could not share the image.');
        }
    };

    if (!quote) {
        return <Text>Quote not found!</Text>;
    }

    // Style for quote text
    const textStyle = [
        styles.quoteText,
        { color: textColor },
        font === 'serif' && { fontFamily: 'Georgia' },
        font === 'monospace' && { fontFamily: 'Courier' },
    ];

    // Positioning the quote based on the selected position
    const overlayPosition = styles[position] || styles.center;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Quote Image</Text>
            <ViewShot ref={viewRef} style={styles.imageWrapper}>
                <Image source={{ uri: imageUri }} style={styles.image} />
                <View style={[styles.overlay, overlayPosition]}>
                    <Text style={textStyle}>"{quote.text}"</Text>
                    <Text style={[textStyle, { fontSize: 14, opacity: 0.8 }]}>- {quote.author}</Text>
                </View>
            </ViewShot>
            <Button title="Save & Share" onPress={onShareImage} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: 20, marginBottom: 16 },
    imageWrapper: { width: 300, height: 300, position: 'relative' },
    image: { width: '100%', height: '100%', borderRadius: 8 },
    overlay: {
        position: 'absolute',
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 6,
    },
    top: { top: 10, left: 10, right: 10 },
    center: { top: '40%' },
    bottom: { bottom: 10, left: 10, right: 10 },
    quoteText: { color: 'white', fontSize: 16, fontStyle: 'italic', textAlign: 'center' },
    quoteAuthor: { color: '#ccc', fontSize: 14, textAlign: 'right', marginTop: 4 },
});
