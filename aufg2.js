var fs = require('fs');
var c = require('chalk');
fs.readFile('wolkenkratzer.json', 'utf8', function (err, data) {
	if (err) {
		return console.log(err);
	}
    var y = JSON.parse(data);
	for (var i = 0; i<y.wolkenkratzer.length; i++){
        console.log(c.bgCyan.bold("Name: " + y.wolkenkratzer[i].name));
        console.log(c.green.underline.inverse("Stadt: " + y.wolkenkratzer[i].stadt));
        console.log(c.inverse.bold("Hoehe: " + y.wolkenkratzer[i].hoehe + "m"));
        console.log("------------------");
    }
})