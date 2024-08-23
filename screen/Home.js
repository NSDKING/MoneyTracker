import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Platform } from 'react-native';
import dol from "../assets/img/dol.png";
import Card from '../components/Card';
import HebdoStat from '../components/HebdoStat';
import AddTransaction from '../components/AddTransaction';
import EditTransaction from '../components/EditTransaction';
import { Alert } from 'react-native';
import Operations from '../components/Operations';

export default function Home() {
    const db = useSQLiteContext();
    const [groupedTransactions, setGroupedTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [Type, setType] = useState("");
    const [editId, setEditId] = useState(); 
    const [isEdit, setIsEdit] = useState(false); 
    const [editItem, setEditItem] = useState(); 

    // Function to show the modal
    const showModal = (type) => {
        setModalVisible(true);
        setType(type);
    };

    // Function to hide the modal
    const hideModal = () => {
        setModalVisible(false);
    };

    

    // Formats the date to 'Jul 1, 2024'
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    }

    const handleDelete = async () => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this transaction?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: async () => {
                        try {
                            // Execute the delete operation
                            await db.runAsync(
                                'DELETE FROM transactions WHERE id = $id',
                                { $id: editId }
                            );
                            // Update the state and fetch new data
                            setIsEdit(false);
                            await getData();
                        } catch (error) {
                            console.error("Error deleting transaction:", error);
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    };
    
    const getData = async () => {
        const transactions = await db.getAllAsync('SELECT * FROM transactions');
        const categories = await db.getAllAsync('SELECT * FROM categories');
        setCategories(categories);
        const grouped = groupByDate(transactions);
        setGroupedTransactions(grouped);
     };

    const getLinkById = (id) => {
        const category = categories.find(category => category.id === id);
        return category ? category.link : null;
    };

    const groupByDate = (transactions) => {
        return transactions.reduce((groups, transaction) => {
            const date = (transaction.date); // Use convertToDateOnly here
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(transaction);
            return groups;
        }, {});
    };

    useEffect(() => {
        db.withTransactionAsync(async () => {
            await getData();
        });
    }, [db]);

    const renderTransactionGroup = ({ item }) => {
        return (
            <View>
                <Text style={styles.dateHeader}>{formatDate(item.date)}</Text> 
                {item.data.map((transaction) => (
                    <Card
                        key={transaction.id}
                        img={dol} // Replace with dynamic image source if available
                        item={transaction}
                        link={getLinkById(transaction.category_ID)}
                        setEditId={setEditId}
                        setIsEdit={setIsEdit}
                        setEditItem={setEditItem}
                    />
                ))}
            </View>
        );
    };

    const convertTimestampToDate = (timestamp)=> {
        const formattedDate = timestamp.toISOString().split('T')[0];
        return formattedDate;
      }
    const addTransaction = async (date, amount, note, category_ID, type) => {
        try {
            const result = await db.runAsync(
                'INSERT INTO transactions (date, amount, category_ID, note, type) VALUES (?, ?, ?, ?, ?)', 
                convertTimestampToDate(date), amount, category_ID, note, type // Ensure date is in YYYY-MM-DD format
            );
            getData(); // Refresh the data after insertion
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };

    const editTransaction = async (date, amount, category_ID, note, type) => {
        try {
             const result = await db.runAsync(
                'UPDATE transactions SET date = ?, amount = ?, category_ID = ?, note = ?, type = ? WHERE id = ?',
                convertTimestampToDate(date), amount, category_ID, note, type, editId
            );
    
            // Fetch new data and close edit mode
            await getData();
            setIsEdit(false);
        } catch (error) {
            console.error("Error updating transaction:", error);
    
            // Show error alert
            Alert.alert(
                "Error",
                "There was an issue updating the transaction. Please try again.",
                [{ text: "OK", onPress: () => {} }]
            );
        } finally {
   
    
        }
    };
    

    // Convert grouped transactions object into a list for FlatList and sort by date in descending order
    const groupedData = Object.keys(groupedTransactions).map(date => ({
        date,
        data: groupedTransactions[date],
    })).sort((a, b) => b.date.localeCompare(a.date)); // Sort dates in descending order

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.line}>
                    <Text style={styles.defaultText}>Available</Text>
                    <Text style={styles.title}>15000 FCFA</Text>
                </View>
                <View>
                <HebdoStat />
                    <View style={styles.buttonView}>
                        <TouchableOpacity style={styles.button} onPress={() => { showModal("expense") }}>
                            <Text style={styles.buttonText}>Expense</Text>
                            <Image source={dol} style={styles.icon} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => { showModal("income") }}>
                            <Text style={styles.buttonText}>Deposit</Text>
                            <View style={styles.plusIcon}>
                                <Text style={styles.plusIconText}>+</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <AddTransaction visible={modalVisible} onClose={hideModal} cate={categories} type={Type} addTransaction={addTransaction} />
            <EditTransaction visible={isEdit} onClose={()=>{setIsEdit(false)}} cate={categories} type={Type} editTransaction={editTransaction} onDelete={handleDelete} editItem={editItem}/>

            <Operations
                groupedTransactions={groupedTransactions}
                categories={categories}
                db={db}
                getData={getData}
                formatDate={formatDate}
                setIsEdit={setIsEdit}
                setEditItem={setEditItem}
            />
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FAFAFA',
        flex: 1, // Ensure the container takes up the full screen
    },
    defaultText: {
        fontSize: 16,
        color: "black",
        fontWeight: "300",
    },
    header: {
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: "700",
        margin: 4,
        marginTop: 10,
    },
    button: {
        width: 172,
        height: 45,
        backgroundColor: "#1A1A1A",
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 13,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "500"
    },
    icon: {
        width: 20,
        height: 20,
        marginLeft: 7,
    },
    buttonView: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 10,
    },
    plusIcon: {
        width: 22,
        height: 22,
        backgroundColor: 'white',
        borderRadius: 12.5,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 7,
    },
    plusIconText: {
        fontSize: 28,
        color: 'black',
        lineHeight: 28,
        textAlign: 'center',
    },
    line: {
        paddingBottom: 4,
        borderBottomColor: 'black',
        borderBottomWidth: 1.5,
    },
    Operation: {
        marginTop: 10,
        backgroundColor: 'white',
        padding: 20,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        flex: 1, // Ensure the operation section takes up available space
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    headerOperation: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    dateHeader: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 20,
        marginBottom: 10,
        color: '#333',
    },
});
