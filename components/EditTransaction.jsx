import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import CalendarModal from './calendar'; // Ensure this path is correct
import { format } from 'date-fns';
import Modal from 'react-native-modal'; 
import calendarIcon from '../assets/img/calendar.png'; // Make sure the icon path is correct
import deleteIcon from '../assets/img/delete.png'; // Make sure the icon path is correct
import CategoryModal from './CategoryModal';
import { Picker } from '@react-native-picker/picker';

export default function EditTransaction({ visible, onClose, cate, editTransaction, onDelete, editItem, Ardoises }) {
    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [isCalendarVisible, setCalendarVisible] = useState(false);
    const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);

    // Provide default values if editItem is undefined
    const initialDate = editItem?.date ? new Date(editItem.date) : new Date();
;    const initialType = editItem?.type || 'expense';

    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [cateValue, setCateValue] = useState(editItem?.category_ID);
    const [selectedCategory, setSelectedCategory] = useState(editItem?.category_ID);
    const [type, setType] = useState(initialType);
    const [selectedArdoise, setSelectedArdoise] = useState();

    useEffect(() => {
        if (editItem) {
            setValue('date', format(new Date(editItem.date), 'yyyy-MM-dd'));
            setValue('amount', editItem.amount.toString());
            setSelectedCategory(findCateById(editItem.category_ID)?.link);
            setCateValue(editItem.category_ID);
            setValue('note', editItem.note || '');
        }

    }, [editItem, setValue]);


    const onSubmit = async data => {
        try {
            await editTransaction(selectedDate, data.amount, cateValue, data.note, type, selectedArdoise);

            reset();  
            onClose();  
         } catch (error) {
            console.error("Error updating transaction:", error);
            Alert.alert("Error", "There was an issue updating the transaction. Please try again.");
        }
    };

    const handleDateSelection = (date) => {
        setSelectedDate(date);
        setCalendarVisible(false); // Hide calendar after selection
        setValue('date', format(date, 'yyyy-MM-dd')); // Update form value
    };

    const handleCategorySelection = (categoryID) => {
        setCateValue(categoryID); 
        setSelectedCategory(findCateById(categoryID).link); 
        setCategoryModalVisible(false); 
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
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={onDelete} // Call delete function when pressed
                >
                    <Image source={deleteIcon} style={styles.deleteIcon} />
                </TouchableOpacity>
                
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
                                {selectedCategory}
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
                            placeholderTextColor="#666"  
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                <Picker
                        selectedValue={selectedArdoise}
                        onValueChange={(itemValue) => setSelectedArdoise(itemValue)}
                        style={styles.picker}
                >
                        {Ardoises.map((ardoise, index) => (
                            <Picker.Item key={index} label={ardoise.name} value={ardoise.id} />
                        ))}
                </Picker>

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
        height: 660, 
        paddingTop:50
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        height: 45,
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
        height: 45,
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
    deleteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 40,
        height: 40,
        backgroundColor: '#f8d7da', // Light red background for delete button
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1, 
     },
    deleteIcon: {
        width: 24,
        height: 24,
    },
});
