"use strict";
(function(parsing){
    var canto34 = require('canto34');

	parsing.Parser = function(tokens) {
    	canto34.Parser.call(this);
		this.initialize(tokens);
		this.result = {
			nodes: [],
			edges: []
		};
	};

	parsing.Parser.prototype = new canto34.Parser();

	parsing.Parser.prototype._addSkill = function(skillName) {
		var skill = { 
			name:skillName
		};
		this.result.nodes.push(skill);
		return skill;
	};

	parsing.Parser.prototype.skill = function() {
		if (this.la1("skill")) {
			var skillName = this.match("skill").content;
			var skill = this._addSkill(skillName);
			var starred = false;
			if (this.la1("star")) {
				this.match("star");
				skill.starred = true;
			}
			if (this.la1("colon")) {
				this.match("colon");
				var done = false;
				while(!done) {
					var secondarySkillName = this.match("skill").content;
					var distance = this.match("integer").content;
					var secondarySkill = this._addSkill(secondarySkillName);
					var edge = {
						source: skill.name,
						destination: secondarySkill.name,
						distance: distance
					};
					this.result.edges.push(edge);

					if (this.la1("comma")) {
						this.match("comma");
					} else {
						done = true;
					}
				}
			}
			this.match("period");
		}
		return this.result;
	};

	parsing.Parser.prototype.skillList = function() {
		while(!this.eof() && this.la1("skill")) {
			this.skill();
		}
		return this.result;
	};

	parsing.Lexer = function() {
		canto34.Lexer.call(this);
		
		this.addTokenType({
			name: "line comment",
			regexp: /^\#.*?\r\n/,
			ignore: true
		});

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
			interpret: function(content) {
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
			name: "star",
			regexp: /^\*/
		});

		this.addTokenType({
			name: "comma",
			regexp: /^,/
		});

		this.addTokenType({
			name: "colon",
			regexp: /^:/
		});
    };

	parsing.Lexer.prototype = new canto34.Lexer();

})(typeof exports === 'undefined'? this['parsing']={}: exports);
