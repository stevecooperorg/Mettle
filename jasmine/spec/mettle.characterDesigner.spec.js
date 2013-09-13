describe("mettle.characterDesigner", function() {

	it("exists", function() {
		expect(mettle.characterDesigner).toBeDefined();
	});

	it("can translate simple data", function() {
		var sourceData = {
			skills: [
				{ name: "foo" },
				{ name: "bar" }
			], links: [
				{ source: "foo", destination: "bar", strength: 10 }
			]
		};

		var viz = new mettle.characterDesigner();
		var translated = viz.translateData(sourceData, 'name', 'source', 'destination');

		var fooNode = { name: "foo" };
		var barNode = { name: "bar" };

		expect(translated).toEqual({ 
			skills: [ fooNode, barNode ],
			links: [ { source:fooNode, target:barNode, strength:10}]
		})

	});
})