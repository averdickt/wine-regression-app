import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import ProductRegressionChart from './src/components/ProductRegressionChart';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Wine Price Analysis</Text>
      <ProductRegressionChart />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
});