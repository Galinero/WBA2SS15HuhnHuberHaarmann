var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var jsonParser = bodyParser.json();

var MongoClient = require('mongodb').MongoClient;
var myCollection;

var db = MongoClient.connect('mongodb://127.0.0.1:27017/shop', function(err, db){
	if(err) throw err;
	console.log("connected to mongoDB!");
	myCollection = db.collection('productcollection');
});




app.use(bodyParser.urlencoded());

app.get('/', function(req, res){
	res.sendFile(__dirname + '/addproduct.html');
});

app.get('/los', function(req, res){
	res.sendFile(__dirname + '/anmelden.html');
});


app.post("/addproduct", jsonParser, function(req, res){

	var product=req.body;

	myCollection.findOne({produkt: product.produkt}, function(err, result){
		if(err) throw err;
		if(result != null) {
			console.log("Produkt existiert bereits!");
			res.end("no");
		}
		else {
			myCollection.insert(product, function(err, doc){
				if(err) res.send("Problem beim einfügen in Datenbank!");
				else res.end("yes");
			});
		}
	});
});

	/*myCollection.insert(product, function(err, doc){
		if(err) res.send("Problem beim einfügen in Datenbank!");
		else res.end("yes");
	});
}*/

/*app.post("/anmelden", jsonParser, function(req, res){

	var user=req.body;
        myCollection.findOne({user_name: user.user_name}, function(err, result){
		if(err) throw err;
		if(result != null) {
			console.log("Benutzername existiert bereits!");
			res.end("no");
		}
		else {
			if(user.password==user.passwordwd){
			myCollection.insert(user, function(err, doc){
				if(err) res.send("Problem beim einfügen in Datenbank!");
				else res.end("yes");
			});}
			else {
				console.log("Passwoerter stimmen nicht ueberein!!");
				res.send("pw");
			}
		}
	});
});*/

app.listen(3000, function(){
	console.log("Port 3000");
})
