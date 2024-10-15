import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native';
import React, { useState } from 'react';
import Modal from 'react-native-modal';

const def = require('../assets/img/other.png'); // Ensure this path is correct

const CategoryModal = ({ isOpen, onClose, setCategory, cate }) => {
  const [searchText, setSearchText] = useState('');
  const [linkClicked, setLinkClicked] = useState(false);

  const handlePressIcon = (item) => {
    setCategory(item.id);
    onClose();
    setLinkClicked(true);
  };

  const handleResetFilter = () => {
    setSearchText('');
    setLinkClicked(false);
  };

  const filteredCategories = searchText
    ? cate.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()))
    : cate;

  return (
    <Modal
      isVisible={isOpen}
      onBackdropPress={onClose} // Close the modal when tapping outside
      style={styles.modalContainer}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Select a Category</Text>
          
          <TextInput
            style={styles.searchInput}
            placeholder="Search categories..."
            value={searchText}
            onChangeText={setSearchText}
          />

          <ScrollView contentContainerStyle={styles.categoryGrid}>
            {filteredCategories.map(item => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.categoryCard} 
                onPress={() => handlePressIcon(item)}
              >
                <Image source={def} style={styles.categoryImage} />
                <Text style={styles.categoryText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {linkClicked && (
            <TouchableOpacity onPress={handleResetFilter} style={styles.resetButton}>
              <Text style={styles.resetButtonText}>Show All Categories</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default CategoryModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: 600, // Increased height for better display
  },
  modalView: {
    width: '90%',
    maxHeight: 600,
    backgroundColor: '#fff', // White background for contrast
    borderRadius: 20,
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  searchInput: {
    width: '100%',
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Space out categories
  },
  categoryCard: {
    width: '30%', // Three items per row for a grid layout
    backgroundColor: '#f2f2f2', // Light background for cards
    borderRadius: 15,
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // Circular image
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  resetButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007bff', // Primary color
    borderRadius: 10,
    elevation: 5,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
