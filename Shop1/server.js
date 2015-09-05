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
app.use(bodyParser.json());
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

app.get('/', function(req ,res){
	res.status(200).send("Startseite");
});

app.get('/registrierung', function(req ,res){
	res.status(200).send("Registrierung");
});

app.get('/admin/produktregistrierung', function(req ,res){
	res.status(200).send("Produktregistrierung");
});


app.get('/admin/produktsuche', function(req ,res){
	res.status(200).send("Produktsuche");
});


app.post('/login', jsonParser, function(req, res){
	var username=req.body.benutzer;
	var password=req.body.passwort;
	console.log(username+"   "+password);
	userCollection.findOne({user_name: username}, function(err, result){


		if(err) throw err;
		if(password == "admin"){
			res.status(200).send("admin");
		}
		else if(result == null){

			res.status(404).send("Benutzer existiert nicht");
		}
		else {
			if(result.password == password){
				res.status(200).json(result._id);

			}
			else {

				res.status(404).send("Falsches Passwort!");
			}
		}
	});
});





app.post("/users", jsonParser, function(req, res){

	var user=req.body;
        userCollection.findOne({user_name: user.user_name}, function(err, result){
		if(err) throw err;
		if(result != null) {
			res.status(404).send('Nutzer existiert bereits!');
		}
		else {
			userCollection.insert(user, function(err, doc){
				if(err) throw err;
				res.status(200).json(user._id);
			});
		}
	});
});

app.get("/users/:id", jsonParser, function(req, res){
	var user=req.body;
        userCollection.findOne({_id: req.id}, function(err, result){
		if(err) throw err;
		if(result == null) {
			res.status(404).send("Benutzername existiert nicht");
		}
		else {
			res.status(200).json(result);
		}
	});
});


app.put("/users/:id", jsonParser, function(req, res){
	var user=req.body;
	userCollection.findOne({_id: req.id}, function(err, result){
		if(err) throw err;
		if(result == null) {
			res.status(404).send("User existiert nicht!");
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

			res.status(200).send("User geaendert!");
		}
	});
});



app.delete("/users/:id", jsonParser, function(req, res){
	userCollection.findOne({_id:req.id}, function(err, result){
		if(err) throw err;
		if(result != null){
			userCollection.remove({'_id':result._id});
			res.status(200).send("Benutzer geloescht: "+result.user_name);
		}
		else {
			res.status(404).send("Benutzer existiert nicht!");
		}
	});
});


app.get("/users", jsonParser, function(req, res){
	var users = [];
	userCollection.find().toArray(function(err, result) {
		if(err) throw err;
		if(result == null) {
			res.status(404).send("Keine User vorhanden!");
		}
		else {
			for(var i = 0; i < result.length; i++){
				users.push(result[i])
			}
		}
		res.status(200).json(users);
	});
});
//Produkte verwalten

app.post("/products", jsonParser, function(req, res){
	var product=req.body;
	productCollection.findOne({produkt: product.produkt}, function(err, result){
		if(err) throw err;
		if(result != null) {
			res.status(404).send("Produkt existiert bereits!");
		}
		else {
			productCollection.insert(product, function(err, doc){
				if(err) throw err;
				res.status(200).send(product._id);
			});
		}
	});
});



app.put("/products", jsonParser, function(req, res){
	var product=req.body;
	productCollection.findOne({produkt: product.produkt}, function(err, result){
		if(err) throw err;
		if(result == null) {
			res.status(404).send("Produkt existiert nicht!");
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
			res.status(200).send("Produkt geaendert!");
		}
	});
});

app.get("/products", jsonParser, function(req, res){
	var products = [];
	productCollection.find().toArray(function(err, result) {
		if(err) throw err;
		if(result == null) {
			res.status(404).send("Keine Produkte vorhanden!");
		}
		else {
			for(var i = 0; i < result.length; i++){
				products.push(result[i])
			}
		}
		res.status(200).json(products);
	});
});

app.get("/products/:id", jsonParser, function(req, res){
	productCollection.findOne({_id: req.id}, function(err, result){
		if(err) throw err;
		if(result == null) {
			res.status(404).send("Produkt existiert nicht!");
		}
		else {
			res.status(200).json(result);
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
			res.status(404).send("Produkt existiert nicht!");
		}
		else {
				productCollection.remove({'_id':req.id}, function(err, data){
					if(err) throw err;
					res.status(200).send("Produkt geloescht: "+result.produkt);
				});
		}
	});
});



//Einkaufswagen verwalten

app.get('/products/:id/basket/:pid', jsonParser, function(req, res){
	productCollection.findOne({_id: req.pid}, function(err, result){
		if(err) throw err;
		if(result == null) {
			res.status(404).send("Produkt existiert nicht!");
		}
		else {
			userCollection.findOne({_id: req.id}, function(err, entry){
				if(err) throw err;
				userCollection.update({_id: req.id}, {$push: {basket: result}}, function(err, update){
					if(err || !update) throw err;
					console.log("Gespeichert!");
				});
			});
			res.status(200).send("yes");
		}
	});
});

app.delete("/products/:id/basket/:pid", jsonParser, function(req, res){
	productCollection.findOne({_id: req.pid}, function(err, result){
		if(err) throw err;
		if(result == null) res.status(404).send("Produkt existiert nicht!");
		else{
			userCollection.update({_id: req.id}, {$pull: {"basket": {_id: req.pid}}}, function(err, doc){
				if(err) throw err;
				res.status(200).send("yes");
			});
		}
	});


});

app.delete("/products/:id/basket", jsonParser, function(req, res){
	userCollection.update({_id: req.id}, {$set: {"basket": []}}, function(err, doc){
				if(err) throw err;
				res.status(200).send("Basket gelöscht!");
			});
});

app.put('/products/:id/basket/:pid', jsonParser, function(req, res) {
	var neu=req.body.anzahl;
	if(neu != null){
		userCollection.findOne({_id: req.id}, function(err, result){
			if(err) throw err;
			if(result == null) res.status(404).send("User existiert nicht");
			else{
				userCollection.update(
					{_id: req.id, "basket._id": req.pid},
					{$set: {"basket.$.anzahl": neu}},
					function(err, data){
						if(err) throw err;
						res.status(200).send("Anzahl auf "+neu+" geaendert!");
					});
			}
		});
	}
});

app.get('/logic', jsonParser, function(req,res) {
	var products = [];
	var gross;
	productCollection.find().toArray(function(err, result) {
		if(err) throw err;
		if(result == null) {
			res.status(404).send("Keine Produkte vorhanden!");
		}
		else {
			result.sort(function(a, b) {
				return parseFloat(b.gekauft) - parseFloat(a.gekauft);
			});
			for(var i = 0; i < result.length; i++){
				products.push(result[i]);
			}
		}
		res.status(200).json(products);
	});
});


app.post('/admin/produktsuche', jsonParser, function(req, res){
	var produkt=req.body.produkt;

	console.log("Suchen nach" +produkt);
	productCollection.findOne({produkt: produkt}, function(err, result){


		if(err) throw err;

		if(result == null){

			res.status(404).send("Produkt existiert nicht!");
		}
		else {
				res.status(200).json(result._id);

			}

	});
});

app.listen(3000, function(){
	console.log("Port 3000");
})
