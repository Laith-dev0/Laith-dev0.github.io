const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
let lastFeedback = 'N/A';

wss.on('connection', (ws) => {
    console.log('New client connected');

    // Send the last feedback to the newly connected client
    ws.send(JSON.stringify({ feedback: lastFeedback }));

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);

        try {
            const data = JSON.parse(message); // Parse the incoming message

            // Update the last feedback
            lastFeedback = data.feedback || 'N/A';

            // Prepare the response to broadcast
            const response = { feedback: lastFeedback };
            console.log('Broadcasting:', response); // Log what is being broadcasted

            // Broadcast the last feedback to all clients
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(response)); // Send back valid JSON
                }
            });
        } catch (e) {
            console.error('Invalid JSON received:', e);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server started on ws://localhost:8080');
