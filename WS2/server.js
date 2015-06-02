var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var jsonParser = bodyParser.json();

var MongoClient = require('mongodb').MongoClient;
var myCollection;

var db = MongoClient.connect('mongodb://127.0.0.1:27017/shop', function(err, db){
	if(err) throw err;
	console.log("connected to mongoDB!");
	myCollection = db.collection('usercollection');
});

app.use(bodyParser.urlencoded());

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/los', function(req, res){
	res.sendFile(__dirname + '/anmelden.html');
});

app.post('/login', jsonParser, function(req, res){
	var username=req.body.user;
	var password=req.body.password;

	myCollection.findOne({user_name: username}, function(err, result){


		if(err) throw err;

		if(result == null){ 
			console.log("Benutzer existiert nicht"); 
			res.end("no");
		}
		else {		
			if(result.password == password){
				console.log("Anmeldung erfolgreich "+result.vorname);
				res.end("yes");
			}
			else {
				console.log("Falsches Passwort!"); 
				res.end("no");
			}		
		}
	});
});

app.post("/anmelden", jsonParser, function(req, res){
	
	var user=req.body;
        myCollection.findOne({user_name: user.user_name}, function(err, result){
		if(err) throw err;
		if(result != null) {
			console.log("Benutzername existiert bereits!"); 
			res.end("no");
		}
		else {	
			myCollection.insert(user, function(err, doc){
				if(err) res.send("Problem beim einfügen in Datenbank!");
				else res.end("yes");
			});
		}
	});
});

app.get('/users', function(req, res) {
	myCollection.find().toArray(function(err, items){
		res.json(items);
	});
});

app.listen(3000, function(){
	console.log("Port 3000");
})
