var fs = require('fs');
var c = require('chalk');
fs.readFile('wolkenkratzer.json', 'utf8', function (err, data) {
	if (err) {
		return console.log(err);
	}

var y = JSON.parse(data);
    
y.wolkenkratzer.sort(function (a, b) {
  if (a.hoehe > b.hoehe) {
    return -1;
  }
  if (a.hoehe < b.hoehe) {
    return 1;
  }
  return 0;
});

var ges = 0;
var z = JSON.stringify(y);

fs.writeFile('wolkenkratzer_sortiert.json', z, function (err) {
    if (err) throw err;
    console.log(c.magenta.bold.inverse('Gespeichert!'));
});
    
	for (var i = 0; i<y.wolkenkratzer.length; i++){
        ges += y.wolkenkratzer[i].hoehe; 
        console.log(c.bgCyan.bold("Name: " + y.wolkenkratzer[i].name));
        console.log(c.green.underline.inverse("Stadt: " + y.wolkenkratzer[i].stadt));
        console.log(c.inverse.bold("Hoehe: " + y.wolkenkratzer[i].hoehe + "m"));
        console.log("------------------");
    }
    
    console.log(c.blue.bold.inverse("Gesamte Hoehenmeter: " + ges + "m"));
})