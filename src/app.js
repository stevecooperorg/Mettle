var fs = require('fs');
var PEG = require("pegjs");

var grammarFile = "skillgrammar.txt";
var skillFile = "../examples/modern-combat/skills.txt";

var input = "aaa.\r\nbbb: ccc 5\r\n";

fs.readFile(grammarFile, 'utf-8', readGrammarFile);

function readGrammarFile(err, data) {
	grammarContent = data;
	createParser(data);
}

function parseSkillFile(parser, data) { 
	var result = parser.parse(input, 'node');
	console.log("parsed");
	console.log(JSON.stringify(result, null, 2));
}

function createParser(grammar) {
	var parserOptions = { 
		cache: true, 
		trackLineAndColumn: true 
	};
	var parser = PEG.buildParser(grammar, parserOptions);
	fs.readFile(skillFile, 'utf-8', function(err,data) {
		parseSkillFile(parser, data);
	});
}
