import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from 'react-native';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (query.trim() === '') {
      alert('Please enter a search term.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://192.168.1.34:8000/api/songs/');
      const songs = await response.json();

      // Filter songs based on title or artist match
      const filtered = songs.filter(
        (song) =>
          song.title.toLowerCase().includes(query.toLowerCase()) ||
          song.artist.toLowerCase().includes(query.toLowerCase())
      );

      setResults(filtered);
    } catch (error) {
      console.error('Error fetching songs:', error);
      alert('Error fetching songs');
    } finally {
      setLoading(false);
      Keyboard.dismiss();
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.songItem}>
      <Text style={styles.songTitle}>{item.title}</Text>
      <Text style={styles.songArtist}>{item.artist}</Text>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>🔍 Search Music</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter song or artist"
          placeholderTextColor="#888"
          value={query}
          onChangeText={setQuery}
        />

        <Button title="Search" onPress={handleSearch} />

        {loading ? (
          <Text style={styles.loading}>Loading...</Text>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            style={{ marginTop: 20 }}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  songItem: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 10,
  },
  songTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  songArtist: {
    fontSize: 14,
    color: '#555',
  },
  loading: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
});
