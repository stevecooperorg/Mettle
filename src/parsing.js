"use strict";
(function(parsing){
    var canto34 = require('../../Canto34/src/canto34');

	parsing.Parser = function(tokens) {
		canto34.Parser.call(this);
		this.initialize(tokens);
		this.result = {
			nodes: [],
			edges: []
		};
	};

	parsing.Parser.prototype = new canto34.Parser([]);

	parsing.Parser.prototype.parse = function() {
		return this.result;
	};

	parsing.Parser.prototype.skill = function() {
		if (this.la1("skill")) {
			var skillName = this.match("skill").content;
			this.match("period");
			this.result.nodes.push({ name:skillName });
		}
		return this.result;
	};

	parsing.Lexer = function() {
		canto34.Lexer.call(this);
		this.addTokenType(canto34.StandardTokenTypes.whitespaceWithNewlines());
		this.addTokenType(canto34.StandardTokenTypes.integer());
		// skills can be names like "running"
		this.addTokenType({ 
			name: "skill", 
			regexp: /^[a-z]+/
		});

		// skills include other characters if single-quoted; like "'library
		// use'", use \' to escape single-quotes.
		this.addTokenType({ 
			name: "skill", 
			regexp: /^'(\\'|[^'])+'/, 
			interpreter: function(content) {
				var insideQuotes = content.substring(1, content.length-1);
				var escapeQuotes = insideQuotes.replace("\'", "'");
				return escapeQuotes;
			} 
		});

		this.addTokenType({
			name: "period",
			regexp: /^\./
		});

		this.addTokenType({
			name: "colon",
			regexp: /^:/
		});
	};

	parsing.Lexer.prototype = new canto34.Lexer();

})(typeof exports === 'undefined'? this['parsing']={}: exports);
