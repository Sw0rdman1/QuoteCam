import { View, Text, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function HomeScreen() {
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  const handlePickOrCapture = async () => {
    Alert.alert('Select Image', 'Choose an image source', [
      {
        text: 'Camera',
        onPress: async () => {
          const permission = await ImagePicker.requestCameraPermissionsAsync();
          if (!permission.granted) {
            Alert.alert('Permission Denied', 'Camera access is required.');
            return;
          }

          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
          });

          if (!result.canceled) {
            const uri = result.assets[0].uri;
            setImage(uri);
            router.push({ pathname: '/editor', params: { imageUri: uri } });
          }
        },
      },
      {
        text: 'Gallery',
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
          });

          if (!result.canceled) {
            const uri = result.assets[0].uri;
            setImage(uri);
            router.push({ pathname: '/editor', params: { imageUri: uri } });
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to QuoteCam 📸</Text>
      <Button title="Pick or Capture Image" onPress={handlePickOrCapture} />
      {image && <Image source={{ uri: image }} style={styles.preview} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },

  title: {
    fontSize: 20,
    marginBottom: 16
  },

  preview: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 8
  },
});
