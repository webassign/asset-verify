exports.testNamespace = function(test){
	var sandbox = require('nodeunit').utils.sandbox,
		context = {
			External: {},
			window: {},
			document: {}
		},
		before = {
			External: {},
			window: {},
			document: {}
		};

	console.log('test');

	// run the code
	sandbox('astro/js/retrograde_motion.js', context);

	// remove the publisher namespace
	delete context.External.CAA;

	// make sure that context is unaltered
	test.deepEqual(context, before, "context should be unaltered");
	test.done();
};