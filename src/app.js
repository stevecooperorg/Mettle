var fs = require('fs');
var PEG = require("pegjs");

var grammarFile = "skillgrammar.txt";
var skillFile = "../examples/modern-combat/skills.txt";

function createParser(grammar) {
	var parser = PEG.buildParser(grammar, { cache: true, trackLineAndColumn: true });
	fs.readFile(skillFile, 'utf-8', readSkillFile);
}

function readGrammarFile(err, data) {
	grammarContent = data;
	createParser(data)
}

function readSkillFile(err, data) {
	console.log(data);
}

fs.readFile(grammarFile, 'utf-8', readGrammarFile);

// fs.readFile('../examples/modern-combat/skills.txt', 'utf-8', function(err, data) {
// 	console.log(data);
// });