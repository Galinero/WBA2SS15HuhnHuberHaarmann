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

app.get('/psearch', function(req, res){
	res.sendFile(__dirname + '/productsearch.html');
});

app.get('/dproduct', function(req, res){
	res.sendFile(__dirname + '/deleteproduct.html');
});

app.get('/cproduct', function(req, res){
	res.sendFile(__dirname + '/changeproduct.html');
});


app.post("/addproduct", jsonParser, function(req, res){

	var product=req.body;
	if(product.produkt=="") res.end("leer");

	myCollection.findOne({produkt: product.produkt}, function(err, result){
		if(err) throw err;
		if(result != null) {
			console.log("Produkt existiert bereits!");
			res.end("existent");
		}
		else {
			myCollection.insert(product, function(err, doc){
				if(err) res.send("Problem beim einfügen in Datenbank!");
				else res.end("yes");
			});
		}
	});
});


app.post("/changeproduct", jsonParser, function(req, res){

	var product=req.body;
	if(product.produkt=="") res.end("leer");

	myCollection.findOne({produkt: product.produkt}, function(err, result){
		if(err) throw err;
		if(result == null) {
			console.log("Produkt existiert nicht!");
			res.end("notexistent");
		}
		else {
			if(result.hersteller==product.hersteller){
				myCollection.update({
					'produkt':result.produkt},{$set:{
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

	myCollection.findOne({produkt: produktname}, function(err, result){

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

	myCollection.findOne({produkt: produktname}, function(err, result){

		if(err) throw err;

		if(result == null){
			console.log("Produkt nicht gefunden");
			res.end("produkt");
		}
		else {
			if(result.hersteller==herstellername){
				//myCollection.remove({'title: result'})
				myCollection.remove({'produkt':result.produkt});
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

app.listen(3000, function(){
	console.log("Port 3000");
})
