var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
var jsonParser = bodyParser.json();

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res){	
	res.sendFile(__dirname + '/index.html');
});

app.get('/los', function(req, res){
	res.sendFile(__dirname + '/anmelden.html');
});

app.post('/login', jsonParser, function(req, res){
	var user_name=req.body.user;
	var password=req.body.password;
	fs.readFile('./'+user_name+'.json', 'utf8', function(err, data){
		if(err) throw err;
		var y = JSON.parse(data);
		if(y.user_name == user_name && y.password == password) {
			console.log("anmelden erfolgreich!");
			res.end("yes");
		} else {console.log("falscher Name oder PW"); res.end("no");}
	});

});

app.post("/anmelden", jsonParser, function(req, res){
	var name=req.body.name;
	var nname=req.body.nname;
	var stra=req.body.stra;
	var nr=req.body.nr;
	var std=req.body.std;
	var plz=req.body.plz;
	var user_name=req.body.user;
	var password=req.body.password;
	fs.writeFile('./'+user_name+'.json',"{\n\"vorname\":\""+name+"\",\n\"nachname\":\""+nname+"\",\n\"straße\":\""+stra+"\",\n\"nummer\":\""+nr+"\",\n\"stadt\":\""+std+"\",\n\"plz\":\""+plz+"\",\n\"user_name\":\""+user_name+"\",\n\"password\":\""+password+"\"\n}", function(err){
		if(err) throw err;
	})
	console.log("geschrieben!");
	res.end("yes");
});

app.listen(3000, function(){
	console.log("Port 3000");
})
