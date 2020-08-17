const express      = require('express');
const router       = express.Router();
const mongoose     = require('mongoose');
const fetch        = require('node-fetch');
const CONFIG       = '../config.json';

const apiUrl = 'https://api.harvardartmuseums.org';
const apiKey = 'apikey=db4d74f0-6953-11ea-b605-f763cea6cc5b';

// All exhibitions
router.get('/', function(req, res, next) {
    fetch(`${apiUrl}/exhibition?venue=HAM&${apiKey}`)
    .then(html => html.json())
    .then(json => {
      res.json(json
        .records
        .map(each => ({
          id       : each.id,
          name     : each.name
        }))
    )})
    .catch(() => {
      res.status(500)
      .json({success: false})
    });
  });

// Future Exhibitions
router.get('/exhibition', function(req, res, next) {
    const currDate = new Date().toISOString().slice(0,10); 

    fetch(`${apiUrl}/exhibition?after=${currDate}&venue=HAM&${apiKey}`)
    .then(html => html.json())
    .then(futureExhibition => res.json(futureExhibition))
      .catch(() => {
        res.status(500)
        .json({success: false})
      });
});

  
module.exports = router;