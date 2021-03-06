'use strict';

var express = require('express');
var passport = require('../passport');
var utils = require('../utils');
var route = module.exports = express.Router();

//google

route.get('/:ul(ru)?/login', function(req, res) {
	res.locals.title = res.locals.__('login');
	res.locals.site.title = res.locals.title + ' | ' + res.locals.site.title;
	res.locals.redirectUrl = req.query.redirectUrl || req.query.redirect || '/';
	res.cookie('loginurl', res.locals.redirectUrl, { maxAge: 1000 * 60 * 10 });
	res.render('login');
});

function privateCache(req, res, next) {
	utils.maxage(res, 0);
	next();
}

// GET /auth/google
route.get('/auth/google', privateCache,
	passport.authenticate('google', { scope: ['profile', 'email'] }));

// GET /auth/google/callback
route.get('/auth/google/callback', privateCache,
	passport.authenticate('google', {
		failureRedirect: '/login'
	}),
	function(req, res) {
		res.redirect(req.cookies.loginurl || '/');
	});

// GET /auth/facebook
route.get('/auth/facebook', privateCache,
	passport.authenticate('facebook', {
		scope: ['public_profile', 'email']
	}));

// GET /auth/facebook/callback
route.get('/auth/facebook/callback', privateCache,
	passport.authenticate('facebook', {
		failureRedirect: '/login'
	}),
	function(req, res) {
		res.redirect(req.cookies.loginurl || '/');
	});

// GET /auth/github
route.get('/auth/github', privateCache,
	passport.authenticate('github', {
		scope: ['user:email']
	}));

// GET /auth/github/callback
route.get('/auth/github/callback', privateCache,
	passport.authenticate('github', {
		failureRedirect: '/login'
	}),
	function(req, res) {
		res.redirect('/');
	});

route.get('/:ul(ru)?/logout', privateCache, function(req, res) {
	req.logout();
	res.redirect('/');
});
