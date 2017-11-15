'use strict';

const express = require("express")
const mjml = require("mjml")
const fetch = require("node-fetch")
const pug = require("pug")
const _ = require("lodash")

var app = express();
app.set('views', './sources/email')

app.engine('pug', function (filePath, options, callback) { // define the template engine
  var $ = pug.renderFile(filePath, options);
  var html = mjml.mjml2html($);
  if (html.errors.length > 0) {
  	return callback(html.errors, null);
  } else {
  	return callback(null, html.html);
  }
})

app.set('view engine', 'pug')

app.get('/email/:template', function (req, res) {
	(async function () {
		let event = await fetch('http://devternity.com/js/event.js')
		let eventJson = await event.json()
		let eventPointer = eventJson[0];
		var data = {};
		_.extend(data, eventPointer)
		_.extend(data, req.query)
		res.render(req.params.template + '.pug', data)
	})();
})

app.listen(3000);