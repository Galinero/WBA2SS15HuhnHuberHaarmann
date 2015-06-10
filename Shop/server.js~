var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var jsonParser = bodyParser.json();
var nodemailer = require('nodemailer');

var MongoClient = require('mongodb').MongoClient;
var userCollection, productCollection, basketCollection;

var db = MongoClient.connect('mongodb://127.0.0.1:27017/shop', function(err, db){
	if(err) throw err;
	console.log("connected to mongoDB!");
	userCollection = db.collection('usercollection');
	productCollection = db.collection('productcollection');
	basketCollection = db.collection('basketcollection');
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

//Routen für HTML Dateien

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/los', function(req, res){
	res.sendFile(__dirname + '/anmelden.html');
});

app.get('/psearch', function(req, res){
	res.sendFile(__dirname + '/productsearch.html');
});

app.get('/dproduct', function(req, res){
	res.sendFile(__dirname + '/deleteproduct.html');
});

app.get('/cproduct', function(req, res){
	res.sendFile(__dirname + '/changeproduct.html');
});

app.get('/aproduct', function(req, res){
	res.sendFile(__dirname + '/addproduct.html');
});

app.get('/admin', function(req, res){
	res.sendFile(__dirname + '/productsearchadmin.html');
});


//Login-System

app.post('/login', jsonParser, function(req, res){
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

app.post("/anmelden", jsonParser, function(req, res){

	var user=req.body;
        userCollection.findOne({user_name: user.user_name}, function(err, result){
		if(err) throw err;
		if(result != null) {
			console.log("Benutzername existiert bereits!");
			res.end("no");
		}
		else {
			if(user.password==user.passwordwd){
			userCollection.insert(user, function(err, doc){
				if(err) res.send("Problem beim einfügen in Datenbank!");
				else res.end("yes");
			});}
			else {
				console.log("Passwoerter stimmen nicht ueberein!!");
				res.send("pw");
			}
		}
	});
});

app.get('/users', function(req, res) {
	userCollection.find().toArray(function(err, items){
		res.json(items);
	});
});


//Produkte verwalten

app.post("/addproduct", jsonParser, function(req, res){

	var product=req.body;
	if(product.produkt=="") res.end("leer");

	productCollection.findOne({produkt: product.produkt}, function(err, result){
		if(err) throw err;
		if(result != null) {
			console.log("Produkt existiert bereits!");
			res.end("existent");
		}
		else {
			productCollection.insert(product, function(err, doc){
				if(err) res.send("Problem beim einfügen in Datenbank!");
				else res.end("yes");
			});
		}
	});
});

app.post("/changeproduct", jsonParser, function(req, res){

	var product=req.body;
	if(product.produkt=="") res.end("leer");

	productCollection.findOne({produkt: product.produkt}, function(err, result){
		if(err) throw err;
		if(result == null) {
			console.log("Produkt existiert nicht!");
			res.end("notexistent");
		}
		else {
			if(result.hersteller==product.hersteller){
				productCollection.update({
					'produkt':result.produkt},{$set:{
						'produkt':product.nprodukt,
						'herkunft':product.herkunft,
						'hersteller':product.hersteller,
						'preis':product.preis,
						'vorrat':product.vorrat
					}});

				console.log("Produkt geaendert!");
				res.end("yes");
			}
			else{
				console.log("Hersteller nicht gefunden!");
				res.end("hersteller");
			}
		}
	});
});

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

app.post('/deleteproduct', jsonParser, function(req, res){
	var produktname=req.body.produkt;
	var herstellername=req.body.hersteller;

	productCollection.findOne({produkt: produktname}, function(err, result){

		if(err) throw err;

		if(result == null){
			console.log("Produkt nicht gefunden");
			res.end("produkt");
		}
		else {
			if(result.hersteller==herstellername){
				//myCollection.remove({'title: result'})
				productCollection.remove({'produkt':result.produkt});
				console.log("Produkt geloescht: "+result.produkt);
				res.end("yes");
			}
			else{
				console.log("Hersteller nicht gefunden!");
				res.end("hersteller");
			}

		}
	});
});



//Einkaufswagen verwalten

app.param('name', function(req, res, next, name) {

	req.name = name;
	next();
});

app.get('/add/:name', jsonParser, function(req, res){
	productCollection.findOne({produkt: req.name}, function(err, result){
		if(err) throw err;
		if(result == null) console.log("gibt es nicht");
		else{
			basketCollection.insert(result, function(err, doc){
				if(err) res.send("Problem beim einfügen in Datenbank!");
				res.end("yes");			
			});
		}
	});	
});

app.get("/delete/:name", jsonParser, function(req, res){
	productCollection.findOne({produkt: req.name}, function(err, result){
		if(err) throw err;
		if(result == null) console.log("gibt es nicht");
		else{
			basketCollection.remove({produkt: req.name}, function(err, doc){
				if(err) res.send("Problem beim löschen des Eintrags!");
				res.end("yes");			
			});
		}
	});	
	
        
});

app.get('/modify/:name', function(req, res) {
	basketCollection.findOne({produkt: req.name}, function(err, result){
		if(err) throw err;
		if(result == null) console.log("gibt es nicht");
		else{
			basketCollection.update(
				{produkt: req.name}, 
				{$inc: {anzahl: 1}}, 
				{upsert: true, safe: true},
				function(err, data){
					if(err) throw err;
					else{
						res.end("yes");
					}
				});
		}
	});	

});

app.get('/products', function(req, res) {
	productCollection.find().toArray(function(err, items){
		for(var i = 0; i < items.length; i++){
		console.log(items[i].name);
		}
		res.json(items);
		
	});
});


app.listen(3000, function(){
	console.log("Port 3000");
})
