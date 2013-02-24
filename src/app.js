var fs = require('fs');

fs.readFile('../examples/modern-combat/skills.txt', 'utf-8', function(err, data) {
	console.log(data);
});