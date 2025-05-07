import React, { useState } from 'react';
import { View, Text, Switch, Button, StyleSheet } from 'react-native';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Settings</Text>

      <View style={styles.option}>
        <Text>Enable Notifications</Text>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
        />
      </View>

      <Button title="Logout" onPress={() => alert('Logged out!')} />
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
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});
