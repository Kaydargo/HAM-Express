const express      = require('express');
const router       = express.Router();
const mongoose     = require('mongoose');
const fetch        = require('node-fetch');
const CONFIG       = '../config.json';

const apiUrl = 'https://api.harvardartmuseums.org';
const apiKey = 'apikey=db4d74f0-6953-11ea-b605-f763cea6cc5b';

function galleryFormat(json) {
  return {
    id          : json.id,
    title       : json.title,
    image       : json.primaryimageurl,
    theme       : json.theme,
    description : json.labeltext
  }
};

// All centuries - Years
router.get('/', function(req, res, next) {
    fetch(`${apiUrl}/century?${apiKey}`)
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

// Century theme and informtion
router.get('/:id', function(req, res, next) {
  let id= req.params.id;
  fetch(`${apiUrl}/century/${id}?${apiKey}`)
    .then(html => html.json())
    .then(century => res.json(century))
      .catch(() => {
        res.status(500)
        .json({success: false})
      });
});

router.get('/gallery/:id', function(req, res, next) {
  let groupid= req.params.id;
  fetch(`${apiUrl}/object?group=${groupid}&${apiKey}`)
  .then(html => html.json())
  .then(json => {
    res.json(json
      .records
      .map(each => (
        galleryFormat(each)
      ))
    );
  })
  .catch(() => {
    res.status(500)
    .json({success: false})
  });
});
  
module.exports = router;