import React, { useState } from 'react';
import { Modal, StyleSheet, View, Text, TouchableOpacity, FlatList, Platform, Dimensions } from 'react-native';
import { startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, startOfWeek, endOfWeek, format, isToday, isSameMonth, isSameDay } from 'date-fns';

const { width } = Dimensions.get('window');
const NUM_COLUMNS = 7; // Number of columns you want
const ITEM_WIDTH = width / NUM_COLUMNS; // Calculate item width

const CalendarModal = ({ isOpen, onClose, selectedDate, setSelectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const handlePreviousMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };

  const handleDatePress = (date) => {
    const adjustedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
     setSelectedDate(adjustedDate);
  };

  const weeksDay = ["S", "M", "T", "W", "T", "F", "S"]; // Adjusted to start from Sunday
  const startDay = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 }); // Start from Sunday
  const endDay = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: startDay, end: endDay });
  const totalRows = Math.ceil(days.length / NUM_COLUMNS);

  const CustomSeparator = () => {
    return <View style={styles.separator} />;
  };

  const renderDay = ({ item, index }) => {
    const isCurrentMonth = isSameMonth(item, currentMonth);
    const isSelected = isSameDay(item, selectedDate);
    const isLastRow = Math.floor(index / NUM_COLUMNS) === totalRows - 1;

    return (
      <TouchableOpacity 
        style={[
            styles.day,
            isToday(item) && styles.today,
            !isCurrentMonth && styles.notCurrentMonth,
            isSelected && styles.selectedDay,
            isLastRow && styles.lastRowDay,
        ]}
        onPress={() => handleDatePress(item)}
      >
        <Text style={[
          styles.dayText, 
          !isCurrentMonth && styles.notCurrentMonthText,
          isSelected && styles.selectedDayText
        ]}>
          {format(item, 'd')}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handlePreviousMonth}>
              <Text style={styles.navButton}>&lt;</Text>
            </TouchableOpacity>
            <Text style={styles.monthText}>{format(currentMonth, 'MMMM yyyy')}</Text>
            <TouchableOpacity onPress={handleNextMonth}>
              <Text style={styles.navButton}>&gt;</Text>
            </TouchableOpacity>
          </View>
         
          <FlatList
            data={weeksDay}
            renderItem={({ item }) => (
              <View style={styles.weekDay}>
                <Text style={styles.weekDayText}>{item}</Text>
              </View>
            )}
            keyExtractor={item => item}
            numColumns={NUM_COLUMNS}
            ItemSeparatorComponent={CustomSeparator}
            contentContainerStyle={styles.gridContent}
          />
          
          <View style={styles.grid}>
            <FlatList
              data={days}
              renderItem={renderDay}
              keyExtractor={item => item.toString()}
              numColumns={7}
              ItemSeparatorComponent={CustomSeparator}
              contentContainerStyle={styles.gridContent}
            />
          </View>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '95%',
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingVertical: Platform.OS === 'ios' ? 20 : 0, // Adjust padding for iOS
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20, // Added padding to the header
    marginBottom: 10,
  },
  navButton: {
    fontSize: 24,
    paddingHorizontal: 10,
    marginTop: 15,
    fontWeight: '500',
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  grid: {
    width: '94%',
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 10,
  },
  gridContent: {
    alignItems: 'center',
  },
  day: {
    flex: Platform.OS === 'ios' ? 0 : 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 50,
    borderLeftWidth: 1,
    borderLeftColor: "#E5E7EB",
    borderBottomWidth: Platform.OS === 'ios' ? 1 : 0,
    borderBottomColor: "#E5E7EB",
  },
  dayText: {
    fontSize: 16,
    fontWeight: "500",
  },
  today: {
    backgroundColor: '#d3d3d3',
    borderBottomLeftRadius: 10,
  },
  notCurrentMonth: {
    backgroundColor: '#F9FAFB',
  },
  notCurrentMonthText: {
    color: '#D1D1D1',
  },
  selectedDay: {
    backgroundColor: 'black',
    borderRadius: 25,
    borderBottomLeftRadius: 10,
  },
  selectedDayText: {
    color: 'white',
  },
  lastRowDay: {
    borderBottomWidth: 0, 
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    width: 50,
    marginTop: 10,
  },
  weekDayText: {
    fontSize: 16,
    fontWeight: '500',
    color: "#505050",
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
  },
  closeButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#E5E7EB',
  },
});

export default CalendarModal;
