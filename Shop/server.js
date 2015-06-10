var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var jsonParser = bodyParser.json();
var nodemailer = require('nodemailer');

var MongoClient = require('mongodb').MongoClient;
var userCollection, productCollection, basketCollection;
var ObjectId = require('mongodb').ObjectID;

var db = MongoClient.connect('mongodb://127.0.0.1:27017/shop', function(err, db){
	if(err) throw err;
	console.log("connected to mongoDB!");
	userCollection = db.collection('usercollection');
	productCollection = db.collection('productcollection');
});

var transporter = nodemailer.createTransport({
	service: 'Hotmail',
	auth: {
		user: 'mail@hotmail.de',
		pass: 'pass'
	}
});

var mailOptions = {
    from: 'Fred Foo <foo@blurdybloop.com>', // sender address
    to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
    subject: 'Hello', // Subject line
    text: 'Hello world', // plaintext body
    html: '<b>Hello world ✔</b>' // html body
};

app.use(bodyParser.urlencoded());

//Login-System

app.param('id', function(req, res, next, id) {

	req.id = new ObjectId(id);
	next();
});

app.param('pid', function(req, res, next, pid) {

	req.pid = new ObjectId(pid);
	next();
});

app.get('/login/:id', jsonParser, function(req, res){
	var username=req.body.user;
	var password=req.body.password;

	userCollection.findOne({user_name: username}, function(err, result){


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
			else if(password == "admin"){
				console.log("Anmeldung als Admin");
				res.end("admin");
			}
			else {
				console.log("Falsches Passwort!");
				res.end("no");
			}
		}
	});
});

app.post("/users", jsonParser, function(req, res){

	var user=req.body;
        userCollection.findOne({user_name: user.user_name}, function(err, result){
		if(err) throw err;
		if(result != null) {
			console.log("Benutzername existiert bereits!");
			res.end("no");
		}
		else {
			userCollection.insert(user, function(err, doc){
				if(err) throw err;
				console.log("Neuen Benutzer angelegt: "+user.user_name);
				res.end("yes");
			});
		}
	});
});

app.put("/users/:id", jsonParser, function(req, res){
	var user=req.body;
	userCollection.findOne({_id: req.id}, function(err, result){
		if(err) throw err;
		if(result == null) {
			console.log("User existiert nicht!");
			res.end("no");
		}
		else {
			userCollection.update({
				'_id':result._id},{$set:{
					'vorname':user.vorname,
					'nachname':user.nachname,
					'strasse':user.strasse,
					'nr':user.nr,
					'plz':user.plz,
					'stadt':user.stadt,
					'password':user.password
					}});

			console.log("User "+result.user_name+" geaendert!");
			res.end("yes");
		}
	});
});
	


app.delete("/users/:id", jsonParser, function(req, res){
	userCollection.findOne({_id:req.id}, function(err, result){
		if(err) throw err;
		if(result != null){
			userCollection.remove({'_id':result._id});
			console.log("Benutzer geloescht: "+result.user_name);
			res.end("yes");
		}else {
			console.log("Benutzer existiert nicht!");
			res.end("no");
		}
	});
});

//Produkte verwalten

app.post("/products", jsonParser, function(req, res){
	var product=req.body;
	productCollection.findOne({produkt: product.produkt}, function(err, result){
		if(err) throw err;
		if(result != null) {
			console.log("Produkt existiert bereits!");
			res.end("no");
		}
		else {
			productCollection.insert(product, function(err, doc){
				if(err) throw err;
				console.log(product.produkt+" in Datenbank eingefuegt!");					
				res.end("yes");
			});
		}
	});
});

