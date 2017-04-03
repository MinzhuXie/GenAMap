var assert = require('chai').assert;
var expect = require('chai').expect;
var backend = require('../../Scheduler/node/build/Release/scheduler.node');

// Model Options
var model_opts = {'type': 3,	// MultiPopLasso
			'options': {'lambda': 0.05, 'L2_lambda': 0.01}};
var bad_model_opts = {'type': 108,
			'options': {'lambda': 0.05, 'L2_lambda': 0.01}};

// Algorithm Options
var alg_opts = {'type': 1, 	// ProximalGradientDescent
			'options': {'tolerance': 0.01, 'learning_rate': 0.1}};
var bad_alg_opts = {'type': 10,
			'options': {'tolerance': 0.01, 'learning_rate': 0.1}};

// These are the data in Model_Tests for AdaMultiLasso.
// TODO: figure out why they are these dimensions and generate better example data.

var X = [[-0.0168,   -0.0169,   -0.0146,    0.0192,   -0.0124,   -0.0092,],
[-0.0052,    0.0243,    0.0010,   -0.0105,    0.0167,    0.0155,],
[0.0106,   0.0004,   -0.0138,    0.0228,   -0.0112,    0.0017,],
[-0.0139,   -0.0212,    0.0112,   -0.0040,   -0.0067,    0.0211]];

var Y = [[-0.0302],
[-0.0349],
[-0.0061],
[-0.0403]];

var pop = [0, 1, 2, 3];

describe('MultiPopLasso', function() {
	describe('newJob', function() {
		var id1 = backend.newJob({'algorithm_options': alg_opts, 'model_options': model_opts});
		var id2 = backend.newJob({'model_options': model_opts, 'algorithm_options': alg_opts});
		it('should return a non-negative integer for the first job ID', function () {
			assert.isAtLeast(id1, 1);
		});		
		it('should return a larger integer for the second job ID', function () {
			assert.isAtLeast(id2, id1);
		});
		
		it('should throw exception when bad options are given', function () {
			assert.throws(function() {backend.newJob(
				{'model_options': bad_model_opts, 'algorithm_options': alg_opts})},
				Error, 'Error creating model');
			assert.throws(function() {backend.newJob(
				{'algorithm_options': bad_alg_opts, 'model_options': model_opts})},
				Error, 'Error creating algorithm');
		});
	});

	describe('setX', function() {
		var job_id = backend.newJob({'model_options': model_opts, 'algorithm_options': alg_opts});
		it('should return true when correctly done', function () {
			assert.isTrue(backend.setX(job_id, X));
		});

		it('should return false for a job that has not been created', function () {
			assert.equal(false, backend.setX(-1, X));
			assert.equal(false, backend.setX(100, X));
		});
		
	});

	describe('setY', function() {
		var job_id = backend.newJob({'model_options': model_opts, 'algorithm_options': alg_opts});
		it('should return true when correctly done', function () {
			assert.isTrue(backend.setY(job_id, Y));
		});

		it('should return false for a job that has not been created', function () {
			assert.equal(false, backend.setY(-1, Y));
			assert.equal(false, backend.setY(100, Y));
		});
	});

	describe('setPopulation', function() {
		var job_id = backend.newJob({'model_options': model_opts, 'algorithm': alg_opts});
		it('should return true when correctly done', function () {
			assert.isTrue(backend.setModelAttributeMatrix(job_id, 'population', pop));
		});

		// it('should return false for a job that has not been created', function () {
		// 	assert.equal(false, backend.setModelAttributeMatrix(-1, 'population', pop));
		// 	assert.equal(false, backend.setModelAttributeMatrix(100, 'population', pop));
		// });
	});

	// describe('startJob', function() {
	// 	var job_id = backend.newJob({'model_options': model_opts, 'algorithm_options': alg_opts});

	// 	it('throw error for bad options', function () {
	// 		assert.throws(function() {backend.startJob(-1, function() {})},
	// 			Error, 'Job ID does not match any jobs.');
	// 		assert.throws(function() {backend.startJob(job_id, function() {})},
	// 			Error, 'X and Y matrices of size (0,0), and (0,0) are not compatible.');
	// 	});

	// 	it('return true for good job start', function() {
	// 		assert.isTrue(backend.setX(job_id, X));
	// 		assert.isTrue(backend.setY(job_id, Y));
	// 		assert.isTrue(backend.setModelAttributeMatrix(job_id, 'population', pop));
	// 		assert.isTrue(backend.startJob(job_id, function(results) {} ));
	// 	});

	// 	var job_id2 = backend.newJob({'model_options': model_opts, 'algorithm_options': alg_opts});
	// 	it('return true for second good job start', function() {
	// 		this.timeout(5000);	// let's see how long this job takes
	// 		assert.isTrue(backend.setX(job_id2, X));
	// 		assert.isTrue(backend.setY(job_id2, Y));
	// 		assert.isTrue(backend.setModelAttributeMatrix(job_id2, 'population', pop));
	// 		assert.isTrue(backend.startJob(job_id2, function(results) {} ));
	// 	});

	// 	// it('throw error for trying to start already running job', function() {
	// 	// 	assert.throws(function() { backend.startJob(job_id2, function() {} )},
	// 	// 		Error, 'Job is already running.');
	// 	// });
	// });


	// describe('getJobResult', function() {
	// 	this.timeout(0);	// let's see how long this job takes
	// 	var job_id = backend.newJob({'model_options': model_opts, 'algorithm_options': alg_opts});
		
	// 	it('return filled results matrix for good job run', function(done) {
	// 		assert.isTrue(backend.setX(job_id, X));
	// 		assert.isTrue(backend.setY(job_id, Y));
	// 		assert.isTrue(backend.setModelAttributeMatrix(job_id, 'population', pop));
	// 		assert.isTrue(backend.startJob(job_id, function(results) {
	// 			assert.deepEqual(backend.getJobResult(job_id), results);
	// 			done();
	// 		}));
	// 	});
	// });


	// describe('checkJob', function() {
	// 	var job_id = backend.newJob({'model_options': model_opts, 'algorithm_options': alg_opts});
	// 	it('large job progress = 0 before starting', function() {
	// 		assert.isTrue(backend.setX(job_id, X));
	// 		assert.isTrue(backend.setY(job_id, Y));
	// 		assert.isTrue(backend.setModelAttributeMatrix(job_id, 'population', pop));
	// 		assert.equal(0, backend.checkJob(job_id));
	// 	});

	// 	it('large job progress < 1 before ending and == 1 on ending', function(done) {
	// 		backend.startJob(job_id, function(results) {
	// 			assert.equal(backend.checkJob(job_id), 1);
	// 			assert.deepEqual(backend.getJobResult(job_id), results);
	// 			done();
	// 		} );
	// 		// while (backend.checkJob(job_id) == 0) {}	// wait for job to actually start
	// 		// assert.isBelow(backend.checkJob(job_id), 1, 'job progress should be less than 1 immediately after starting');
			
	// 	});
	// });
});