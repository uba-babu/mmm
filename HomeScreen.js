import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { Audio } from 'expo-av';

const SERVER_IP = '192.168.1.34'; // ✅ Ensure this IP matches your backend server
const BASE_URL = `http://${SERVER_IP}:8000`;

const HomeScreen = () => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sound, setSound] = useState(null);
    const [currentSong, setCurrentSong] = useState(null);

    const fetchSongs = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/songs/`);
            const data = await response.json();
            setSongs(data);
        } catch (error) {
            console.error('Error fetching songs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSongs();

        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, []);

    const togglePlay = async (fileUrl) => {
        try {
            if (currentSong === fileUrl && sound) {
                const status = await sound.getStatusAsync();
                if (status.isPlaying) {
                    await sound.pauseAsync();
                } else {
                    await sound.playAsync();
                }
            } else {
                if (sound) {
                    await sound.stopAsync();
                    await sound.unloadAsync();
                }

                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: `${BASE_URL}${fileUrl}` },
                    { shouldPlay: true }
                );

                setSound(newSound);
                setCurrentSong(fileUrl);
            }
        } catch (error) {
            console.error('Error handling audio:', error);
        }
    };

    const renderItem = ({ item }) => {
        const isPlaying = item.file === currentSong;

        return (
            <TouchableOpacity
                style={[styles.songItem, isPlaying && styles.playing]}
                onPress={() => togglePlay(item.file)}
            >
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.artist}>{item.artist}</Text>
                {isPlaying && <Text style={styles.status}>▶️ Playing</Text>}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>🎵 Song List</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#4CAF50" />
            ) : (
                <FlatList
                    data={songs}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center', // ✅ Fixed syntax: removed stray `42`
    },
    songItem: {
        marginBottom: 15,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#F0F0F0',
    },
    playing: {
        backgroundColor: '#D1FAD7',
        borderColor: '#4CAF50',
        borderWidth: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    artist: {
        fontSize: 14,
        color: '#555',
    },
    status: {
        fontSize: 12,
        color: '#4CAF50',
        marginTop: 5,
    },
});

export default HomeScreen;
