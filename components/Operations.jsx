import React, { useRef, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Platform, TouchableOpacity, Animated } from 'react-native';
import Card from './Card';

export default function Operations({ groupedTransactions, categories, formatDate, setIsEdit, setEditItem, setEditId, isOper, setIsOper }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [groupedTransactions]);

    const renderTransactionGroup = ({ item }) => {
        return (
            <View>
                <Text style={styles.dateHeader}>{formatDate(item.date)}</Text>
                {item.data.map((transaction) => (
                    <Card
                        key={transaction.id}
                        img={require("../assets/img/dol.png")}
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

    const groupedData = Object.keys(groupedTransactions).map(date => ({
        date,
        data: groupedTransactions[date],
    })).sort((a, b) => b.date.localeCompare(a.date));

    return (
        <Animated.View style={[styles.Operation, { opacity: fadeAnim }]}>
            <View style={styles.headerOperation}>
                <Text style={{ fontSize: 16, fontWeight: "500" }}>Operations</Text>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => { setIsOper(!isOper) }}>
                    <Text style={{ fontSize: 16, fontWeight: "700", color: "#2D23F3" }}>{(!isOper ? "All" : "Close")}</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={groupedData}
                renderItem={renderTransactionGroup}
                keyExtractor={(item) => item.date}
                contentContainerStyle={{ paddingVertical: 20 }}
            />
        </Animated.View>
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
        justifyContent: "space-between",
        margin:0,
    },
    dateHeader: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 20,
        marginBottom: 10,
        color: '#333',
    },
    button:{
  
    }
});
