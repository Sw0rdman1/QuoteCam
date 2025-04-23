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
    container: {
        flex: 1,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    imageWrapper: {
        width: 320,
        height: 320,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
        backgroundColor: '#00000010',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        padding: 14,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
    },
    top: {
        top: 20,
        left: 20,
        right: 20,
    },
    center: {
        top: '40%',
        left: 20,
        right: 20,
        transform: [{ translateY: -50 }],
    },
    bottom: {
        bottom: 20,
        left: 20,
        right: 20,
    },
    quoteText: {
        fontSize: 18,
        fontStyle: 'italic',
        textAlign: 'center',
        color: '#fff',
        lineHeight: 24,
    },
    quoteAuthor: {
        fontSize: 14,
        color: '#e0e0e0',
        marginTop: 8,
        textAlign: 'right',
        fontStyle: 'normal',
    },
});

