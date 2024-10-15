import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';
import ArdoiseCard from '../components/ArddoiseCard';
import AddArdoiseModal from '../components/AddArdoiseModal';
import EditArdoiseModal from '../components/EditArdoiseModal';

export default function Ardoise() {
  const [ardoises, setArdoises] = useState([]);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editingArdoise, setEditingArdoise] = useState(null);
  const db = useSQLiteContext();
  const navigation = useNavigation();

  useEffect(() => {
    const initDatabase = async () => {
      await createTableIfNotExists();
      await getArdoises();
    };

    initDatabase();
  }, []);

  const createTableIfNotExists = async () => {
    try {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS Ardoise (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          amount INTEGER,
          risk TEXT
        )
      `);
      console.log('Ardoise table created or already exists');
    } catch (error) {
      console.error('Error creating Ardoise table:', error);
    }
  };

  const calculateTotalAmount = async (ardoiseId) => {
    try {
      const transactions = await db.getAllAsync('SELECT * FROM transactions WHERE ardoise_ID = ?', [ardoiseId]);
      const totalAmount = transactions.reduce((total, transaction) => {
        const amount = parseFloat(transaction.amount);
        // Expense adds to the Ardoise, Income subtracts from the Ardoise
        return transaction.type === 'expense' ? total + amount : total - amount;
      }, 0);
      return totalAmount;
    } catch (error) {
      console.error('Error calculating total amount:', error);
      return 0;
    }
  };

  const getArdoises = async () => {
    try {
      const result = await db.getAllAsync('SELECT * FROM Ardoise');
      const ardoisesWithTotalAmount = await Promise.all(result.map(async (ardoise) => {
        const totalAmount = await calculateTotalAmount(ardoise.id);
        return { ...ardoise, totalAmount };
      }));
      setArdoises(ardoisesWithTotalAmount);
    } catch (error) {
      console.error('Error getting Ardoises:', error);
      setArdoises([]);
    }
  };

  const addArdoise = async (name, risk) => {
    try {
      await db.runAsync(
        'INSERT INTO Ardoise (name, amount, risk) VALUES (?, ?, ?)',
        [name, 0, risk]
      );
      getArdoises();
    } catch (error) {
      console.error('Error adding Ardoise:', error);
    }
  };

  const deleteArdoise = async (id) => {
    try {
      await db.runAsync('DELETE FROM Ardoise WHERE id = ?', [id]);
      getArdoises();
      Alert.alert("Success", "Ardoise deleted successfully");
      setEditModalVisible(false);
    } catch (error) {
      console.error('Error deleting Ardoise:', error);
      Alert.alert("Error", "Failed to delete Ardoise. Please try again.");
    }
  };

  const editArdoise = async (id, name, risk) => {
    try {
      await db.runAsync(
        'UPDATE Ardoise SET name = ?, risk = ? WHERE id = ?',
        [name, risk, id]
      );
      getArdoises();
      Alert.alert("Success", "Ardoise updated successfully");
    } catch (error) {
      console.error('Error editing Ardoise:', error);
      Alert.alert("Error", "Failed to update Ardoise. Please try again.");
    }
  };

  const handleEditPress = (item) => {
    setEditingArdoise(item);
    setEditModalVisible(true);
  };

  const handleDeletePress = (id) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this Ardoise?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => deleteArdoise(id), style: "destructive" }
      ]
    );
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setEditingArdoise(null);
  };

  const handleArdoisePress = (item) => {
    navigation.navigate('ArdoiseDataPage', {
      ardoiseId: item.id,
      ardoiseName: item.name,
      ardoiseAmount: item.totalAmount
    });
  };

  const renderArdoiseItem = ({ item }) => (
    <ArdoiseCard 
      item={item} 
      onEdit={() => handleEditPress(item)} 
      onPress={() => handleArdoisePress(item)}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={ardoises}
        renderItem={renderArdoiseItem}
        keyExtractor={item => item.id.toString()}
        style={styles.list}
      />

      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => setAddModalVisible(true)}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      <AddArdoiseModal
        visible={isAddModalVisible}
        onClose={() => setAddModalVisible(false)}
        addArdoise={addArdoise}
      />

      <EditArdoiseModal
        visible={isEditModalVisible}
        onClose={closeEditModal}
        editArdoise={editArdoise}
        onDelete={handleDeletePress}
        editItem={editingArdoise}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    flex: 1,
  },
  ardoiseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: 'tomato',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
