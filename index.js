// server.js
// where your node app starts

// init project
const express = require("express"),
      bodyparser = require("body-parser");
const app = express();

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});

var io = require('socket.io')(listener);
// APP CONFIG----------------------------------------------------------

//app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));

// app.use(function(req, res, next){
//   res.locals.currentUser = req.user || null;
//   res.locals.successflash = req.flash("successflash");
//   res.locals.error = req.flash("error");
//   next();
// });

//connection ----------------
//mongoose.connect(process.env.MONGODB_URI, {
//  useNewUrlParser: true,
//  useUnifiedTopology: true
//});
//===========================================================
var noOfUsers = 0;

app.get("/", function(req, res){
  res.render("index");
  console.log("User Count;"+noOfUsers);
});
app.get("/chat", function(req, res){
  res.render("chat");
  console.log("User Count;"+noOfUsers);
});

io.on("connection", (socket)=>{
    noOfUsers++;  
  socket.on("setUsername", (data)=>{
    socket.username = data;
    console.log(`${socket.username} : ${socket.id} is connected!`);
    socket.broadcast.emit("userJoined", data);
    io.emit("userCount", noOfUsers);
  });
  socket.on("typing", (msg)=>{
    console.log("keypress");
    socket.broadcast.emit("typing", msg);
    console.log(msg);
  });

  socket.on("stoptyping", (msg)=>{
    socket.broadcast.emit("stoptyping", msg);
  });
    
  socket.on("new message", (msg)=>{
    console.log(`message received at server: ${msg}`);
    socket.broadcast.emit("new message", msg);
  });
  
  socket.on("disconnect", ()=>{
    socket.on("stoptyping", (msg)=>{
      socket.broadcast.emit("stoptyping", msg);
    });
    console.log(`${socket.username} : ${socket.id} is disconnected!`);
    socket.broadcast.emit("userLeft",socket.username);
    noOfUsers--;
    io.emit("userCount", noOfUsers);
    console.log("User Count;"+noOfUsers);
  });
});
  console.log("User Count;"+noOfUsers);
