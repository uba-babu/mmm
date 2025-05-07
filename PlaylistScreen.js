import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';

export default function PlaylistScreen() {
  const [playlist, setPlaylist] = useState([
    { id: '1', title: 'Chill Vibes' },
    { id: '2', title: 'Workout Hits' },
  ]);

  const addSong = () => {
    setPlaylist([...playlist, { id: Date.now().toString(), title: 'New Song' }]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Your Playlist</Text>

      {playlist.length === 0 ? (
        <Text>No songs in playlist.</Text>
      ) : (
        <FlatList
          data={playlist}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Text style={styles.song}>{item.title}</Text>
          )}
        />
      )}

      <Button title="Add Random Song" onPress={addSong} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  song: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
