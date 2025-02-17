// screens/DriverHomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, MapView, Marker } from 'react-native';
import * as Location from 'expo-location';
import { database } from '../firebaseConfig';

const DriverHomeScreen = () => {
  const [location, setLocation] = useState(null);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      const snapshot = await database.ref('customers').once('value');
      if (snapshot.exists()) {
        setCustomers(Object.values(snapshot.val()));
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location?.latitude || 0,
          longitude: location?.longitude || 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {customers.map((customer, index) => (
          <Marker key={index} coordinate={{ latitude: customer.lat, longitude: customer.lng }} />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
});

export default DriverHomeScreen;