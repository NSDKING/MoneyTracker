import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Modal from 'react-native-modal';

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
      onBackdropPress={onClose}
      style={styles.modalContainer}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>          
   

          <ScrollView contentContainerStyle={styles.categoryGrid}>
            {filteredCategories.map(item => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.categoryCard} 
                onPress={() => handlePressIcon(item)}
              >
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
    margin: 0,
  },
  modalView: {
    width: '85%',
    maxHeight: '75%',
    backgroundColor: '#f4f4f4', // Light grey background
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937', // Dark blue-grey
    marginBottom: 20,
    textAlign: 'center',
  },
  searchInput: {
    width: '100%',
    borderRadius: 8,
    borderColor: '#D1D5DB', // Light grey border
    borderWidth: 1,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF', // White background for input
    marginBottom: 20,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  categoryCard: {
    width: '30%',
    backgroundColor: '#E5E7EB', // Very light grey for category cards
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryText: {
    fontSize: 14,
    color: '#374151', // Cool grey for text
    textAlign: 'center',
    fontWeight:"500"
  },
  resetButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: '#4B5563', // Muted dark grey
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  resetButtonText: {
    color: '#FFFFFF', // White text
    fontSize: 16,
    fontWeight: '500',
  },
});
