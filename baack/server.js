const express = require('express');
const OneSignal = require('onesignal-node');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Initialize OneSignal client
const client = new OneSignal.Client('******','******');

app.post('/helloj',async (req,res)=>{
  const notification = {
    contents: {
      'tr': 'Yeni bildirim',
      'en': 'New notification',
    },
    included_segments: ['Subscribed Users'],
    filters: [
      { field: 'tag', key: 'level', relation: '>', value: 10 }
    ]
  };
  try {
    const response = await client.createNotification(notification);
    console.log(response.body.id);
  } catch (e) {
    if (e instanceof OneSignal.HTTPError) {
      // When status code of HTTP response is not 2xx, HTTPError is thrown.
      console.log(e.statusCode);
      console.log(e.body);
    }
  }
})
// Endpoint to send notifications
app.post('/send-notification', async (req, res) => {
  const { playerId, title, message } = req.body;

  // Basic validation
  if (!playerId || !title || !message) {
    return res.status(400).json({ success: false, message: 'Player ID, title, and message are required.' });
  }

  const notification = {
    app_id: '********', // Explicitly add the subscription_id here
    headings: { en: title },
    contents: { en: message },
    include_player_ids: [playerId],
  };

  try {
    const response = await client.createNotification(notification, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic *******` // Replace with your OneSignal REST API Key
      }
    });
    console.log('Notification sent successfully:', response);
    return res.status(200).json({ success: true, response });
  } catch (error) {
    console.error('Error sending notification:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
