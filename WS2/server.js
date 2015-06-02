var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
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
			console.log("Nope!");
			res.end("no");
		}

		else{

			if(password == result.password){
				console.log("Anmeldung erfolgreich!");
				res.end("yes");
			}

			else {console.log("Falscher Name oder PW!"); res.end("no");}
		}
	});
});

/*fs.readFile('./'+user_name+'.json', 'utf8', function(err, data){
		if(err) throw err;
		var y = JSON.parse(data);
		if(y.user_name == user_name && y.password == password) {
			console.log("anmelden erfolgreich!");
			res.end("yes");
		} else {console.log("falscher Name oder PW"); res.end("no");}
	});

});*/

app.post("/anmelden", jsonParser, function(req, res){

	var name=req.body.name;
	var nname=req.body.nname;
	var stra=req.body.stra;
	var nr=req.body.nr;
	var std=req.body.std;
	var plz=req.body.plz;
	var user_name=req.body.user;
	var password=req.body.password;


	myCollection.insert({
		"vorname" : name,
		"nachname" : nname,
		"straße" : stra,
		"nummer" : nr,
		"plz" : plz,
		"stadt" : std,
		"user_name" : user_name,
		"password" : password
	}, function(err, doc){
		if(err){res.send("Problem!!!!");}
		else {
			res.end("yes");
		}
	});
});

	/*fs.writeFile('./'+user_name+'.json',"{\n\"vorname\":\""+name+"\",\n\"nachname\":\""+nname+"\",\n\"straße\":\""+stra+"\",\n\"nummer\":\""+nr+"\",\n\"stadt\":\""+std+"\",\n\"plz\":\""+plz+"\",\n\"user_name\":\""+user_name+"\",\n\"password\":\""+password+"\"\n}", function(err){
		if(err) throw err;
	})
	console.log("geschrieben!");
	res.end("yes");
});*/

app.get('/users', function(req, res) {
	myCollection.find().toArray(function(err, items){
		res.json(items);
	});
});

app.listen(3000, function(){
	console.log("Port 3000");
})
