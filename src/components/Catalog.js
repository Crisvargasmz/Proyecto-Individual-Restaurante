import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TextInput, Image , Alert} from 'react-native';
import { collection, addDoc, doc, updateDoc, onSnapshot, deleteDoc } from "firebase/firestore"; 
import { db } from '../../connection/firebaseconfig';
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerButton, PreviewImage } from "../../utils/Inputs";

const Catalog = () => {
  const [dishes, setDishes] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'Dishes'), (snapshot) => {
      const dishesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDishes(dishesData);
    });
    return unsubscribe;
  }, []);

  const pickImage = async (setImageFunction, useCamera = false) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se requieren permisos de cámara para tomar fotos.');
      return;
    }

    let result;
    if (useCamera) {
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }

    if (!result.canceled) {
      setImageFunction(result.assets[0].uri);
    }
  };

  const handleSaveDish = async () => {
    if (!name.trim()) {
      Alert.alert("Validación", "El nombre del plato es obligatorio.");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Validación", "La descripción del plato es obligatoria.");
      return;
    }
    if (!price.trim() || isNaN(price) || parseFloat(price) <= 0) {
      Alert.alert("Validación", "El precio debe ser un número mayor que 0.");
      return;
    }
    if (!rating.trim() || isNaN(rating) || parseFloat(rating) < 1 || parseFloat(rating) > 5) {
      Alert.alert("Validación", "La calificación debe ser un número entre 1 y 5.");
      return;
    }
    if (!image.trim()) {
      Alert.alert("Validación", "Debe seleccionar una imagen para el plato.");
      return;
    }
    if (!category.trim()) {
      Alert.alert("Validación", "La categoría del plato es obligatoria.");
      return;
    }

    try {
      if (editingId) {
        const dishRef = doc(db, 'Dishes', editingId);
        await updateDoc(dishRef, {
          name,
          description,
          price: parseFloat(price),
          rating: parseFloat(rating),
          image,
        });
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'Dishes'), {
          name,
          description,
          price: parseFloat(price),
          rating: parseFloat(rating),
          image,
          category,
        });
      }
      setCategory('');
      setImage('');
      setRating('');
      setName('');
      setDescription('');
      setPrice('');
    } catch (error) {
      console.error("Error saving dish: ", error);
      Alert.alert("Error", "Hubo un problema al guardar el plato.");
    }
  };

  const renderItem = ({ item }) => (
    <View>
      <Text>{item.name}</Text>
      <Text>{item.description}</Text>
      <Text>${item.price}</Text>
      <Text>{item.rating}</Text>
      <Text>{item.category}</Text>
      <Image source={{ uri: item.image }} style={{ width: 100, height: 100 }} />
      <Button title="Edit" onPress={() => handleEdit(item)} />
      <Button title="Delete" onPress={() => handleDelete(item.id)} />
    </View>
  );

  const handleEdit = (item) => {
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price.toString());
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    try {
      const dishRef = doc(db, 'Dishes', id);
      await deleteDoc(dishRef);
    } catch (error) {
      console.error("Error deleting dish: ", error);
    }
  };

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <TextInput placeholder="Name" value={name} onChangeText={setName} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} />
      <TextInput placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput placeholder="Rating" value={rating} onChangeText={setRating} keyboardType="numeric" />
      <ImagePickerButton
        onPress={async () => {
          const url = await pickImage(setImage);
          if (url) {
            setImage(url);
          }
        }}
        iconName="upload"
        buttonText="Subir Imagen"
      />
      <PreviewImage uri={image} />
      <TextInput placeholder="Category" value={category} onChangeText={setCategory} />
      <Button title={editingId ? "Update Dish" : "Add Dish"} onPress={handleSaveDish} />
      <FlatList data={dishes} renderItem={renderItem} keyExtractor={(item) => item.id} />
    </View>
  );
};

export default Catalog;
