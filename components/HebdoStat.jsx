import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
const maxHeigh= 140;

export default function HebdoStat() {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const data = [25, 50, 75, 16, 50, 50, 50]; // Example values
    const maxValue = Math.max(...data);  // Get the maximum value in the data array

      const renderChartBars = () => {
        return daysOfWeek.map((day, index) => {

            // Calculate dynamic height based on the data value
            const barHeight = (data[index] / maxValue) * maxHeigh;

            return (
                <View key={index} style={styles.chartContainer}>
                    <View style={styles.Emptychart}>
                        <View style={[styles.chartfilled, { height: barHeight }]}/>
                    </View>
                    <Text style={styles.dayLabel}>{day}</Text>
                </View>
            );
        });
    }

    return (
        <View style={styles.container}>
            {renderChartBars()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        marginVertical: 20,
    },
    chartContainer: {
        alignItems: 'center',
    },
    Emptychart: {
        backgroundColor: "#D9DAE3",
        width: 36,
        height: maxHeigh,
        borderRadius: 10,
        justifyContent: 'flex-end',
    },
    chartfilled: {
        backgroundColor: "#BC0003",
        width: 36,
      
        borderRadius: 10,

    },
    dayLabel: {
        marginTop: 5,
        fontSize: 12,
        color: 'black',
    }
});
