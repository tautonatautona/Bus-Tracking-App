import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { database } from '../Firebase/firebaseConfig'; // Firebase config
import { ref, set, get } from 'firebase/database';

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [routes, setRoutes] = useState([]);
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [address, setAddress] = useState('Fetching location...');
  const userId = "user123"; // Change dynamically for multiple users

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission denied');
        return;
      }

      // Get current location
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      // Reverse geocode to get address
      const geoCode = await Location.reverseGeocodeAsync(loc.coords);
      if (geoCode.length > 0) {
        setAddress(`${geoCode[0].name}, ${geoCode[0].city}, ${geoCode[0].country}`);
      }

      // Save location to Firebase
      updateLocationInFirebase(loc.coords);
    })();

    // Real-time location tracking
    const locationWatcher = Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
      (loc) => {
        setLocation(loc.coords);
        updateLocationInFirebase(loc.coords);
      }
    );

    return () => {
      locationWatcher.then((subscription) => subscription.remove());
    };
  }, []);

  // Function to update location in Firebase
  const updateLocationInFirebase = (coords) => {
    set(ref(database, `users/${userId}/location`), {
      latitude: coords.latitude,
      longitude: coords.longitude,
      timestamp: new Date().toISOString(),
    });
  };

  // Fetch routes from Firebase
  const fetchRoutes = async () => {
    const snapshot = await get(ref(database, 'routes'));
    if (snapshot.exists()) {
      const allRoutes = snapshot.val();
      const filteredRoutes = Object.values(allRoutes).filter(route =>
        route.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setRoutes(filteredRoutes);
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.input}
        placeholder="Search for a route"
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
        onSubmitEditing={fetchRoutes}
      />

      {/* Map View */}
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        mapType="standard"
        showsBuildings={true}
      >
        {location && (
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title="Your Location"
            description={address}
            pinColor="blue"
          />
        )}
      </MapView>

      {/* Route List */}
      <FlatList
        data={routes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.routeItem}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 8 },
  map: { width: '100%', height: '50%', marginBottom: 10 },
  routeItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
});

export default HomeScreen;
