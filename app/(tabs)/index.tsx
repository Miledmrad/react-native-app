import { StyleSheet,TextInput,
  FlatList,
  ActivityIndicator,
  Image,    
  Alert,} from 'react-native';
import { Text, View, } from '@/components/Themed';
import React, { useEffect, useState } from 'react';



type User = {
  name: {
    first: string;
    last: string;
  };
  email: string;
  picture: {
    medium: string;
  };
};

export default function TabOneScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    if (isFetching || !hasMore) return;

    setIsFetching(true);
    try {
      const response = await fetch(`https://randomuser.me/api/?page=${page}&results=20`);
      const data = await response.json();

      if (data.results.length === 0) {
        setHasMore(false);
      } else {
        setUsers(prev => [...prev, ...data.results]);
        setPage(prev => prev + 1);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch users');
      Alert.alert('Error', 'Could not load users');
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const fullName = `${user.name.first} ${user.name.last}`.toLowerCase();
    return (
      fullName.includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.picture.medium }} style={styles.avatar} />
      <View>
        <Text style={styles.name}>{item.name.first} {item.name.last}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!isFetching) return null;
    return <ActivityIndicator size="large" />;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Book</Text>

      <TextInput
        style={styles.search}
        placeholder="Search by name or email..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item, index) => item.email + index}
        renderItem={renderItem}
        onEndReached={fetchUsers}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 10 },
  search: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  name: { fontSize: 16, fontWeight: 'bold' },
  email: { fontSize: 14, color: '#555' },
  empty: { textAlign: 'center', marginTop: 30, fontSize: 16 },
});
