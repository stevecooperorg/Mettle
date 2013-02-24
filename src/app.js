var fs = require('fs');
var PEG = require("pegjs");

var grammarFile = "skillgrammar.txt";
var skillFile = "../examples/modern-combat/skills.txt";

fs.readFile(grammarFile, 'utf-8', readGrammarFile);

function readGrammarFile(err, data) {
	grammarContent = data;
	createParser(data);
}

function parseSkillFile(parser, data) { 
	//console.log(data);
	parser.parse("foo.\r\n", 'node');
}

function createParser(grammar) {
	var parser = PEG.buildParser(grammar, { cache: true, trackLineAndColumn: true });
	fs.readFile(skillFile, 'utf-8', function(err,data) {
		parseSkillFile(parser, data);
	});
}

