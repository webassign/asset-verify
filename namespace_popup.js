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

	// get file paths
	var paths = global.WebAssign;
	for (var i in paths) {
		// run the code in a sandbox but using the same across all files
		sandbox(paths[i], context);
	}

	// remove the publisher namespace
	delete context.External.CAA;
	delete context.window.onload;

	// make sure that context is unaltered
	test.deepEqual(context, before, "context should be unaltered");
	test.done();
};