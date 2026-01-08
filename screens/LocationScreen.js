import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useState } from 'react';

// Uygulama açıkken bildirimlerin görünmesi için gerekli ayar (PDF'te belirtilmese de Expo için gereklidir)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function LocationScreen() {
  const [coords, setCoords] = useState(null);

  const getLocation = async () => {
    // 1. Konum İzni İste
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Location permission required');
      return;
    }

    // 2. Konumu Al
    const location = await Location.getCurrentPositionAsync({});
    setCoords(location.coords);

    // 3. Bildirim İzni İste ve Bildirim Gönder
    await Notifications.requestPermissionsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Location Retrieved',
        body: 'Your GPS location was successfully fetched.',
      },
      trigger: null, // Tetikleyici null olunca hemen gönderir
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Get Current Location" onPress={getLocation} />
      {coords && (
        <Text style={styles.text}>
          Lat: {coords.latitude} {"\n"}
          Lng: {coords.longitude}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
  }
});