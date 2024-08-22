import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import CalendarModal from './calendar'; // Ensure this path is correct
import { format } from 'date-fns';
import Modal from 'react-native-modal'; 
import calendarIcon from '../assets/img/calendar.png'; // Make sure the icon path is correct
import CategoryModal from './CategoryModal';

export default function AddTransaction({ visible, onClose, type, cate }) {
    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [isCalendarVisible, setCalendarVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');

    const onSubmit = data => {
        console.log({ ...data, date: selectedDate, category: selectedCategory }); 
        addTransaction(selectedDate, data.amount, data.note, selectedCategory, type);
        reset();  
        onClose();  
    };

    const addTransaction = async (date, amount, note, category_ID, type) => {
        // Replace with actual database function
        const result = await db.runAsync(
            'INSERT INTO transactions (date, amount, category_ID, note, type) VALUES (?, ?, ?, ?, ?)', 
            date, amount, category_ID, note, type
        );
        console.log(result);
        getData(); // Refresh the data after insertion
    };

    const handleDateSelection = (date) => {
        setSelectedDate(date);
        setCalendarVisible(false); // Hide calendar after selection
        setValue('date', format(date, 'yyyy-MM-dd')); // Update form value
    };

    const handleCategorySelection = (category) => {
        setSelectedCategory(category);
        setCategoryModalVisible(false); // Hide category modal after selection
        setValue('category', category); // Update form value
    };

    return (
        <Modal
            isVisible={visible}
            onSwipeComplete={onClose} // Allow closing the modal by swiping down
            swipeDirection="down" // Enable swipe down gesture
            onBackdropPress={onClose} // Allow closing the modal by tapping on the backdrop
            style={styles.modalContainer} // Add custom styles
        >
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Add Transaction</Text>
                
                <Controller
                    control={control}
                    name="date"
                    defaultValue={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TouchableOpacity
                            style={styles.calendarButton}
                            onPress={() => setCalendarVisible(true)}
                        >
                            <Image source={calendarIcon} style={styles.icon} />
                            <Text style={styles.buttonText}>
                                {selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : 'Select Date'}
                            </Text>
                        </TouchableOpacity>
                    )}
                    rules={{ required: 'Date is required' }}
                />
                {errors.date && <Text style={styles.errorText}>{errors.date.message}</Text>}
                
                <CalendarModal
                    isOpen={isCalendarVisible}
                    onClose={() => setCalendarVisible(false)}
                    selectedDate={selectedDate}
                    setSelectedDate={handleDateSelection}
                />

                <CategoryModal
                    isOpen={isCategoryModalVisible}
                    onClose={() => setCategoryModalVisible(false)}
                    setCategory={handleCategorySelection}
                    cate={cate}
                    type={type}
                />

                <Controller
                    control={control}
                    name="amount"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Amount"
                            placeholderTextColor="#666"  // Set a darker color for better readability
                            keyboardType="numeric"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                    rules={{ required: 'Amount is required' }}
                />
                {errors.amount && <Text style={styles.errorText}>{errors.amount.message}</Text>}

                <Controller
                    control={control}
                    name="category"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TouchableOpacity
                            style={styles.calendarButton}
                            onPress={() => setCategoryModalVisible(true)}
                        >
                            <Text style={styles.buttonText}>{selectedCategory || 'Select Category'}</Text>
                        </TouchableOpacity>
                    )}
                />
                
                <Controller
                    control={control}
                    name="note"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Note"
                            placeholderTextColor="#666"  // Set a darker color for better readability
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />

                <View style={styles.button}>
                    <Button title="Submit" onPress={handleSubmit(onSubmit)} color="#fff" />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        justifyContent: 'flex-end', // Position the modal at the bottom
        margin: 0, // Remove default margins
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 460, // Set a fixed height for the modal
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    errorText: {
        color: 'red',
        marginBottom: 5,
    },
    calendarButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    buttonText: {
        color: '#007bff',
        fontWeight: 'bold',
    },
    button: {
        width: "95%",
        height: 45,
        backgroundColor: "#1A1A1A",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 13,
        marginTop: 20,
        marginLeft: 10,
    },
});
