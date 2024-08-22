import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Platform } from 'react-native';
import dol from "../assets/img/dol.png"
import Card from '../components/Card';
import HebdoStat from '../components/HebdoStat';
import AddTransaction from '../components/AddTransaction';

export default function Home() {
    const db = useSQLiteContext();
    const [groupedTransactions, setGroupedTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [Type, setType]= useState("")

    // Function to show the modal
    const showModal = ({type}) => {
        setModalVisible(true);
        setType(type)
    };

    // Function to hide the modal
    const hideModal = () => {
        setModalVisible(false);
    };

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    }

    const getData = async () => {
        const transactions = await db.getAllAsync('SELECT * FROM transactions');
        const categories = await db.getAllAsync('SELECT * FROM categories');
        setCategories(categories)
        const grouped = groupByDate(transactions);
        console.log(grouped);
        setGroupedTransactions(grouped);
    };
    const getLinkById = (id) => {
        const category = categories.find(category => category.id === id);
        return category ? category.link : null; // Return the link or null if not found
    };

    const groupByDate = (transactions) => {
        return transactions.reduce((groups, transaction) => {
            const date = transaction.date.split(' ')[0]; // Assuming date is in 'YYYY-MM-DD HH:MM:SS' format
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
                       
                    />
                ))}
            </View>
        );
    };

    // Convert grouped transactions object into a list for FlatList
    const groupedData = Object.keys(groupedTransactions).map(date => ({
        date,
        data: groupedTransactions[date],
    }));

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.line}>
                    <Text style={styles.defaultText}>Available</Text>
                    <Text style={styles.title}>15000 FCFA</Text>
                </View>
                <HebdoStat/>

                <View style={styles.buttonView}>
                    <TouchableOpacity style={styles.button} onPress={()=>{showModal("expense")}}>
                        <Text style={styles.buttonText}>Expense</Text>
                        <Image source={dol} style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={()=>{showModal("income")}}>
                        <Text style={styles.buttonText}>Deposit</Text>
                        <View style={styles.plusIcon}>
                            <Text style={styles.plusIconText}>+</Text>  
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <AddTransaction visible={modalVisible} onClose={hideModal} cate={categories} type={Type}/>
            <View style={styles.Operation}>
                <View style={styles.headerOperation}>
                    <Text style={{fontSize:16, fontWeight:"500"}}>Operations</Text>
                    <Text style={{fontSize:16, fontWeight:"700", color:"#2D23F3"}}>All</Text>
                </View>

                {/* FlatList for rendering grouped transactions */}
                <FlatList
                    data={groupedData}
                    renderItem={renderTransactionGroup}
                    keyExtractor={(item) => item.date}
                    contentContainerStyle={{ paddingVertical: 20 }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FAFAFA',
        flex: 1, // Ensure the container takes up the full screen
    },
    defaultText:{
        fontSize:16,
        color:"black",
        fontWeight:"300",
    },
    header:{
        padding:20,
    },
    title:{
        fontSize:32,
        fontWeight:"700",
        margin:4,
        marginTop:10,
    },
    button:{
        width:172,
        height:45,
        backgroundColor:"#1A1A1A",
        flexDirection:'row',
        justifyContent:"center",
        alignItems:"center",
        borderRadius:13,
     },
    buttonText:{
        color:"white",
        fontSize:18,
        fontWeight:"500"
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
        marginTop:10,
    },
    plusIcon:{
        width:22,  
        height:22,  
        backgroundColor:'white',
        borderRadius:12.5,  
        alignItems:"center",
        justifyContent:"center",
        marginLeft:7,
    },
    plusIconText:{
        fontSize:28,   
        color: 'black',  
        lineHeight: 28,   
        textAlign: 'center',
    },
    line:{
        paddingBottom:4,
        borderBottomColor: 'black', 
        borderBottomWidth: 1.5,
    },
    Operation: {
        marginTop: 10,  
        backgroundColor: 'white', 
         padding: 20,
        borderTopRightRadius:30,
        borderTopLeftRadius:30,
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
    headerOperation:{
        flexDirection:"row",
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
