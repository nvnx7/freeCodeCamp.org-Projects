'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var dns = require('dns');
var cors = require('cors');
var shortid = require('shortid');

var app = express();

// Basic Configuration
var port = process.env.PORT || 3000;

/** this project needs a db !! **/
mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use( bodyParser.urlencoded({extended: false}));

app.use('/public', express.static(process.cwd() + '/public'));

const shortUrlSchema = mongoose.Schema({
  original_url: {type: String, required: true},
  short_url: {type: String}
});

const ShortUrl = mongoose.model('ShortUrl', shortUrlSchema);

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});


// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

//url shortner api endpoint
app.post("/api/shorturl", (req, res) => {
  var urlString = req.body.url;
  var isValid = true;
  var url;

  try {
    url = new URL(urlString);
    isValid = true;
  } catch(_) {
    isValid = false;
  }

  if (!isValid) {
    res.json({error: "invalid url"});
  } else {
    dns.lookup(url.hostname, (err, data) => {
      if (err) {
        res.json({error: "invalid url"});
      } else {
          ShortUrl.findOne({original_url: urlString}, (err, data) => {
          if (err) res.send(err);

          if(data) {
            res.json({original_url: data.original_url, short_url:data.short_url});
          } else {
            const short_url = shortid.generate();

            var newShortUrl = new ShortUrl({
              original_url: urlString,
              short_url: short_url
            });

            newShortUrl
            .save()
            .then((data) => {
              res.json({original_url: data.original_url, short_url:data.short_url});
            });
          }
        });
      }
    });
  }
});

app.get("/api/shorturl/:shorturl", (req, res) => {
  ShortUrl.findOne({short_url: req.params.shorturl}, (err, data) => {
    if (err) res.send(err);
    res.redirect(data.original_url);
  });
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});
