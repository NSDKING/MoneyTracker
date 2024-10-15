import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';

const ArdoiseDataPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { ardoiseId, ardoiseName } = route.params;
  const [transactions, setTransactions] = useState([]);
  const [ardoiseAmount, setArdoiseAmount] = useState(0);
  const db = useSQLiteContext();

  useEffect(() => {
    const fetchTransactions = async () => {
      const fetchedTransactions = await db.getAllAsync('SELECT * FROM transactions WHERE ardoise_ID = ?', [ardoiseId]);
      setTransactions(fetchedTransactions);
      

        // Calculate the sum of all transactions
        const sum = fetchedTransactions.reduce((total, transaction) => {
            const amount = parseFloat(transaction.amount);
            return total + amount;
        }, 0);
        

      // Update the Ardoise amount in the database
      await db.runAsync(
        'UPDATE Ardoise SET amount = ? WHERE id = ?',
        [sum, ardoiseId]
      );

      // Update the local state
      setArdoiseAmount(sum);
          
    };

    fetchTransactions();
  }, [ardoiseId, db]);

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionHeader}>
        <Text style={styles.transactionDate}>{new Date(item.date).toLocaleDateString()}</Text>
        <Text style={[styles.transactionAmount, { color: item.type === 'expense' ? '#F44336' : '#4CAF50' }]}>
          {item.type === 'expense' ? '-' : '+'} {Math.abs(item.amount)} FCFA
        </Text>
      </View>
      <Text style={styles.transactionDescription}>{item.note}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.defaultText}>Ardoise</Text>
          <Text style={styles.title}>{ardoiseName}</Text>
        </View>
      </View>
      <View style={styles.amountContainer}>
        <Text style={styles.amountText}>{ardoiseAmount.toFixed(2)} FCFA</Text>
      </View>
      <FlatList
        data={transactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No transactions found</Text>}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: StatusBar.currentHeight + 20,
  },
  headerText: {
    marginLeft: 16,
  },
  defaultText: {
    fontSize: 16,
    color: "black",
    fontWeight: "300",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginTop: 4,
  },
  amountContainer: {
    padding: 20,
    borderBottomWidth: 1.5,
    borderBottomColor: 'black',
    marginBottom: 20,
  },
  amountText: {
    fontSize: 24,
    fontWeight: "600",
    color: '#1A1A1A',
  },
  backButton: {
    padding: 8,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  transactionItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 13,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: "500",
  },
  transactionDescription: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
    color: '#666',
  },
});

export default ArdoiseDataPage;
