import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TextInput } from 'react-native';
import { collection, addDoc, doc, updateDoc, onSnapshot, deleteDoc } from "firebase/firestore"; 
import { db } from '../../connection/firebaseconfig';

const Catalog = () => {
  const [dishes, setDishes] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState('');
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

  const handleSaveDish = async () => {
    try {
      if (editingId) {
        const dishRef = doc(db, 'Dishes', editingId);
        await updateDoc(dishRef, {
          name,
          description,
          price: parseFloat(price),
          rating: parseFloat(rating),
        });
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'Dishes'), {
          name,
          description,
          price: parseFloat(price),
          rating: parseFloat(rating),
        });
      }
      setRating('');
      setName('');
      setDescription('');
      setPrice('');
    } catch (error) {
      console.error("Error saving dish: ", error);
    }
  };

  const renderItem = ({ item }) => (
    <View>
      <Text>{item.name}</Text>
      <Text>{item.description}</Text>
      <Text>${item.price}</Text>
      <Text>{item.rating}</Text>
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
    <View>
      <TextInput placeholder="Name" value={name} onChangeText={setName} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} />
      <TextInput placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput placeholder="Rating" value={rating} onChangeText={setRating} keyboardType="numeric" />
      <Button title={editingId ? "Update Dish" : "Add Dish"} onPress={handleSaveDish} />
      <FlatList data={dishes} renderItem={renderItem} keyExtractor={(item) => item.id} />
    </View>
  );
};

export default Catalog;
