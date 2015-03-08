var app = require('http').createServer(handler),
    fs = require('fs');

//app.listen(8080);
var express = require("express");
var chat = express();
var port = 3700;

chat.set('views', __dirname + '/tpl');
chat.set('view engine', "jade");
chat.engine('jade', require('jade').__express);
chat.get("/", function(req, res){
    res.render("page");
}); 

chat.use(express.static(__dirname + '/public'));

var io = require('socket.io').listen(chat.listen(port));
console.log("Listening on port " + port);

io.sockets.on('connection', function (socket) {
    socket.emit('message', { message: 'welcome to the chat' });
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});

function handler (req, res) {  
    console.log(req.url);
  if(req.url            === "/"){
    fs.readFile(__dirname + '/public/index.html',
        function (err, data) {
          if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
          }
          res.writeHead(200);
          res.end(data);
        });
  }
  else{
      console.log("FETCHING: " + __dirname + "/public"+req.url);
    fs.readFile(__dirname + "/public"+req.url, function (err, data) {
      if (err) {
        console.log("500 ERROR HAPPENING! - " + req.url);
        res.writeHead(500);
        return res.end('Error loading ' +"/public"+req.url);
      }
      res.writeHead(200);
      res.end(data);
    });
  }
}
app.listen(Number(process.env.PORT || 5000));