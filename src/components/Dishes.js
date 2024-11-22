import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Button, Alert,ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerButton2, PreviewImage,CustomTextInput,CustomLargeTextInput2,CustomButton } from '../../utils/Inputs';
import { db } from '../../connection/firebaseconfig';
import { collection, addDoc } from 'firebase/firestore';

const Dishes = ({ navigation }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [rating, setRating] = useState('');
    const [image, setImage] = useState(null);
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState('');

    const pickImage = async (setImageFunction, useCamera = false) => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Se requieren permisos de cámara para tomar fotos.');
            return;
        }
    
        let result;
        if (useCamera) {
            result = await ImagePicker.launchCameraAsync({
                aspect: [4, 3],
                quality: 1,
            });
        } else {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                aspect: [4, 3],
                quality: 1,
            });
        }
    
        if (!result.canceled) {
            setImageFunction(result.assets[0].uri);
        }
    };

    const saveDish = async () => {
        if (!name || !description || !price || !rating || !category || !quantity || !image) {
            Alert.alert("Error", "Por favor, completa todos los campos y selecciona una imagen.");
            return;
        }

        const dishData = {
            name,
            description,
            price: parseFloat(price),
            rating: parseInt(rating),
            category,
            quantity: parseInt(quantity),
            image
        };

        try {
            await addDoc(collection(db, 'Dishes'), dishData);
            Alert.alert("Éxito", "Plato guardado correctamente.");
            setName('');
            setDescription('');
            setPrice('');
            setRating('');
            setCategory('');
            setQuantity('');
            setImage(null);
        } catch (error) {
            console.error("Error saving dish: ", error);
            Alert.alert("Error", "Hubo un problema al guardar el plato.");
        }
    };

    return (
        <View style={styles.container}>
              {image ? (
                <PreviewImage uri={image} />
            ) : (
                <Text style={styles.noImageText}>No hay imagen disponible</Text>
            )}
            <ScrollView>
            <CustomTextInput placeholder="Nombre" value={name} onChangeText={setName} />
            <CustomLargeTextInput2 placeholder="Descripción" value={description} onChangeText={setDescription} />
            <CustomTextInput placeholder="Precio" value={price} onChangeText={setPrice} keyboardType="numeric" />
            <CustomTextInput placeholder="Calificación" value={rating} onChangeText={setRating} keyboardType="numeric" />
            <CustomTextInput placeholder="Categoría" value={category} onChangeText={setCategory} />
            <CustomTextInput placeholder="Cantidad" value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
            <ImagePickerButton2 onPress={() => pickImage(setImage)} iconName="camera" buttonText="Seleccionar Imagen" />
            <CustomButton style={styles.button} title="Guardar Plato" onPress={saveDish} color="#32CD32" />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        marginTop: 100,
    },
    button: {
        width: 370,
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        marginVertical: 10,
    },
    noImageText: {
        fontSize: 16,
        color: '#808080',
        textAlign: 'center',
        marginBottom: 20,
    },
});

export default Dishes;
