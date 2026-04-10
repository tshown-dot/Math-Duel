const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

http.listen(process.env.PORT || 3000, () => {
  console.log('Server is running!');
});