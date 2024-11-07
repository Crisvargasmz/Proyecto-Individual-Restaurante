import React, { useState } from 'react';
import { TextInput, TouchableOpacity, StyleSheet, View, Text, Image, Modal, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Componente personalizado para el input del selector de fecha
export const CustomPickerInput = ({ value, onPress, placeholder }) => (
    <TouchableOpacity onPress={onPress} style={styles.inputContainer}>
      <Text style={styles.inputText}>{value ? value : placeholder}</Text>
    </TouchableOpacity>
  );
  
  // Componente personalizado para botones que activan la selección de imágenes
  export const ImagePickerButton = ({ onPress, iconName, buttonText }) => {
    return (
      <TouchableOpacity style={styles.imageButton} onPress={onPress}>
        <Icon name={iconName} size={20} color="blue" style={styles.icon} />
        <Text style={styles.imageButtonText}>{buttonText}</Text>
      </TouchableOpacity>
    );
  };

  // Componente para mostrar una imagen previa seleccionada
export const PreviewImage = ({ uri }) => (
    uri ? <Image source={{ uri }} style={styles.previewImage} /> : null
  );

  // Estilos para los componentes
const styles = StyleSheet.create({
    editButton:{
  color: 'black',
  padding: 10,
    },
    inputtext:{
    color: 'black'
  
  
    },
    inputContainer2:{
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderColor: '#ccc',
      marginBottom: 25,
      padding: 10,
    },
    input2: {
      flex: 1,
      height: 40,
      paddingHorizontal: 10,
      color: '#fff',
    },
    editButton2: {
      marginLeft: 10,
      padding: 10,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderColor: '#fff',
      marginBottom: 25,
      width: '100%',
      height: 40,
      justifyContent: 'center', // Centrar el texto
    },
    input: {
      flex: 1,
      height: '100%',
      paddingHorizontal: 10,
      color: '#fff',
    },
    inputText: {
      color: '#fff', // Color del texto para el CustomPickerInput
      flex: 1,
      textAlign: 'center', // Centrar el texto
    },
    eyeIcon: {
      padding: 10,
    },
    imageButton: {
      height: 40,
      backgroundColor: '#007AFF',
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
      flexDirection: 'row',
      paddingHorizontal: 10,
      width: 200,
    },
    imageButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      marginLeft: 5,
    },
    previewImage: {
      width: 100,
      height: 100,
      marginBottom: 10,
      borderRadius: 5,
    },
    pickerContainer: {
      width: '100%',
      marginBottom: 25,
    },
    pickerInput: {
      padding: 15,
      borderWidth: 1,
      borderColor: '#fff', // Cambiado a blanco para coincidir con otros inputs
      borderRadius: 5,
      backgroundColor: '#107acc', // Color de fondo consistente
    },
    pickerText: {
      color: '#fff', // Color del texto para que coincida con otros inputs
      textAlign: 'center', // Centrar el texto
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      marginTop: 350, 
      width: '100%',
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 20,
    },
    modalItem: {
      padding: 15,
      borderBottomColor: 'gray',
    },
    modalItemText: {
      color: 'black',
    },
    closeButton: {
      marginTop: 10,
      padding: 10,
      backgroundColor: '#007AFF',
      borderRadius: 5,
      alignItems: 'center',
    },
    closeButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    inputContainerLarge: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderColor: '#fff', // Manteniendo el color blanco para el borde
      marginBottom: 25,
      width: '100%',
      justifyContent: 'center', // Centrar el texto
    },
    inputLarge: {
      flex: 1,
      height: 100, // Altura mayor para más texto
      paddingHorizontal: 10,
      color: '#fff', // Manteniendo el color blanco para el texto
      textAlignVertical: 'top', // Alinea el texto en la parte superior
    },
  });
  
  