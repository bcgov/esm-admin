'use strict';
var _ = require ('lodash');
var mongoose      = require('mongoose');
var ArtifactType         = mongoose.model('ArtifactType');
var ActivityBase         = mongoose.model('ActivityBase');
var MilestoneBase         = mongoose.model('MilestoneBase');
var Template         = mongoose.model('Template');
var list     = require ('./artifactslist');
var promise = require('promise');
var util = require('util');

module.exports = function () {
	//
	// write and replace
	//
	var total = 0;
	var count = 0;
	promise.all (list.activitybases.map (function (activity) {
		console.log ('removing activity base ',activity.code);
		return ActivityBase.remove ({code:activity.code});
	}))
	.then (function () {
		return promise.all (list.activitybases.map (function (activity) {
			console.log ('adding activity base ',activity.code);
			var a = new ActivityBase (activity);
			return a.save ();
		}));
	})
	.then (function () {
		return promise.all (list.milestonebases.map (function (milestone) {
			console.log ('adding milestone base ',milestone.code);
			var a = new MilestoneBase (milestone);
			return a.save ();
		}));
	})
	.then (function () {
		return Template.remove ();
	})
	.then (function () {
		return promise.all (list.templates.map (function (template) {
			console.log ('adding template ',template.documentType);
			var a = new Template (template);
			return a.save ();
		}));
	})
	.then (function () {
		return promise.all (list.artifacttypes.map (function (artifacttype) {
			artifacttype.multiple = false;
			artifacttype.isTemplate = true;
			artifacttype.stages = list.stages;
			Template.findOne ({documentType:artifacttype.type}).exec()
			.then (function (template) {
				if (!_.isEmpty(template)) {
					artifacttype.isTemplate = true;
					artifacttype.isDocument = false;
				} else {
					artifacttype.isTemplate = false;
					artifacttype.isDocument = true;
				}
				console.log ('adding artifacttype ',artifacttype);
				var a = new ArtifactType (artifacttype);
				return a.save ();
			});
		}));
	})
	.then (function () {
		console.log ('all done adding some artifcat types and other things');
	})
	.catch (function (err) {
		console.log ('oops, something went wrong', err);
	});

};
