"use strict"
var parsing = require('../src/parsing');


describe("the lexer", function() {
	var lexer;

	beforeEach(function() {
		lexer = new parsing.Lexer();	
	})

	it("understands unquoted skill names", function() {
		var tokens = lexer.tokenize("firearms running");
		var expected = [
			{
				content: "firearms",
				type: "skill",
				position: 0
			},
			{
				content: "running", 
				type: "skill",
				position: 9
			}
		];
		expect(tokens).toEqual(expected);
	});

	it("should understand quote-wrapped skill names", function() {
		var tokens = lexer.tokenize("'library use'");

		var expected = [
			{
				content: "library use",
				type: "skill",
				position: 0
			}
		];
		expect(tokens).toEqual(expected);
	});

	it("should understand escaped quotes in quote-wrapped skill names", function() {
		var input = "'England\'s pride'";
		var tokens = lexer.tokenize(input);
		var expected = [
			{
				content: "England\'s pride",
				type: "skill",
				position: 0
			}
		];
		expect(tokens).toEqual(expected);
	});

	it("should understand multiple quoted names", function() {
		var input = "'first' 'second'";
		var tokens = lexer.tokenize(input);
		var expected = [
			{
				content: "first",
				type: "skill",
				position: 0
			},
			{
				content: "second",
				type: "skill",
				position: 8
			}
		];
		expect(tokens).toEqual(expected);
	});
});

// describe("the parser", function() {

// 	var parser;
// 	beforeEach(function() {
// 		parser = new parsing.Parser();
// 	});

// 	it("should return an empty graph for no input", function() {
// 		var graph = parser.parse([]);
// 		expect(graph).toEqual({
// 			nodes: [],
// 			edges: []
// 		});
// 	});
// });