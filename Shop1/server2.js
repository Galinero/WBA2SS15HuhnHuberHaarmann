var express = require("express");
var bodyParser = require("body-parser");
var ejs = require("ejs");
var fs = require("fs");
var jsonParser = bodyParser.json();
var http = require("http");


var app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname+'/'));
app.use(bodyParser.urlencoded());


app.get("/start", function(req, res){
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

app.post("/login", jsonParser, function(req, res, next){
   var test = req.body;
      var options = {
        host: "localhost",
        port: 3000,
        path: "/login",
        method:"POST"
      }
      var externalRequest = http.request(options, function(externalResponse){
        console.log("Connected User post");
        externalResponse.setEncoding('utf8');
        externalResponse.on("data", function(chunk){
          console.log(chunk);
          if(chunk=="Benutzer existiert nicht") res.end('201');
          else if(chunk=="admin") res.end('202');
          else if(chunk=="Falsches Passwort!") res.end('203');
          else res.end(JSON.stringify(chunk));
        });
      });
      externalRequest.on('error', function(e) {
        console.log('problem with request: ' + e.message);
      });
      externalRequest.setHeader("content-type", "application/json");
      externalRequest.write(JSON.stringify(test));
      console.log(JSON.stringify(test));
      externalRequest.end();
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


app.get("/registrierung", function(req, res){
  fs.readFile("./registrierung.ejs", {encoding:"utf-8"}, function(err, filestring){
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

app.post("/users", jsonParser, function(req, res, next){
   var newUser = req.body;
      var options = {
        host: "localhost",
        port: 3000,
        path: "/users",
        method:"POST"
      }
      var externalRequest = http.request(options, function(externalResponse){
        console.log("register user");
        externalResponse.setEncoding('utf8');
        externalResponse.on("data", function(chunk){
          console.log(chunk);
          if(chunk=="Nutzer existiert bereits!") res.end('201');
          else res.end(JSON.stringify(chunk));
          //res.end('200');
        });
      });
      externalRequest.on('error', function(e) {
        console.log('problem with request: ' + e.message);
      });
      externalRequest.setHeader("content-type", "application/json");
      externalRequest.write(JSON.stringify(newUser));
      console.log(JSON.stringify(newUser));
      externalRequest.end();
});

app.get("/users", function(req, res, next){
  fs.readFile("./users.ejs", {encoding:"utf-8"}, function(err, filestring){
    if(err){
      throw err;
    } else{
      var options = {
        host: "localhost",
        port: 3000,
        path: "/users",
        method:"GET",
        headers:{
          accept:"application/json"
        }
      }
      var externalRequest = http.request(options, function(externalResponse){
        console.log("get users:");
        externalResponse.on("data", function(chunk){
          var users = JSON.parse(chunk);
          var html = ejs.render(filestring, {users: users});
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




app.get("/products/:id", function(req, res, next){
  fs.readFile("./products.ejs", {encoding:"utf-8"}, function(err, filestring){
    if(err){
      throw err;
    } else{
      var options = {
        host: "localhost",
        port: 3000,
        path: "/products",
        method:"GET",
        headers:{
          accept:"application/json"
        }
      }
      var externalRequest = http.request(options, function(externalResponse){
        console.log("show products");
        externalResponse.on("data", function(chunk){
          var products = JSON.parse(chunk);
          var html = ejs.render(filestring, {products: products, id:req.params.id});
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

app.get("/logic/:id", function(req, res, next){
  fs.readFile("./products.ejs", {encoding:"utf-8"}, function(err, filestring){
    if(err){
      throw err;
    } else{
      var options = {
        host: "localhost",
        port: 3000,
        path: "/logic",
        method:"GET",
        headers:{
          accept:"application/json"
        }
      }
      var externalRequest = http.request(options, function(externalResponse){
        console.log("get logic:");
        externalResponse.on("data", function(chunk){
          var products = JSON.parse(chunk);
          var html = ejs.render(filestring, {products: products});
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

app.get("/products/:id/basket/:pid", jsonParser, function(req, res, next){

      var options = {
        host: "localhost",
        port: 3000,
        path: "/products/"+req.params.id+"/basket/"+req.params.pid,
        method:"GET"
      }
      var externalRequest = http.request(options, function(externalResponse){

        externalResponse.setEncoding('utf8');
        externalResponse.on("data", function(chunk){
          console.log(chunk);
          if(chunk=="Produkt existiert nicht") res.end('201');
          else if(chunk=="yes") res.end('200');
        });
      });
      externalRequest.on('error', function(e) {
        console.log('problem with request: ' + e.message);
      });
      externalRequest.setHeader("content-type", "application/json");
      externalRequest.end();
});

app.get('/products/:id/basket', jsonParser, function(req, res, next){
  fs.readFile("./basket.ejs", {encoding:"utf-8"}, function(err, filestring){
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

app.post("/products/:id/basket/:pid", jsonParser, function(req, res, next){

      var options = {
        host: "localhost",
        port: 3000,
        path: "/products/"+req.params.id+"/basket/"+req.params.pid,
        method:"DELETE"
      }
      var externalRequest = http.request(options, function(externalResponse){

        externalResponse.setEncoding('utf8');
        externalResponse.on("data", function(chunk){
          console.log(chunk);
          if(chunk=="Produkt existiert nicht!") res.end('201');
          else if(chunk=="yes") res.end('200');
        });
      });
      externalRequest.on('error', function(e) {
        console.log('problem with request: ' + e.message);
      });
      externalRequest.setHeader("content-type", "application/json");
      externalRequest.end();
});

app.post("/products", jsonParser, function(req, res, next){
   var newProduct = req.body;
      var options = {
        host: "localhost",
        port: 3000,
        path: "/products",
        method:"POST"
      }
      var externalRequest = http.request(options, function(externalResponse){
        console.log("register products");
        externalResponse.setEncoding('utf8');
        externalResponse.on("data", function(chunk){
          console.log(chunk);
          if(chunk=="Produkt existiert bereits!") res.end('201');
          else res.end(JSON.stringify(chunk));
          //res.end('200');
        });
      });
      externalRequest.on('error', function(e) {
        console.log('problem with request: ' + e.message);
      });
      externalRequest.setHeader("content-type", "application/json");
      externalRequest.write(JSON.stringify(newProduct));
      console.log(JSON.stringify(newProduct));
      externalRequest.end();
});



app.get("/admin/produktregistrierung", function(req, res){
  fs.readFile("./produktregistrierung.ejs", {encoding:"utf-8"}, function(err, filestring){
    if(err){
      throw err;
    } else{
      var options = {
        host: "localhost",
        port: 3000,
        path: "/admin/produktregistrierung",
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


app.get("/admin/produktsuche", function(req, res){
  fs.readFile("./produktsuche.ejs", {encoding:"utf-8"}, function(err, filestring){
    if(err){
      throw err;
    } else{
      var options = {
        host: "localhost",
        port: 3000,
        path: "/admin/produktsuche",
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


app.get("/admin/produktsuche/suche/:query", jsonParser, function(req, res, next){
      fs.readFile("./productsn.ejs", {encoding:"utf-8"}, function(err, filestring){
    if(err){
      throw err;
    } else{
      var suche = req.body;
      var options = {
        host: "localhost",
        port: 3000,
        path: "/admin/produktsuche/?="+req.params.query,
        method:"get"
      }
      var externalRequest = http.request(options, function(externalResponse){
        console.log("search product");
        externalResponse.setEncoding('utf8');
        externalResponse.on("data", function(chunk){
          console.log(chunk);
          if(chunk=="Produkt existiert nicht!") res.end('201');
          else {
            var products = JSON.parse(chunk);
            var html = ejs.render(filestring, {products: products, id: "admin"});
            res.setHeader("content-type", "text/html");
            res.writeHead(200);
            res.write(html);
            res.end()
          }
          //res.end('200');
        });
      });
      externalRequest.on('error', function(e) {
        console.log('problem with request: ' + e.message);
      });
      externalRequest.setHeader("content-type", "application/json");
      externalRequest.write(JSON.stringify(suche));
      console.log(JSON.stringify(suche));
      externalRequest.end();
    }
    });
      
});








app.put("/products", jsonParser, function(req, res, next){
   var changedProduct = req.body;
      var options = {
        host: "localhost",
        port: 3000,
        path: "/products",
        method:"PUT"
      }
      var externalRequest = http.request(options, function(externalResponse){
        console.log("change product");
        externalResponse.setEncoding('utf8');
        externalResponse.on("data", function(chunk){
          console.log(chunk);
          if(chunk=="Produkt existiert nicht!") res.end('201');
          else res.end(chunk);
          //res.end('200');
        });
      });
      externalRequest.on('error', function(e) {
        console.log('problem with request: ' + e.message);
      });
      externalRequest.setHeader("content-type", "application/json");
      externalRequest.write(JSON.stringify(changedProduct));
      console.log(JSON.stringify(changedProduct));
      externalRequest.end();
});

app.put("/users/:id", jsonParser, function(req, res, next){
   var changedUser = req.body;
      var options = {
        host: "localhost",
        port: 3000,
        path: "/users/"+req.params.id,
        method:"PUT"
      }
      var externalRequest = http.request(options, function(externalResponse){
        externalResponse.setEncoding('utf8');
        externalResponse.on("data", function(chunk){
          console.log(chunk);
          if(chunk=="User existiert nicht!") res.end('201');
          else res.end(chunk);
          //res.end('200');
        });
      });
      externalRequest.on('error', function(e) {
        console.log('problem with request: ' + e.message);
      });
      externalRequest.setHeader("content-type", "application/json");
      externalRequest.write(JSON.stringify(changedUser));
      console.log(JSON.stringify(changedUser));
      externalRequest.end();
});

app.listen(3001, function(){
  console.log("Server listens on Port 3001");
});
