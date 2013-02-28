"use strict"
var parsing = require('../src/parsing');
var canto34 = require('../../Canto34/src/canto34');

describe("the lexer", function() {
	var lexer;

	beforeEach(function() {
		lexer = new parsing.Lexer();	
		this.addMatchers(canto34.Jasmine.matchers);
	});
 
	it("understands unquoted skill names", function() {
		var tokens = lexer.tokenize("firearms running");
		expect(tokens).toHaveTokenTypes(["skill", "skill"]);
		expect(tokens).toHaveTokenContent(["firearms", "running"]);
	});

	it("should understand quote-wrapped skill names", function() {
		var tokens = lexer.tokenize("'library use'");
		expect(tokens).toHaveTokenTypes(["skill"]);
		expect(tokens).toHaveTokenContent(["library use"]);
	});

	it("should understand escaped quotes in quote-wrapped skill names", function() {
		var input = "'England\\'s pride'";
		var tokens = lexer.tokenize(input);
		expect(tokens).toHaveTokenTypes(["skill"]);
		expect(tokens).toHaveTokenContent(["England\\'s pride"]);
	});

	it("should understand multiple quoted names", function() {
		var input = "'first' 'second'";
		var tokens = lexer.tokenize(input);
		expect(tokens).toHaveTokenTypes(["skill", "skill"]);
		expect(tokens).toHaveTokenContent(["first", "second"]);		
	});

	it("should understand integers", function() {
		var input = "-123 456";
		var tokens = lexer.tokenize(input);
		expect(tokens).toHaveTokenTypes(["integer", "integer"]);
		expect(tokens).toHaveTokenContent([-123, 456]);
	});

	it("should understand full stops and colons", function() {
		var input = ".:";
		var tokens = lexer.tokenize(input);
		expect(tokens).toHaveTokenTypes(["period", "colon"]);
	});

	it("should treat newlines as whitespace", function() {
		var input = "  \r\n  ";
		var tokens = lexer.tokenize(input);
		expect(tokens).toEqual([]);
	});

	it("should recognise all tokens in a complete sentence", function() {
		var input = "firearms. running: 'foot injury' 7."
		var tokens = lexer.tokenize(input);
		expect(tokens).toHaveTokenTypes(["skill", "period", "skill", "colon", "skill", "integer", "period"])
	});

});

describe("the parser", function() {

	
	it("should return an empty graph for no input", function() {
		var parser = new parsing.Parser([]);
		var graph = parser.parse();
		expect(graph).toEqual({
			nodes: [],
			edges: []
		});
	});

	it("should parse discrete skill names", function() {
		var input = "running.";
		var tokens = new parsing.Lexer().tokenize(input);
		var parser = new parsing.Parser(tokens);
		var graph = parser.skill();
		expect(graph).toEqual({
			nodes: [ { name:"running"} ],
			edges: []
		});
	});
});