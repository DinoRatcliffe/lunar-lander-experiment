var assert = require("chai")

done = function(err, res) { 
	console.log(err);
	console.log(res);
	[err, res]; };

usermodel = require('../app/api/user/user.model');
//TODO consider importing es refresh to see if that fixes db import issue.

describe('User', function() {
	it('should specify incorrect user when empty JSON providered in create function', function(finishtest) {
		user = {}
		userWithProvider = {}

		createDone = function(err, res) {
			done();
			assert.expect(res).to.not.exist;
			assert.expect(err).to.exist;
			finishtest();
		}

		removeDone = function(err, res) {
			usermodel.create(userWithProvider, createDone);
		}
		usermodel.removeAll(done, removeDone);
	});

	it('should be creatable in elasticsearch', function(finishtest) {
		user = {"username":"pulfordk","email":"johnpulford@gmail.com","keepSignedIn":false,"pretty_name":"PulfordK","password": "public123" ,"decks":[],"stared_decks":[]}
		userWithProvider = {provider: "deckard", "user": user}

		createDone = function(err, res) {
			assert.expect(JSON.stringify(res)).to.equal(JSON.stringify({ 
				username: 'pulfordk',
				email: 'johnpulford@gmail.com',
				keepSignedIn: false,
				pretty_name: 'PulfordK',
				decks: [],
				"stared_decks": [],
				id : res.id,
			}));
			finishtest();
		}

		removeDone = function(err, res) {
			usermodel.create(userWithProvider, createDone);
		}
		usermodel.removeAll(done, removeDone);
	});

	it('should have a valid password reset key if date is within the last hour', function() {
		today = new Date();
		assert.expect(usermodel.timeValid(today.toJSON())).to.equal(true);
	});

	it('should not have a valid password reset key if date is outside of the last hour', function() {
		today = new Date();
		invalidDate = new Date(today.getTime());
		invalidDate.setHours(today.getHours + 3);
		assert.expect(usermodel.timeValid(invalidDate.toJSON())).to.equal(false);
	});

	it('should be able to get user from username', function(finishtest) {
		user = {"username":"pulfordk","email":"johnpulford@gmail.com","keepSignedIn":false,"pretty_name":"PulfordK","password": "public123" ,"decks":[],"stared_decks":[]}
		userWithProvider = {provider: "deckard", "user": user}

		getByUsernameDone = function(err, res) {
			assert.expect(res).to.exist;
			//auth_token details random, not worth testing.
			delete res.authentication[0].auth_token
				assert.expect(JSON.stringify(res)).to.equal(JSON.stringify({ 
					username: 'pulfordk',
					email: 'johnpulford@gmail.com',
					keepSignedIn: false,
					pretty_name: 'PulfordK',
					decks: [],
					"stared_decks": [],
					authentication: [
					{provider : "deckard"}],
					id : res.id,
				}));
			finishtest();
		}

		createDone = function(err, res) {
			setTimeout(function() {
				usermodel.getByUsername(res.username, getByUsernameDone);
			}, 1500);
		}

		removeDone = function(err, res) {
			usermodel.create(userWithProvider, createDone);
		}
		usermodel.removeAll(done, removeDone);
	});

	it('should be able to reset their passwords', function(finishtest) {
		this.timeout(8000);
		user = {"username":"pulfordk","email":"johnpulford@gmail.com","keepSignedIn":false,"pretty_name":"PulfordK","password": "public123" ,"decks":[],"stared_decks":[]}
		userWithProvider = {provider: "deckard", "user": user}

		userFromGetEmailDone = null;

		resetPasswordDone = function(err, res) {
			setTimeout(function() {
				done(err, res);
				assert.expect(err).to.not.exist;
				authJSON = {"user" : {username : "pulfordk", password : "public124"}, provider : "deckard"};
				usermodel.authenticate(authJSON, function(err, res) {
					done(err, res);
					assert.expect(err).to.not.exist;
					assert.expect(JSON.stringify(res)).to.equal(JSON.stringify({ 
						username: 'pulfordk',
						email: 'johnpulford@gmail.com',
						keepSignedIn: false,
						pretty_name: 'PulfordK',
						decks: [],
						"stared_decks": [],
						id : res.id,
					}));
					finishtest();
				})
			}, 1500);
		}

		getByEmailDone = function(err, res) {
			userFromGetEmailDone = res;
			assert.expect(res).to.exist;
			resetKey = res.password_reset_key.key;
			usermodel.resetPassword(res.username, resetKey, "public124", resetPasswordDone);
		}

		forgotPasswordDone = function(err, res) {
			usermodel.getByEmail(res.accepted[0], getByEmailDone);
		}

		createDone = function(err, res) {
			//console.log(res.username, res.email, forgotPasswordDone);
			setTimeout(function() {
				usermodel.forgotPassword(res.username, res.email, forgotPasswordDone);
			}, 1500);
		}

		removeDone = function(err, res) {
			usermodel.create(userWithProvider, createDone);
		}
		usermodel.removeAll(done, removeDone);
	});

	var request = require('request');
	it('who am I API', function(finishtest) {
		url = "http://localhost:8080/whoami";
		user = {"username":"pulfordk","email":"johnpulford@gmail.com","keepSignedIn":false,"pretty_name":"PulfordK","password": "public123" ,"decks":[],"stared_decks":[]}
		userWithProvider = {provider: "deckard", "user": user}

		createDone = function(err, res) {
			request.get({url: url, json: true}, function (err, resp, body) {
				assert.expect(JSON.stringify(res)).to.equal(JSON.stringify({ 
					username: 'pulfordk',
					email: 'johnpulford@gmail.com',
					keepSignedIn: false,
					pretty_name: 'PulfordK',
					decks: [],
					"stared_decks": [],
					id : res.id,
				}));
				finishtest();
			});
		}

		removeDone = function(err, res) {
			usermodel.create(userWithProvider, createDone);
		}
		usermodel.removeAll(done, removeDone);
	});

	/*
	it('reset password API', function(finishtest) {
		this.timeout(8000);
		url = "http://localhost:8080/password/reset";
		user = {"username":"pulfordk","email":"johnpulford@gmail.com","keepSignedIn":false,"pretty_name":"PulfordK","password": "public123" ,"decks":[],"stared_decks":[]}
		userWithProvider = {provider: "deckard", "user": user}

		userFromGetEmailDone = null;

		resetPasswordDone = function(err, res) {
			setTimeout(function() {
				done(err, res);
				assert.expect(err).to.not.exist;
				authJSON = {"user" : {username : "pulfordk", password : "public124"}, provider : "deckard"};
				usermodel.authenticate(authJSON, function(err, res) {
					done(err, res);
					assert.expect(err).to.not.exist;
					assert.expect(JSON.stringify(res)).to.equal(JSON.stringify({ 
						username: 'pulfordk',
						email: 'johnpulford@gmail.com',
						keepSignedIn: false,
						pretty_name: 'PulfordK',
						decks: [],
						"stared_decks": [],
						id : res.id,
					}));
					finishtest();
				})
			}, 1500);
		}

		getByEmailDone = function(err, res) {
			assert.expect(res).to.exist;
			//usermodel.resetPassword(res.username, resetKey, "public124", resetPasswordDone);
			request.post({url: url, json: true}, function (err, resp, body) {
				done(err, resp);
				assert.expect(resp).to.be.ok;
			//delete resp.authentication;
			//delete resp.password_reset_key;
				assert.expect(JSON.stringify(resp)).to.equal(JSON.stringify({ 
					username: 'pulfordk',
					email: 'johnpulford@gmail.com',
					keepSignedIn: false,
					pretty_name: 'PulfordK',
					decks: [],
					"stared_decks": [],
					id : res.id,
				}));
				finishtest();
			});
		}

		forgotPasswordDone = function(err, res) {
			usermodel.getByEmail(res.accepted[0], getByEmailDone);
		}

		createDone = function(err, res) {
			//console.log(res.username, res.email, forgotPasswordDone);
			setTimeout(function() {
				usermodel.forgotPassword(res.username, res.email, forgotPasswordDone);
			}, 1500);
		}

		removeDone = function(err, res) {
			usermodel.create(userWithProvider, createDone);
		}
		usermodel.removeAll(done, removeDone);
	});
	*/
});
