const express      = require('express');
const router       = express.Router();
const mongoose     = require('mongoose');
const fetch        = require('node-fetch');
const CONFIG       = '../config.json';

const apiUrl = 'https://api.harvardartmuseums.org';
const apiKey = 'apikey=db4d74f0-6953-11ea-b605-f763cea6cc5b';

function apiArtFormat(json) {
  return {
    id          : json.id,
    name        : json.name,
    theme       : json.theme,
    description : json.labeltext
  }
};


router.get('/gallery', function(req, res, next) {
    fetch(`${apiUrl}/gallery?${apiKey}`, )
    .then(html => html.json())
    .then(json => {
      res.json(json
        .records
        .map(each => (
          apiArtFormat(each)
        ))
      );
    })
    .catch(() => {
        res.status(500)
        .json({success: false})
      });
});

// Get floors 
router.get('/floor1', function(req, res, next) {
    fetch(`${apiUrl}/gallery?floor=1&${apiKey}`)
    .then(html => html.json())
    .then(json => {
      res.json(json
        .records
        .map(each => (
          apiArtFormat(each)
        ))
      );
    })
});

router.get('/floor2', function(req, res, next) {
    fetch(`${apiUrl}/gallery?floor=2&${apiKey}`)
    .then(html => html.json())
    .then(json => {
      res.json(json
        .records
        .map(each => (
          apiArtFormat(each)
        ))
      );
    })
    .catch(() => {
      res.status(500)
      .json({success: false})
    });
});

router.get('/floor3', function(req, res, next) {
    fetch(`${apiUrl}/gallery?floor=3&${apiKey}`)
    .then(html => html.json())
    .then(json => {
      res.json(json
        .records
        .map(each => (
          apiArtFormat(each)
        ))
      );
    })
    .catch(() => {
      res.status(500)
      .json({success: false})
    });
});

router.get('/:id', function(req, res, next) {
  let id = req.params.id;
  fetch(`${apiUrl}/gallery/${id}?${apiKey}`)
  .then(html => html.json())
  .then(gallery => res.json(gallery))
});

module.exports = router;