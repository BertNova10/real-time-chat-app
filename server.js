const express = require("express");
const http = require("http");
const {Server} = require("socket.io");
const mongoose = require('mongoose');
const Message = require('./models/Message');  // Adjust path if needed
const path = require("path");


const app = express();
const server = http.createServer(app);
const io = new Server(server);

//connect to MongoDB
mongoose.connect("mongodb+srv://akashsabavath09:acnayak9@cluster0.cra8c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(() => console.log('connected to Data base')).catch(err => console.error(err));

//Middleware
app.set("views", path.join(__dirname, "views"));
app.use(express.static('public'));
app.set('view engine','ejs');

//routes
app.get('/',(req,res)=>{
    res.render('index');
});

//SockerIO logic
io.on('connection', (socket)=>{
    console.log('A user connected');

    //Load previous messages
    Message.find().sort({createdAr : 1}).limit(50)
    .then(messages=> {
        socket.emit('load messages', messages);
    });
      // Handle new messages
  socket.on('send message', async (msg) => {
    const message = new Message({
      username: msg.username,
      content: msg.content
    });

    await message.save();
    io.emit('new message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});



const PORT =6016 || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

