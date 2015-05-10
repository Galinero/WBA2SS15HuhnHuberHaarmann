fs = require('fs');
fs.readFile('wolkenkratzer.json', 'utf8', function (err, data) {
	if (err) {
		return console.log(err);
	}
    var x = JSON.stringify(data);
    var y = JSON.parse(data);
	for (var i = 0; i<y.wolkenkratzer.length; i++){
        console.log("Name: " + y.wolkenkratzer[i].name);
        console.log("Stadt: " + y.wolkenkratzer[i].stadt);
        console.log("Hoehe: " + y.wolkenkratzer[i].hoehe + "m");
        console.log("------------------");
    }
})