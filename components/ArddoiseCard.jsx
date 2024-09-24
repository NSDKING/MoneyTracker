import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity,  } from 'react-native';
import { useNavigation } from '@react-navigation/native';

 
const getRiskColor = (risk) => {
  switch (risk) {
    case 'Ultra Sure':
      return '#4CAF50'; // Green
    case 'Very Low Risk':
      return '#8BC34A'; // Light Green
    case 'Low Risk':
      return '#CDDC39'; // Lime
    case 'Moderate Risk':
      return '#FFEB3B'; // Yellow
    case 'High Risk':
      return '#FFC107'; // Amber
    case 'Very High Risk':
      return '#FF5722'; // Deep Orange
    default:
      return '#9E9E9E'; // Grey
  }
};

 

const ArdoiseCard = ({ item, onEdit }) => {
  const riskColor = getRiskColor(item.risk);
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('ArdoiseData', { ardoiseId: item.id, ardoiseName: item.name });
  };
  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={[styles.card, { borderLeftColor: riskColor }]}>
        <View style={styles.mainInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.amount}>{item.amount} FCFA</Text>
        </View>
        <View style={styles.riskContainer}>
          <Text style={[styles.risk, { color: riskColor }]}>{item.risk}</Text>
          <TouchableOpacity onPress={() => onEdit(item)} style={styles.editButton}>
            <Ionicons name="create-outline" size={24} color="#FF3B30" />
          </TouchableOpacity>

        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
     flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width: '100%', // Increase card width to full screen width minus margins
  },
  mainInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  amount: {
    fontSize: 16,
    color: '#666',
  },
  riskContainer: {
    paddingLeft: 16,
    borderLeftWidth: 1,
    borderLeftColor: '#e0e0e0',
    alignItems: 'flex-end', // Align items to the right
    justifyContent: 'space-between', // Space between risk text and edit button
    minWidth: 110, // Ensure a minimum width for the risk container
    
  },
  risk: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  editButton: {
    marginTop: 8, // Add some space between risk text and edit button
  },
});

export default ArdoiseCard;
