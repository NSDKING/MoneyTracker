import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import CalendarModal from './calendar'; 
import { format } from 'date-fns';
import Modal from 'react-native-modal'; 
import calendarIcon from '../assets/img/calendar.png'; 
import CategoryModal from './CategoryModal';
import { Picker } from '@react-native-picker/picker';
 
export default function AddTransaction({ visible, onClose, type, cate, addTransaction, Ardoises }) {
    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [isCalendarVisible, setCalendarVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null); // Use null initially
    const [cateValue, setCateValue] = useState(null);
    const [selectedArdoise, setSelectedArdoise] = useState();


    const onSubmit = data => {
        // Log form data and additional state
        addTransaction(selectedDate, data.amount, data.note, cateValue, type, selectedArdoise);
        reset();  
        onClose();  
    };

    const handleDateSelection = (date) => {
        setSelectedDate(date);
        setCalendarVisible(false); // Hide calendar after selection
        setValue('date', format(date, 'yyyy-MM-dd')); // Update form value
    };

    const handleCategorySelection = (categoryID) => {
        setSelectedCategory(findCateById(categoryID).link); 
        setCateValue(categoryID); // Set the category ID

        setCategoryModalVisible(false); // Hide category modal after selection
        setValue('category', findCateById(categoryID)); // Update form value if needed
    };

    const findCateById = (id) => {
        return cate.find(category => category.id === id) || null;
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
                            <Text style={styles.buttonText}>
                                {selectedCategory ? selectedCategory   : 'Selecte Category'}
                            </Text>
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
        height: 660, // Set a fixed height for the modal
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        height:45,
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
