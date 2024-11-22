import React, { useState } from 'react';
import { TextInput, TouchableOpacity, StyleSheet, View, Text, Image, Modal, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
  
  // Componente personalizado para botones que activan la selección de imágenes
  export const ImagePickerButton = ({ onPress, iconName, buttonText }) => {
    return (
      <TouchableOpacity style={styles.imageButton} onPress={onPress}>
        <Icon name={iconName} size={20} color="blue" style={styles.icon} />
        <Text style={styles.imageButtonText}>{buttonText}</Text>
      </TouchableOpacity>
    );
  };

    // Componente personalizado para botones que activan la selección de imágenes
    export const ImagePickerButton2 = ({ onPress, iconName, buttonText }) => {
      return (
        <TouchableOpacity style={styles.imageButton2} onPress={onPress}>
          <Icon name={iconName} size={20} color="blue" style={styles.icon2} />
          <Text style={styles.imageButtonText2}>{buttonText}</Text>
        </TouchableOpacity>
      );
    };
  

  // Componente para mostrar una imagen previa seleccionada
export const PreviewImage = ({ uri }) => (
    uri ? <Image source={{ uri }} style={styles.previewImage} /> : null
  );

  // Componente personalizado para TextInput
  export const CustomTextInput = ({ value, onChangeText, placeholder, secureTextEntry, keyboardType, style }) => {
    return (
        <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            style={[styles.customInput, style]} // Permite estilos personalizados
        />
    );
  };

    // Componente personalizado para TextInput
    export const CustomTextInput2 = ({ value, onChangeText, placeholder, secureTextEntry, keyboardType, style }) => {
      return (
          <TextInput
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              style={[styles.customInput2, style]} // Permite estilos personalizados
          />
      );
    };
  

  // Componente personalizado para TextInput grande para descripciones
  export const CustomLargeTextInput = ({ value, onChangeText, placeholder, secureTextEntry, keyboardType, style }) => {
    return (
        <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            multiline={true} // Permite múltiples líneas
            numberOfLines={4} // Número de líneas inicial
            style={[styles.customLargeInput, style]} // Estilos personalizados
        />
    );
  };

    // Componente personalizado para TextInput grande para descripciones
    export const CustomLargeTextInput2 = ({ value, onChangeText, placeholder, secureTextEntry, keyboardType, style }) => {
      return (
          <TextInput
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              multiline={true} // Permite múltiples líneas
              numberOfLines={4} // Número de líneas inicial
              style={[styles.customLargeInput2, style]} // Estilos personalizados
          />
      );
    };

  // Componente personalizado para botones
  export const CustomButton = ({ onPress, title, style, textStyle }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
            <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
  };

  // Estilos para los componentes
const styles = StyleSheet.create({
    editButton:{
  color: 'black',
  padding: 10,
    },
    inputtext:{
    color: 'black'
  
  
    },
    imageButton: {
      height: 50,
      backgroundColor: '#007AFF',
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 3,
      flexDirection: 'row',
      paddingHorizontal: 10,
      width: 300,
    },
    imageButton2: {
      height: 50,
      backgroundColor: '#007AFF',
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      flexDirection: 'row',
      paddingHorizontal: 10,
      width: 370,
    },
    imageButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      marginLeft: 5,
    },
    imageButtonText2: {
      color: '#fff',
      fontWeight: 'bold',
      marginLeft: 5,
    },
    previewImage: {
      width: 200,
      height: 200,
      marginBottom: 20,
      marginTop: -50,
      borderRadius: 5,
      alignSelf: 'center',
    },
    customInput: {
      height: 50,
      borderColor: 'black',
      borderWidth: 1,
      marginBottom: 20,
      paddingHorizontal: 10,
      fontSize: 14,
      borderRadius: 5,
      fontWeight: 'bold',
      color: 'black', // Color del texto
      backgroundColor: '#FFF', // Fondo blanco para mayor legibilidad
    },
    customInput2: {
      height: 40,
      width: 310,
      borderColor: 'black',
      borderWidth: 1,
      marginBottom: 20,
      paddingHorizontal: 10,
      borderRadius: 5,
      fontSize: 14,
      fontWeight: 'bold',
      color: 'black', // Color del texto
      backgroundColor: '#FFF', // Fondo blanco para mayor legibilidad
    },
    customLargeInput2: {
      height: 100, // Altura mayor para más texto
      borderColor: 'black',
      borderWidth: 1,
      marginBottom: 20,
      paddingHorizontal: 10,
      borderRadius: 5,
      fontSize: 14,
      fontWeight: 'bold',
      color: 'black', // Color del texto
      backgroundColor: '#FFF', // Fondo blanco para mayor legibilidad
      textAlignVertical: 'top', // Alinea el texto en la parte superior
  },
    customLargeInput: {
        height: 100, // Altura mayor para más texto
        borderColor: 'black',
        borderWidth: 1,
        width: 310,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 5,
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black', // Color del texto
        backgroundColor: '#FFF', // Fondo blanco para mayor legibilidad
        textAlignVertical: 'top', // Alinea el texto en la parte superior
    },
    button: {
        height: 50,
        width: 300,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        paddingHorizontal: 20
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold'
    }
  });
  
  