import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';

const ArdoiseDataPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { ardoiseId, ardoiseName } = route.params;
  const [transactions, setTransactions] = useState([]);
  const db = useSQLiteContext();


  useEffect(() => {
    const fetchTransactions = async () => {
      const fetchedTransactions = await db.getAllAsync('SELECT * FROM transactions');
      const transactionsByArdoiseID = fetchedTransactions.find((transaction)=>transaction.id==ardoiseId);
      setTransactions(transactionsByArdoiseID);
      console.log(transactionsByArdoiseID);
    };

    fetchTransactions();
  }, [ardoiseId, db]);

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionDate}>{new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.transactionAmount}>{item.amount} FCFA</Text>
      <Text style={styles.transactionDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{ardoiseName}</Text>
      </View>
      <FlatList
        data={transactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No transactions found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  transactionItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  transactionDescription: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
    color: '#666',
  },
});

export default ArdoiseDataPage;
