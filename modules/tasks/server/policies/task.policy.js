'use strict';
// =========================================================================
//
// Policies for tasks
//
// =========================================================================
var acl  = require ('acl');
acl      = new acl (new acl.memoryBackend ());

exports.invokeRolesPolicies = function () {
	acl.allow ('admin', [
		'/api/task',
		'/api/task/:taskId',
		'/api/new/task'
		], '*'
	);
	acl.allow ('guest', [
		'/api/task',
		'/api/task/:taskId',
		'/api/new/task'
		], 'get'
	);
};

exports.isAllowed = function (req, res, next) {
	var roles = (req.user) ? req.user.roles : ['guest'];
	acl.areAnyRolesAllowed (roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
		if (err) {
			// An authorization error occurred.
			return res.status(500).send('Unexpected authorization error');
		} else {
			if (isAllowed) {
				// Access granted! Invoke next middleware
				return next();
			} else {
				return res.status(403).json({
					message: 'User is not authorized'
				});
			}
		}
	});
};


