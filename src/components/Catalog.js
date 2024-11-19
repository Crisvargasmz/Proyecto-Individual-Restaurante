import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TextInput, Image, Alert, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { collection, doc, updateDoc, onSnapshot, deleteDoc } from "firebase/firestore"; 
import { db } from '../../connection/firebaseconfig';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { CustomTextInput2, CustomLargeTextInput,ImagePickerButton, CustomButton} from '../../utils/Inputs';
import { useNavigation } from '@react-navigation/native';
const Catalog = () => {
  const [dishes, setDishes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentDish, setCurrentDish] = useState(null);
  const navigation = useNavigation();
  const [image, setImage] = useState(null);

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

  const handleEdit = (item) => {
    setCurrentDish(item);
    setModalVisible(true);
  };

  const handleSaveChanges = async () => {
    if (currentDish) {
      const dishRef = doc(db, 'Dishes', currentDish.id);
      await updateDoc(dishRef, {
        ...currentDish
      });
      setModalVisible(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'Dishes', id));
    Alert.alert("Plato eliminado", "El plato ha sido eliminado correctamente.");
  };

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

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('DishDetail', { dish: item })}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </TouchableOpacity>
      <Text style={styles.label}>Nombre: {item.name}</Text>
      <Text style={styles.label}>Precio: C${item.price}</Text>
      <Text style={styles.label}>Calificación: {item.rating}</Text>
      <View style={styles.iconContainer}>
        <Icon name="edit" size={30} color="blue" onPress={() => handleEdit(item)} />
        <Icon name="delete" size={30} color="red" onPress={() => handleDelete(item.id)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={dishes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        key={2}
        columnWrapperStyle={styles.row}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {currentDish && (
              <>
                <Image source={{ uri: currentDish.image }} style={styles.modalImage} />
                <CustomTextInput2 placeholder="Nombre" value={currentDish.name} onChangeText={(text) => setCurrentDish({...currentDish, name: text})} />
                <CustomLargeTextInput placeholder="Descripción" value={currentDish.description} onChangeText={(text) => setCurrentDish({...currentDish, description: text})} />
                <CustomTextInput2 placeholder="Precio" value={currentDish.price.toString()} onChangeText={(text) => setCurrentDish({...currentDish, price: text})} keyboardType="numeric" />
                <CustomTextInput2 placeholder="Calificación" value={currentDish.rating.toString()} onChangeText={(text) => setCurrentDish({...currentDish, rating: text})} keyboardType="numeric" />
                <CustomTextInput2 placeholder="Categoría" value={currentDish.category} onChangeText={(text) => setCurrentDish({...currentDish, category: text})} />
                <CustomTextInput2 placeholder="Cantidad" value={currentDish.quantity.toString()} onChangeText={(text) => setCurrentDish({...currentDish, quantity: text})} keyboardType="numeric" />
                <ImagePickerButton title="Cambiar Imagen"
                  onPress={() => pickImage((newUri) => setCurrentDish({ ...currentDish, image: newUri }), false)}
                  iconName="camera"
                  buttonText="Seleccionar Imagen" />
                <CustomButton style={styles.button} title="Guardar Cambios" onPress={handleSaveChanges} />
                <CustomButton style={styles.button} title="Cerrar" onPress={() => setModalVisible(false)} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  itemContainer: {
    flex: 1,
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    margin: 5,
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 10,
    borderRadius: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 14,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
  button: {
    marginTop: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 100, // Adjust the width as needed
  },
  row: {
    flex: 1,
    justifyContent: 'space-around',
  },
});

export default Catalog;
