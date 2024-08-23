import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Platform, Alert, TouchableOpacity } from 'react-native';
import Card from './Card';

export default function Operations({ groupedTransactions, categories, db, getData, formatDate, setIsEdit, setEditItem }) {
    const [editId, setEditId] = useState(null);

    const renderTransactionGroup = ({ item }) => {
        return (
            <View>
                <Text style={styles.dateHeader}>{formatDate(item.date)}</Text>
                {item.data.map((transaction) => (
                    <Card
                        key={transaction.id}
                        img={require("../assets/img/dol.png")} // Replace with dynamic image source if available
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

    const getLinkById = (id) => {
        const category = categories.find(category => category.id === id);
        return category ? category.link : null;
    };

    // Convert grouped transactions object into a list for FlatList and sort by date in descending order
    const groupedData = Object.keys(groupedTransactions).map(date => ({
        date,
        data: groupedTransactions[date],
    })).sort((a, b) => b.date.localeCompare(a.date)); // Sort dates in descending order

    return (
        <View style={styles.Operation}>
            <View style={styles.headerOperation}>
                <Text style={{ fontSize: 16, fontWeight: "500" }}>Operations</Text>
                <TouchableOpacity>
                    <Text style={{ fontSize: 16, fontWeight: "700", color: "#2D23F3" }}>All</Text>

                </TouchableOpacity>
             </View>

            <FlatList
                data={groupedData}
                renderItem={renderTransactionGroup}
                keyExtractor={(item) => item.date}
                contentContainerStyle={{ paddingVertical: 20 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    Operation: {
        marginTop: 10,
        backgroundColor: 'white',
        padding: 20,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        flex: 1, 
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
