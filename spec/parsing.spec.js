"use strict"
var parsing = require('../src/parsing');
var canto34 = require('canto34');

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
	
	it("should parse starred skill names", function() {
		var input = "running*.";
		var tokens = new parsing.Lexer().tokenize(input);
		var parser = new parsing.Parser(tokens);
		var graph = parser.skill();
		expect(graph).toEqual({
			nodes: [ { name:"running", starred:true} ],
			edges: []
		});
	});

	it("should parse skill names with links", function() {
		var input = "coordination: dexterity 5, quickdraw 6, brawl 7.";
		var tokens = new parsing.Lexer().tokenize(input);
		var parser = new parsing.Parser(tokens);
		var graph = parser.skill();
		expect(graph).toEqual({
			nodes: [ 
				{ name:"coordination" },
				{ name:"dexterity" },
				{ name:"quickdraw" },
				{ name:"brawl" }
			],
			edges: [
				{ 
					source: "coordination", 
					destination:"dexterity", 
					distance: 5
				},
				{ 
					source: "coordination", 
					destination:"quickdraw", 
					distance: 6
				},
				{ 
					source: "coordination", 
					destination:"brawl", 
					distance: 7
				}
			]
		});
	});

	it("should parse a set of skills", function() {
		var input = "strength. dexterity. constitution.";
		var tokens = new parsing.Lexer().tokenize(input);
		var parser = new parsing.Parser(tokens);
		var graph = parser.skillList();
		expect(graph).toEqual({
			nodes: [ 
				{ name:"strength" },
				{ name:"dexterity" },
				{ name:"constitution" }
			],
			edges: []
		});
	});

	it("should return an empty graph for no input", function() {
		var parser = new parsing.Parser([]);
		var graph = parser.skillList();
		expect(graph).toEqual({
			nodes: [],
			edges: []
		});
	});

	if("should parse the modern combat example", function() {
		var input = "dexterity.\r\nsize.\r\nfitness.\r\n\r\n# derived stats\r\ncoordination: dexterity 5.\r\n\r\n\r\n#\r\n# Guns!\r\n#\r\nfirearms: coordination 5.\r\nhandgun: firearms 5, quickdraw 5.\r\nrifle: firearms 5.\r\nquickdraw*: coordination 5.\r\n\r\n#\r\n# Brawling\r\n#\r\nkick: brawl 8, running 2.\r\nparry: coordination 5.\r\npunch: brawl 8.\r\nbrawl: dexterity 5, fitness 5, size 5.\r\n\r\n# combat styles\r\nKarate: punch 7, kick 6, fitness 5.\r\nQueensbury rules: punch 9, fitness 8.\r\n\r\n\r\n#\r\n# Melee Weapons\r\n#\r\nmelee: size 5, fitness 5.\r\nclub: melee 5.\r\nsword: melee 5.\r\nshield: melee 5.\r\nspear: melee 5.\r\n\r\n\r\n#\r\n# running away\r\n# \r\nrunning: fitness 5.\r\nsprint: running 8.\r\ndodge: coordination 5.\r\nhorseriding: coordination 5.\r\n\r\n#\r\n# knowledge\r\n#\r\ntactics.\r\n\r\n#\r\n# Professions\r\n#\r\nknight*: sword 8, shield 4, horseriding 8, lance 7.\r\nswat team*: rifle 9, brawl 6, tactics 6.\r\nprofessional boxer*: Queensbury rules 10.\r\ncowboy*: quickdraw 9, horseriding 7, handgun 5.";
		var tokens = new parsing.Lexer().tokenize(input);
		var parser = new parsing.Parser(tokens);
		parser.skillList();
	});
});
