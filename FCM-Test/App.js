import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { OneSignal } from 'react-native-onesignal';
import axios from 'axios';

export default function App() {
  const [playerId, setPlayerId] = useState('***********');

  useEffect(() => {
    // OneSignal Initialization
    OneSignal.initialize('***********'); // Replace with your OneSignal App ID

    // Request permission for notifications
    OneSignal.Notifications.requestPermission(true);

    // Fetch Player ID when the device is registered
    OneSignal.User.getOnesignalId().then(userId => {
      if (userId) {
        setPlayerId(userId);
        console.log('OneSignal Player ID:', userId);
      } else {
        console.error("User ID not found. User may not be subscribed.");
      }
    });
    OneSignal.User.pushSubscription

    // Handle notification opened
    OneSignal.Notifications.addEventListener('click', (event) => {
      console.log('OneSignal: notification clicked:', event);
    });

    return () => {
      // Cleanup the listener on unmount
      OneSignal.Notifications.removeEventListener('click');
    };
  }, []);

  const sendNotification = async () => {
    if (!playerId) {
      Alert.alert("Error", "Player ID is not available.");
      return;
    }

    const notificationData = {
      app_id: "***********", // Your OneSignal App ID
      contents: { en: "Hello from OneSignal!" }, // Notification message
      included_segments: ["All"], // Send to all users
      headings: { en: "MIC testing Notification" }, // Notification title
    };
  
    try {
      const response = await axios.post('https://api.onesignal.com/notifications', notificationData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic OGIxNWY1YjUtMTJjOS00YmFjLWIwNTItMGQ5NjRjMjdlYjNi' // Your OneSignal REST API Key
        }
      });
      console.log('Notification sent successfully:', response.data);
      Alert.alert("Success", "Notification sent!");
    } catch (error) {
      console.error('Error sending notification:', error.response ? error.response.data : error.message);
      Alert.alert("Error", "Failed to send notification.");
    }
  };

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Button title="Send Notification" onPress={sendNotification} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
