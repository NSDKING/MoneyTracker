import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const riskLevels = [
  "Ultra Sure",
  "Very Low Risk",
  "Low Risk",
  "Moderate Risk",
  "High Risk",
  "Very High Risk"
];

export default function EditArdoiseModal({ visible, onClose, editArdoise, onDelete, editItem }) {
    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [selectedRisk, setSelectedRisk] = useState(editItem?.risk || riskLevels[0]);

    useEffect(() => {
        if (editItem) {
            setValue('name', editItem.name);
            setSelectedRisk(editItem.risk);
        }
    }, [editItem, setValue]);

    const onSubmit = data => {
        editArdoise(editItem.id, data.name, editItem.amount, selectedRisk); // Keep the existing amount
        reset();
        onClose();
    };

    return (
        <Modal
            isVisible={visible}
            onSwipeComplete={onClose}
            swipeDirection="down"
            onBackdropPress={onClose}
            style={styles.modalContainer}
        >
            <View style={styles.modalContent}>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => onDelete(editItem.id)}
                >
                    <Ionicons name="trash" size={28} color="#FF3B30" />
                </TouchableOpacity>

                 
                <Controller
                    control={control}
                    name="name"
                    rules={{ required: 'Name is required' }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            placeholderTextColor="#999"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

                <Picker
                        selectedValue={selectedRisk}
                        onValueChange={(itemValue) => setSelectedRisk(itemValue)}
                        style={styles.picker}
                    >
                        {riskLevels.map((risk, index) => (
                            <Picker.Item key={index} label={risk} value={risk} />
                        ))}
                </Picker>
 
                <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                    <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        justifyContent: 'flex-end',
        margin: 0,
        height: 500,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 600,
        paddingTop: 50
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
        ...Platform.select({
            ios: {
                fontFamily: 'System',
            },
            android: {
                fontFamily: 'Roboto',
            },
        }),
    },
    input: {
        width: '100%',
        height: 50,
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
        ...Platform.select({
            ios: {
                fontFamily: 'System',
            },
            android: {
                fontFamily: 'Roboto',
            },
        }),
    },
    errorText: {
        color: '#FF3B30',
        marginBottom: 5,
        fontSize: 14,
        ...Platform.select({
            ios: {
                fontFamily: 'System',
            },
            android: {
                fontFamily: 'Roboto',
            },
        }),
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginVertical: 10,
        backgroundColor: '#f9f9f9',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    button: {
        width: "100%",
        height: 50,
        backgroundColor: "#1A1A1A",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        marginTop: 200,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: 'bold',
        ...Platform.select({
            ios: {
                fontFamily: 'System',
            },
            android: {
                fontFamily: 'Roboto',
            },
        }),
    },
    deleteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 40,
        height: 40,
        backgroundColor: '#f8d7da',
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
    },
    deleteIcon: {
        width: 24,
        height: 24,
    },
});
