'use strict';
// =========================================================================
//
// Routes for tasks
//
// =========================================================================
var policy     = require ('../policies/task.policy');
var controller = require ('../controllers/task.controller');

module.exports = function (app) {
	//
	// collection routes
	//
	app.route ('/api/task').all (policy.isAllowed)
		.get  (controller.list)
		.post (controller.create);
	//
	// model routes
	//
	app.route ('/api/task/:taskId').all (policy.isAllowed)
		.get    (controller.read)
		.put    (controller.update)
		.delete (controller.delete);
	app.route ('/api/new/task').all (policy.isAllowed)
		.get (controller.new);
	//
	// middleware to auto-fetch parameter
	//
	app.param ('taskId', controller.byId);
};

