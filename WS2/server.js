var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
var jsonParser = bodyParser.json();

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.post('/login', jsonParser, function(req, res){
	var user_name=req.body.user;
	var password=req.body.password;
	fs.writeFile('./user.json',"{\n\"user_name\":\""+user_name+"\",\n\"password\":\""+password+"\"\n}", function(err){
		if(err) throw err;
	})
	console.log("User name = "+user_name+", password is "+password);
	res.end("yes");
});

app.listen(3000, function(){
	console.log("Port 3000");
})
