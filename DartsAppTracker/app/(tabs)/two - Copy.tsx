import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, AsyncStorage, Button, ScrollView, ImageBackground } from 'react-native';

const Dartboard = () => {
  const [dartThrows, setDartThrows] = useState([]);
  const [confirmedSets, setConfirmedSets] = useState([]);

  useEffect(() => {
    // Load dart throw history from AsyncStorage when component mounts
    loadDartThrows();
  }, []);

  const loadDartThrows = async () => {
    try {
      const savedDartThrows = await AsyncStorage.getItem('dartThrows');
      if (savedDartThrows !== null) {
        setConfirmedSets(JSON.parse(savedDartThrows));
      }
    } catch (error) {
      console.error('Error loading dart throws:', error);
    }
  };

  const saveDartThrow = async (dartThrow) => {
    try {
      const updatedDartThrows = [...dartThrows, dartThrow];
      setDartThrows(updatedDartThrows);
      if (updatedDartThrows.length === 3) {
        // Automatically confirm set when 3 darts are thrown
        confirmSet(updatedDartThrows);
      }
    } catch (error) {
      console.error('Error saving dart throw:', error);
    }
  };

  const confirmSet = (dartThrowSet) => {
    setConfirmedSets([...confirmedSets, dartThrowSet]);
    setDartThrows([]);
  };

  const handleDartThrow = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    const dartThrow = { x: locationX, y: locationY };
    saveDartThrow(dartThrow);
  };

  return (
    <View style={styles.container}>
      {/* Render the dartboard */}
      <ImageBackground source={require('C:\Users\MarnickClé\OneDrive - Nordend\GitKraken\DartsApp\DartsAppTracker\assets\images\dartboard.png')} style={styles.dartboard}>
        <TouchableOpacity style={styles.dartboardArea} onPress={handleDartThrow}>
          {/* Add graphics for the dartboard here */}
        </TouchableOpacity>
      </ImageBackground>

      {/* Render the dart throws */}
      <ScrollView style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Dart Throw History</Text>
        {confirmedSets.map((set, index) => (
          <View key={index} style={styles.dartThrowSet}>
            {set.map((throwCoords, idx) => (
              <Text key={idx} style={styles.dartThrow}>
                Dart #{index * 3 + idx + 1}: X: {throwCoords.x}, Y: {throwCoords.y}
              </Text>
            ))}
          </View>
        ))}
        {dartThrows.length === 3 && (
          <Button title="Confirm Set" onPress={() => confirmSet([...dartThrows])} />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dartboard: {
    width: 300,
    height: 300,
    borderRadius: 150,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'cover',
  },
  dartboardArea: {
    width: '100%',
    height: '100%',
    // Add any additional styles for the dartboard area here
  },
  historyContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    maxHeight: 200, // Adjust as needed
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dartThrowSet: {
    marginBottom: 10,
  },
  dartThrow: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default Dartboard;

