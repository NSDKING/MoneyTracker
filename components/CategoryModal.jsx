import { StyleSheet, View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import React, { useState } from 'react';
import Modal from 'react-native-modal'; 

const def = require('../assets/img/other.png'); // Ensure this path is correct

const CategoryModal = ({ isOpen, onClose, setCategory, cate }) => {
  const [Linkfilter, setLinkfilter] = useState(null);
  const [linkClicked, setLinkClicked] = useState(false);

   

  const handlePressIcon = (item) => {
    if (linkClicked) {
      setCategory(item.id);
      onClose();
    }
    setLinkfilter(item.link);
    setLinkClicked(true);
  };

  const handleResetFilter = () => {
    setLinkfilter(null);
    setLinkClicked(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.categoryItem, { width: 65 }]} onPress={() => handlePressIcon(item)}>
      <Image source={def} style={styles.categoryImage} />
      <Text style={styles.categoryText} numberOfLines={1} ellipsizeMode="tail">
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  // Filter the categories to only show those with a link formatted like link>
  const filteredCategories = Linkfilter 
    ? cate.filter(item => item.link.startsWith(Linkfilter))
    : cate.filter(item => item.link.endsWith('>'));

  return (
    <Modal
      isVisible={isOpen}
      onBackdropPress={onClose} // Close the modal when tapping outside
      style={styles.modalContainer}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <FlatList
            data={filteredCategories}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={5}
            contentContainerStyle={styles.categoryList}
            scrollEnabled={filteredCategories.length > 10} // Enable scrolling if there are more than 10 items
          />

          {linkClicked && (
            <TouchableOpacity onPress={handleResetFilter} style={styles.resetButton}>
              <Text style={styles.resetButtonText}>All Categories</Text>
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
    maxHeight: 400, // Set a maximum height for the modal view
    marginTop:250,
  },
  modalView: {
    width: '90%',
    maxHeight: 400, // Set a maximum height for the modal view
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  categoryList: {
    marginTop: 20,
  },
  categoryItem: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 10,
    margin: 2,
  },
  categoryImage: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 14,
    color: 'gray',
    maxWidth: '90%',
  },
  resetButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 10,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
