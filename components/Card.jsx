import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import dol from "../assets/img/dol.png"

export default function Card({ item, link }) {

 

    
  return (
    <View style={styles.card}>
        <View style={{flexDirection:"row", alignItems:"center"}}>
            <Image
                source={require('../assets/img/net.png')} 
                style={styles.image}  
            />  
            <View>
                <Text style={styles.title}>{link}</Text>
                <Text style={styles.lightText}>{item.note}</Text>
            </View>
        </View>
        <Text style={styles.title}>{item.amount} Fcfa</Text>
    </View>    
  );
}

const styles = StyleSheet.create({
  card: {
    height: 70, 
    width: 350, 
    borderWidth: 2.2, 
    borderColor: '#F9F9FB',
    backgroundColor: 'white',
    borderRadius: 15, 
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop:10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  lightText: {
    fontWeight: '400',
    fontSize: 16,
  },
  image: {
    width: 40, 
    height: 40,
    borderRadius: 20,  // Circular image
    marginRight: 20,
  },
});
