import { View, Text, ImageBackground, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export const IMAGE_ADRESS = 'https://img.freepik.com/free-vector/background-banner-colorful-gradient-design_677411-3543.jpg'

export default function HomeScreen() {
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  const fade = useSharedValue(0);
  const translateY = useSharedValue(30);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    fade.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) });
    translateY.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.ease) });
  }, []);

  const handleCamera = async () => {
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
  }

  const handleGalleryAccess = async () => {
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
  }

  return (
    <ImageBackground
      source={{ uri: IMAGE_ADRESS }} // Replace with your app's background
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome to</Text>
        <Text style={[styles.title, { fontSize: 40 }]}>QuoteCam 📸</Text>
        <Text style={styles.subtitle}>Capture moments. Add words. Inspire.</Text>

        <Animated.View style={[styles.buttonContainer, animatedButtonStyle]}>
          <TouchableOpacity style={styles.button} onPress={handleCamera}>
            <Ionicons name="camera" size={28} color="white" />
            <Text style={styles.buttonText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleGalleryAccess}>
            <Ionicons name="image" size={28} color="white" />
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>
        </Animated.View>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#ccc',
    marginBottom: 32,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    backgroundColor: '#ffffff20',
    borderColor: '#fff',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 20,
    fontWeight: '600',
  },
});
