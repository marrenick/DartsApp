import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, AsyncStorage } from 'react-native';

const Dartboard = () => {
  const [dartThrows, setDartThrows] = useState([]);

  useEffect(() => {
    // Load dart throw history from AsyncStorage when component mounts
    loadDartThrows();
  }, []);

  const loadDartThrows = async () => {
    try {
      const savedDartThrows = await AsyncStorage.getItem('dartThrows');
      if (savedDartThrows !== null) {
        setDartThrows(JSON.parse(savedDartThrows));
      }
    } catch (error) {
      console.error('Error loading dart throws:', error);
    }
  };

  const saveDartThrow = async (dartThrow) => {
    try {
      const updatedDartThrows = [...dartThrows, dartThrow];
      setDartThrows(updatedDartThrows);
      await AsyncStorage.setItem('dartThrows', JSON.stringify(updatedDartThrows));
    } catch (error) {
      console.error('Error saving dart throw:', error);
    }
  };

  const handleDartThrow = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    const dartThrow = { x: locationX, y: locationY };
    saveDartThrow(dartThrow);
  };

  const renderDartThrowSets = () => {
    const dartThrowSets = [];
    for (let i = 0; i < dartThrows.length; i += 3) {
      const dartThrowSet = dartThrows.slice(i, i + 3);
      dartThrowSets.push(
        <View key={i} style={styles.dartThrowSet}>
          {dartThrowSet.map((throwCoords, index) => (
            <Text key={index} style={styles.dartThrow}>
              Dart #{i + index + 1}: X: {throwCoords.x}, Y: {throwCoords.y}
            </Text>
          ))}
        </View>
      );
    }
    return dartThrowSets;
  };

  return (
    <View style={styles.container}>
      {/* Render the dartboard */}
      <View style={styles.dartboard}>
        <TouchableOpacity style={styles.dartboardArea} onPress={handleDartThrow}>
          {/* Add graphics for the dartboard here */}
        </TouchableOpacity>
      </View>

      {/* Render the dart throw sets */}
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Dart Throw History</Text>
        {renderDartThrowSets()}
      </View>
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
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dartboardArea: {
    width: '100%',
    height: '100%',
    // Add any additional styles for the dartboard area here
  },
  historyContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
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
