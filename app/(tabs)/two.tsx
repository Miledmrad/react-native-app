
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; 

type Item = {
  id: string;
  name: string;
  quantity: number;
  bought: boolean;
};

export default function TabTwoScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'bought' | 'unbought'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'quantity'>('name');

  const addItem = () => {
    if (!name.trim() || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      Alert.alert('Validation Error', 'Please enter valid name and quantity.');
      return;
    }

    const newItem: Item = {
      id: Date.now().toString(),
      name: name.trim(),
      quantity: Number(quantity),
      bought: false,
    };

    setItems(prev => [...prev, newItem]);
    setName('');
    setQuantity('');
  };

  const toggleBought = (id: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, bought: !item.bought } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const filteredItems = items
    .filter(item => {
      if (filter === 'bought') return item.bought;
      if (filter === 'unbought') return !item.bought;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return a.quantity - b.quantity;
    });

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.itemContainer}>
      <Text style={[styles.itemText, item.bought && styles.bought]}>
        {item.name} x{item.quantity}
      </Text>
      <View style={styles.buttons}>
        <Button
          title={item.bought ? 'Unbuy' : 'Bought'}
          onPress={() => toggleBought(item.id)}
        />
        <Button title="Delete" color="red" onPress={() => deleteItem(item.id)} />
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smart Groceries</Text>

      <TextInput
        style={styles.input}
        placeholder="Item name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />
      <Button title="Add Item" onPress={addItem} />

      <View style={styles.controls}>
        <Text>Filter:</Text>
        <Picker
          selectedValue={filter}
          style={styles.picker}
          onValueChange={(value: 'all' | 'bought' | 'unbought') => setFilter(value)}
        >
          <Picker.Item label="All" value="all" />
          <Picker.Item label="Bought" value="bought" />
          <Picker.Item label="Unbought" value="unbought" />
        </Picker>

        <Text>Sort by:</Text>
        <Picker
          selectedValue={sortBy}
          style={styles.picker}
          onValueChange={(value: 'name' | 'quantity') => setSortBy(value)}
        >
          <Picker.Item label="Name (A-Z)" value="name" />
          <Picker.Item label="Quantity (asc)" value="quantity" />
        </Picker>
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: Platform.OS === 'android' ? 25 : 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
  },
  controls: {
    marginTop: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
  },
  itemContainer: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 8,
  },
  bought: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
