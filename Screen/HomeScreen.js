import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';

const HomeScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Image
        style={{height: 100, width: 100}}
        source={require('../assests/images/invoice.png')}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate('Bill')}
        style={styles.createInvoice}>
        <Text style={styles.invoiceText}>Create Invoice/Bill</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createInvoice: {
    marginTop: '20%',
    width: '90%',
    height: 50,
    borderRadius: 20,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },
  invoiceText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 20,
  },
});
