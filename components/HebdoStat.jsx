import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const maxHeight = 140;

export default function HebdoStat({ transactions }) {
    const [weekData, setWeekData] = useState({
        expense: [0, 0, 0, 0, 0, 0, 0],
        income: [0, 0, 0, 0, 0, 0, 0]
    });
    const [showIncome, setShowIncome] = useState(false);
    const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    useEffect(() => {
        if (transactions && Object.keys(transactions).length > 0) {
            calculateWeekData();
        }
    }, [transactions]);

    const calculateWeekData = () => {
        let newWeekData = {
            expense: [0, 0, 0, 0, 0, 0, 0],
            income: [0, 0, 0, 0, 0, 0, 0]
        };

        Object.values(transactions).flat().forEach(transaction => {
            const transactionDate = new Date(transaction.date);
            const dayOfWeek = transactionDate.getDay();
            if (transaction.type === 'income') {
                newWeekData.income[dayOfWeek] += transaction.amount;
            } else {
                newWeekData.expense[dayOfWeek] += transaction.amount;
            }
        });

        const maxExpense = Math.max(...newWeekData.expense);
        const maxIncome = Math.max(...newWeekData.income);

        newWeekData.expense = newWeekData.expense.map(value => 
            maxExpense > 0 ? (value / maxExpense) * maxHeight : 0
        );
        newWeekData.income = newWeekData.income.map(value => 
            maxIncome > 0 ? (value / maxIncome) * maxHeight : 0
        );

        setWeekData(newWeekData);
    }

    const renderChartBars = () => {
        const data = showIncome ? weekData.income : weekData.expense;
        return daysOfWeek.map((day, index) => {
            return (
                <View key={index} style={styles.chartContainer}>
                    <View style={styles.Emptychart}>
                        <View style={[
                            styles.chartfilled, 
                            { 
                                height: data[index],
                                backgroundColor: showIncome ? "#4CAF50" : "#F44336"
                            }
                        ]} />
                    </View>
                    <Text style={styles.dayLabel}>{day}</Text>
                </View>
            );
        });
    }

    const toggleGraph = () => {
        setShowIncome(!showIncome);
    }

    if (!transactions || Object.keys(transactions).length === 0) {
        return (
            <View style={styles.container}>
                <Text>No transactions available</Text>
            </View>
        );
    }

    return (
        <TouchableOpacity onPress={toggleGraph} style={styles.container}>
            <Text style={styles.title}>{showIncome ? "Income" : "Expense"}</Text>
            <View style={styles.graphContainer}>
                {renderChartBars()}
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    graphContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        width: '100%',
    },
    chartContainer: {
        alignItems: 'center',
    },
    Emptychart: {
        backgroundColor: "#D9DAE3",
        width: 36,
        height: maxHeight,
        borderRadius: 10,
        justifyContent: 'flex-end',
    },
    chartfilled: {
        width: 36,
        borderRadius: 10,
    },
    dayLabel: {
        marginTop: 5,
        fontSize: 12,
        color: 'black',
    }
});