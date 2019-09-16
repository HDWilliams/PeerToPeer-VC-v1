//require necessary modules and set port
var PORT = process.env.PORT || 5000;

var express = require('express');
var http = require('http');

var Mongo = require('mongodb');
var URI = process.env.MONGODB_URI

