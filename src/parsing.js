"use strict";
(function(parsing){
    var canto34 = require('../../Canto34/src/canto34');

	// parsing.Parser = function() {
	// };

	// parsing.Parser.prototype.parse = function(tokens) {
	// 	var graph = {
	// 		nodes: [],
	// 		edges: []
	// 	};

	// 	return graph;
	// }

	parsing.Lexer = function() {
		canto34.Lexer.call(this);
		this.addTokenType(canto34.StandardTokenTypes.whitespace());
		
		// skills can be names like "running"
		this.addTokenType({ 
			name: "skill", 
			regexp: /^[a-z]+/
		});

		// skills include other characters if single-quoted; like "'library
		// use'", use \' to escape single-quotes.
		this.addTokenType({ 
			name: "skill", 
			regexp: /^'(\'|[^'])+'/, 
			interpreter: function(content) {
				var insideQuotes = content.substring(1, content.length-1);
				var escapeQuotes = insideQuotes.replace("\'", "'");
				return escapeQuotes;
			} 
		});
	};

	parsing.Lexer.prototype = new canto34.Lexer();

})(typeof exports === 'undefined'? this['parsing']={}: exports);