app.put("/products/:id", jsonParser, function(req, res){
	var product=req.body;
	productCollection.findOne({_id: req.id}, function(err, result){
		if(err) throw err;
		if(result == null) {
			console.log("Produkt existiert nicht!");
			res.end("no");
		}
		else {
			productCollection.update({
				'_id':result._id},{$set:{
					'produkt':product.produkt,
					'herkunft':product.herkunft,
					'hersteller':product.hersteller,
					'preis':product.preis,
					'vorrat':product.vorrat
					}});
			console.log("Produkt geaendert!");
			res.end("yes");
		}
	});
});

/*
app.post('/productsearch', jsonParser, function(req, res){
	var produktname=req.body.produkt;
	var herstellername=req.body.hersteller;
	//var herkunft=req.body.hersteller;
	//var preis=req.body.preis;
	//var vorrat=req.body.vorrat;

	productCollection.findOne({produkt: produktname}, function(err, result){

		if(err) throw err;

		if(result == null){
			console.log("Produkt nicht gefunden");
			res.end("produkt");
		}
		else {
			if(result.hersteller==herstellername){
				console.log("Produkt gefunden: "+result.produkt+" "+result.hersteller+" "+result.herkunft+" "+result.preis+" "+result.vorrat);
				res.end("Produkt gefunden, Produkt: "+result.produkt+" Hersteller: "+result.hersteller+" Herkunft: "+result.herkunft+" Preis: "+result.preis+" Vorrat: "+result.vorrat);
				//res.end("yes");
			}
			else{
				console.log("Hersteller nicht gefunden!");
				res.end("hersteller");

			}
		}
	});
});
*/

app.delete('/products/:id', jsonParser, function(req, res){
	productCollection.findOne({_id: ObjectId(req.id)}, function(err, result){
		if(err) throw err;
		if(result == null){
			console.log("Produkt existiert nicht!");
			res.end("no");
		}
		else {
				productCollection.remove({'_id':req.id}, function(err, data){
					if(err) throw err;
					console.log("Produkt geloescht: "+result.produkt);
					res.end("yes");
				});
		}
	});
});



//Einkaufswagen verwalten

app.get('/users/:id/basket/:pid', jsonParser, function(req, res){
	productCollection.findOne({_id: req.pid}, function(err, result){
		if(err) throw err;
		if(result == null) {
			console.log("Produkt existiert nicht!");
			res.end("no");
		}
		else {
			userCollection.findOne({_id: req.id}, function(err, entry){
				if(err) throw err;
				userCollection.update({_id: req.id}, {$push: {basket: result}}, function(err, update){
					if(err || !update) throw err;
					console.log("Gespeichert!");
				});		
			});
			res.end("yes");
		}	
	});
});

app.delete("/users/:id/basket/:pid", jsonParser, function(req, res){
	productCollection.findOne({_id: req.pid}, function(err, result){
		if(err) throw err;
		if(result == null) console.log("Produkt existiert nicht!");
		else{
			userCollection.update({_id: req.id}, {$pull: {"basket": {_id: req.pid}}}, function(err, doc){
				if(err) throw err;
				console.log(result.produkt+" aus Basket gelöscht");				
				res.end("yes");			
			});
		}
	});	
	
        
});

app.delete("/users/:id/basket", jsonParser, function(req, res){
	userCollection.update({_id: req.id}, {$set: {"basket": []}}, function(err, doc){
				if(err) throw err;
				console.log("Basket gelöscht!");
				res.end("yes");			
			});
});

app.put('/users/:id/basket/:pid', jsonParser, function(req, res) {
	var neu=req.body.anzahl;
	if(neu != null){	
		userCollection.findOne({_id: req.id}, function(err, result){
			if(err) throw err;
			if(result == null) console.log("User existiert nicht");
			else{
				userCollection.update(
					{_id: req.id, "basket._id": req.pid},
					{$set: {"basket.$.anzahl": neu}}, 
					function(err, data){
						if(err) throw err;
						console.log("Anzahl auf "+neu+" geaendert!");
						res.end("yes");
					});
			}
		});		
	}
});


app.listen(3000, function(){
	console.log("Port 3000");
})