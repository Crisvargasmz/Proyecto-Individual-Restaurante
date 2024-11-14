import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const DishDetail = ({ route }) => {
  const { dish } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: dish.image }} style={styles.image} />
      <Text style={styles.label}>Nombre: {dish.name}</Text>
      <Text style={styles.label}>Descripción: {dish.description}</Text>
      <Text style={styles.label}>Precio: ${dish.price}</Text>
      <Text style={styles.label}>Calificación: {dish.rating}</Text>
      <Text style={styles.label}>Categoría: {dish.category}</Text>
      <Text style={styles.label}>Cantidad: {dish.quantity}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    marginTop: 30,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 15,
    fontSize: 18,
  },
});

export default DishDetail;

