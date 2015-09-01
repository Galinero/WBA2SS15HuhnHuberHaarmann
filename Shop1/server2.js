var express = require("express");
var bodyParser = require("body-parser");
var ejs = require("ejs");
var fs = require("fs");
var http = require("http");


var app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname+'/'));

app.get("/login", function(req, res){
  fs.readFile("./start.ejs", {encoding:"utf-8"}, function(err, filestring){
    if(err){
      throw err;
    } else{
      var options = {
        host: "localhost",
        port: 3000,
        path: "/",
        method:"GET",
        headers:{
          accept:"text/plain"
        }
      }
      var externalRequest = http.request(options, function(externalResponse){
        externalResponse.on("data", function(chunk){
          var html = ejs.render(filestring, chunk);
          res.setHeader("content-type", "text/html");
          res.writeHead(200);
          res.write(html);
          res.end();
        });
      });
      externalRequest.end();
    }
  });
});

app.get("/login/:id", function(req, res, next){
  fs.readFile("./login.ejs", {encoding:"utf-8"}, function(err, filestring){
    if(err){
      throw err;
    } else{
      var options = {
        host: "localhost",
        port: 3000,
        path: "/login/"+req.params.id,
        method:"GET",
        headers:{
          accept:"application/json"
        }
      }
      var externalRequest = http.request(options, function(externalResponse){
        externalResponse.on("data", function(chunk){
//hier fehlt noch das LoginSystem(brauche templates)
      	  var html = ejs.render(filestring, {user: user});
          res.setHeader("content-type", "text/html");
          res.writeHead(200);
          res.write(html);
          res.end();
        });
      });
      externalRequest.end();
    }
  });
});



app.get("/users/:id", function(req, res, next){
  fs.readFile("./user.ejs", {encoding:"utf-8"}, function(err, filestring){
    if(err){
      throw err;
    } else{
      var options = {
        host: "localhost",
        port: 3000,
        path: "/users/"+req.params.id,
        method:"GET",
        headers:{
          accept:"application/json"
        }
      }
      var externalRequest = http.request(options, function(externalResponse){
        externalResponse.on("data", function(chunk){

      	  var user = JSON.parse(chunk);

          var html = ejs.render(filestring, {user: user});
          res.setHeader("content-type", "text/html");
          res.writeHead(200);
          res.write(html);
          res.end();
        });
      });
      externalRequest.end();
    }
  });
});





app.post("/users", function(req, res){
    var newUser = req.body;
   
  fs.readFile("./users.ejs", {encoding:"utf-8"}, function(err, filestring){
    if(err){
      throw new err;
    } else{
      var options = {
        host: "localhost",
        port: 3000,
        path: "/users",
        method:"POST",
      }

      var externalRequest = http.request(options, function(externalResponse){
         externalResponse.on("data",function(chunk){
          var newUser1 = JSON.parse(chunk);
          console.log(JSON.stringify(newUser1));
          var html = ejs.render(filestring, newUser1);
          res.setHeader("content-type", "text/html");
          res.writeHead(200);
          res.write(html);
          res.end();
        });
      });

      externalRequest.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});
      externalRequest.setHeader("content-type", "application/json");
      externalRequest.write(JSON.stringify(newUser));
      console.log(newUser);
      externalRequest.end();
    }
});
});

app.listen(3001, function(){
  console.log("Server listens on Port 3001");
});
