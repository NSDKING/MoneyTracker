import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Animated, Alert } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import dol from '../assets/img/dol.png';
import AddTransaction from '../components/AddTransaction';
import EditTransaction from '../components/EditTransaction';
import Operations from '../components/Operations';
import HebdoStat from '../components/HebdoStat';
import { formatDate, convertTimestampToDate } from '../utils/dateUtils'; 

export default function Home() {
    const db = useSQLiteContext();
    const [groupedTransactions, setGroupedTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [ardoises, setArdoises] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [type, setType] = useState("");
    const [editId, setEditId] = useState();
    const [isEdit, setIsEdit] = useState(false);
    const [editItem, setEditItem] = useState();
    const [isOper, setIsOper] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    const showModal = (type) => {
        setModalVisible(true);
        setType(type);
    };

    const hideModal = () => {
        setModalVisible(false);
    };

    const handleDelete = async () => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this transaction?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "OK",
                    onPress: async () => {
                        try {
                            await db.runAsync('DELETE FROM transactions WHERE id = ?', [editId]);
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
        try {
            setLoading(true);
            const fetchedTransactions = await db.getAllAsync('SELECT * FROM transactions');
            const fetchedArdoises = await db.getAllAsync('SELECT * FROM Ardoise');
            const categories = await db.getAllAsync('SELECT * FROM categories');
            console.log(categories)
            setCategories(categories);
            setArdoises(fetchedArdoises);
            const grouped = groupByDate(fetchedTransactions);
            setGroupedTransactions(grouped);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const groupByDate = (transactions) => {
        return transactions.reduce((groups, transaction) => {
            const date = convertTimestampToDate(transaction.date);
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(transaction);
            return groups;
        }, {});
    };

    const insertDefaultCategories = async () => {
        const categories = {
            expense: [
                "Tuition and Fees",
                "School Supplies",
                "Books and Textbooks",
                "Transportation",
                "Lunch and Snacks",
                "Extracurricular Activities",
                "Clothing",
                "Technology",
                "Personal Care",
                "Entertainment"
            ],
            income: [
                "Allowance",
                "Part-Time Job",
                "Tutoring",
                "Gifts/Monetary Gifts",
                "Selling Crafts or Products",
                "Scholarships or Grants",
                "Freelance Work"
            ]
        };
    
        try {
            // Clear existing categories if necessary
            await db.runAsync('DELETE FROM Categories');
    
            // Insert new categories with the appropriate type
            for (const [type, items] of Object.entries(categories)) {
                for (const item of items) {
                    await db.runAsync(
                        'INSERT INTO Categories (name, link, src, type) VALUES (?, ?, ?, ?)', 
                        [item, null, null, type]  
                    );
                }
            }
            console.log('Default categories inserted successfully.');
        } catch (error) {
            console.error('Error inserting default categories:', error);
        }
    };
    
    const createCategoriesTable = async () => {
        try {
            // Create a new categories table with the updated structure
            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS new_categories (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT UNIQUE,
                    link TEXT,
                    src TEXT,
                    type TEXT CHECK(type IN ('expense', 'income'))
                )
            `);
            console.log('New categories table created.');
    
            // Copy data from the old categories table to the new one
            await db.runAsync(`
                INSERT INTO new_categories (name, link, src, type)
                SELECT name, link, src, NULL FROM Categories
            `);
    
            // Drop the old categories table
            await db.runAsync('DROP TABLE Categories');
    
            // Rename the new categories table to the original name
            await db.runAsync('ALTER TABLE new_categories RENAME TO Categories');
    
            console.log('Categories table updated successfully.');
        } catch (error) {
            console.error('Error creating/updating categories table:', error);
        }
    };

    useEffect(() => {
        db.withTransactionAsync(async () => {
            await getData();
            await insertDefaultCategories();  
        });
    }, [db]);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: isOper ? 0 : 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isOper]);

    const addTransaction = async (date, amount, note, category_ID, type, ardoise_ID) => {
        try {
            await db.runAsync(
                'INSERT INTO transactions (date, amount, category_ID, note, type) VALUES (?, ?, ?, ?, ?, ?)', 
                [convertTimestampToDate(date), amount, category_ID, note, type]
            );
            getData();
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };

    const editTransaction = async (date, amount, category_ID, note, type, ardoise_ID) => {
        try {
            await db.runAsync(
                'UPDATE transactions SET date = ?, amount = ?, category_ID = ?, note = ?, type = ?, ardoise_ID = ? WHERE id = ?',
                [convertTimestampToDate(date), amount, category_ID, note, type, ardoise_ID, editId]
            );
            await getData();
            setIsEdit(false);
        } catch (error) {
            console.error("Error updating transaction:", error);
            Alert.alert("Error", "There was an issue updating the transaction. Please try again.");
        }
    };

    const deleteAllTransactions = async () => {
        try {
            await db.runAsync('DELETE FROM transactions');
        } catch (error) {
            console.error('Error deleting transactions:', error);
        }
    };
    const filteredCategories = categories.filter(category => category.type === type);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.line}>
                    <Text style={styles.defaultText}>Available</Text>
                    <Text style={styles.title}>15000 FCFA</Text>
                </View>
                {!isOper && (
                    <Animated.View style={{ opacity: fadeAnim }}>
                        {!loading && <HebdoStat transactions={groupedTransactions}/>}

                        <View style={styles.buttonView}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => showModal("expense")}
                                accessibilityLabel="Add Expense"
                            >
                                <Text style={styles.buttonText}>Expense</Text>
                                <Image source={dol} style={styles.icon} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => showModal("income")}
                                accessibilityLabel="Add Deposit"
                            >
                                <Text style={styles.buttonText}>Deposit</Text>
                                <View style={styles.plusIcon}>
                                    <Text style={styles.plusIconText}>+</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                )}
            </View>

            {loading && <Text>Loading...</Text>}
            {error && <Text>{error}</Text>}

            <AddTransaction
                visible={modalVisible}
                onClose={hideModal}
                cate={filteredCategories}
                type={type}
                addTransaction={addTransaction}
                Ardoises={ardoises}
            />
            <EditTransaction
                visible={isEdit}
                onClose={() => setIsEdit(false)}
                cate={filteredCategories}
                type={type}
                editTransaction={editTransaction}
                onDelete={handleDelete}
                editItem={editItem}
                Ardoises={ardoises}
            />
            <Operations
                groupedTransactions={groupedTransactions}
                categories={filteredCategories}
                formatDate={formatDate}
                setIsEdit={setIsEdit}
                setEditItem={setEditItem}
                setEditId={setEditId}
                isOper={isOper}
                setIsOper={setIsOper}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FAFAFA',
        flex: 1,
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
});
