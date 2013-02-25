var fs = require('fs');
var PEG = require('pegjs');
var path = require('path');

var grammarFile = "skilllist.grammar";
var skillFile = "../examples/modern-combat/skills.txt";

fs.readFile(grammarFile, 'utf-8', readGrammarFile);

function readGrammarFile(err, data) {
	grammarContent = data;
	createParser(data);
}

function parseSkillFile(parser, data) { 
	var result = parser.parse(data, 'node');
	console.log("parsed");
	console.log(JSON.stringify(result, null, 2));
}

function logSyntaxError(filePath, e) {
	var fileName = path.basename(filePath);
	var message = fileName + ":" + e.line + ":" + e.column + ": " + e.message;
	console.log(message);
}

function createParser(grammar) {
	var parserOptions = { 
		cache: true, 
		trackLineAndColumn: true 
	};
	var parser = PEG.buildParser(grammar, parserOptions);
	fs.readFile(skillFile, 'utf-8', function(err,data) {
		
		var BOM = '\uFEFF';
		if (data.substring(0,BOM.length).indexOf(BOM) != -1) {
			//console.log("stripping BOM");
			data = data.substring(BOM.length);
		}
		
		console.log(data.substring(0, 80)
			.replace(/\r/g, '\\r')
			.replace(/\t/g, '\\t')
			.replace(/\n/g, '\\n')
			)

		//console.log(data);
		try {
			parseSkillFile(parser, data);
		} catch (e) {
			logSyntaxError(skillFile, e);
		}
	});
}
