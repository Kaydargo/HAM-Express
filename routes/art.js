const express      = require('express');
const router       = express.Router();
const mongoose     = require('mongoose');
const fetch        = require('node-fetch');
const Art          = require('../model/Art');
const AUTH         = require('../lib/auth.middleware');
const artInfo      = '_id name year description image';
const CONFIG       = '../config.json';

// const uploading = multer({
//   dest: __dirname + '../public/uploads/',
// })

const apiUrl = 'https://api.harvardartmuseums.org';
const apiKey = 'apikey=db4d74f0-6953-11ea-b605-f763cea6cc5b';


function artworkFormat(json) {
  return {
    id             : json.objectid,
    title          : json.title,
    year           : json.dated,
    image          : json.primaryimageurl,
    culture        : json.culture,
    description    : json.labeltext,
    classification : json.classification,
    period         : json.period,
    creator        : json.people
  }
};

function galleryFormat(json) {
  return {
    id          : json.id,
    title       : json.title,
    image       : json.primaryimageurl,
    theme       : json.theme,
    description : json.labeltext
  }
};

/* GET all gallery information */
router.get('/gallery', function(req, res, next) {
    fetch(`https://api.harvardartmuseums.org/gallery`, config.params)
    .then(html => html.json())
    .then(json => {
      res.json(json
        .records
        .map(each => (
          galleryFormat(each)
        ))
      );
    });
});

// Gets all art
router.get('/all', (req, res) =>{
  return Art
  .find({}) //Find everything - returns a promise
  .select(artInfo)
  .then(artworks => res.json(artworks)) //encodes response as json
  .catch(() => {
    res.status(500)
    .json({success: false})
  });
});

// Gets specific art
// GET /art/:id
router.get('/:id([0-9a-f]{24})', (req, res) => {
  return Art
  .findOne({_id: req.params.id})
  .select(artInfo)
  .then(art => res.json(art)) //encodes response as json
  .catch(() => {
    res.status(500)
    .json({success: false})
  });
});


//  GET art gallery
// art/gallery/:id
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

// GET singular artwork
// /art/:id
router.get('/:id', function(req, res, next) {
  let id= req.params.id;
  fetch(`${apiUrl}/object/${id}?${apiKey}`)
  .then(html => html.json())
  .then(gallery => res.json(gallery))
  .catch(() => {
    res.status(500)
    .json({success: false})
  });
});

// ROUTES ONLY ACCESSIBLE BY LOGGED IN USER


// Deletes a movie by id passed
router.delete('/:id([0-9a-f]{24})', AUTH.checkUserLoggedIn, (req, res) =>{
  return Art
  .findByIdAndDelete(req.params.id)
  .then(() => res.json({success : true})) //encodes response as json
  .catch(() => {
    res.status(500)
    .json({success: false})
  });
});

// Creates art 
router.post('/', AUTH.checkUserLoggedIn, (req, res) => {
  new Art({
    name           : req.body.name,
    year           : req.body.year,
    theme          : req.body.theme,
    // image          : req.body.image
    description    : req.body.description,
    classification : req.body.classification,
  })
  .save()
  .then(art => res.json(art))
  .catch(() => {
    res.status(500)
    .json({success: false})
  });
});

// Update art
router.put('/', AUTH.checkUserLoggedIn, (req, res) =>{
  return Art
  .findOneAndUpdate(
    {_id: req.body._id},
    {$set : {
      name           : req.body.name,
      year           : req.body.year,
      // image          : req.body.image,
      description    : req.body.description
    }},
    {new: true}   // Shows updated document version
    )
    .select(artInfo)
    .then(art => res.json(art))
    .catch(() => {
      res.status(500)
      .json({success: false})
    });
});

// Favorite art
router.post('/', AUTH.checkUserLoggedIn,(req, res) =>{
  return Art
  .findOneAndUpdate(
    {_id: req.body._id},
    {$push : {
      favourite : req.body.favourite // going to change from 0 - 1
    }},
    {new: true}   // Shows updated document version
    )
    .select(artInfo)
    .then(art => res.json(art))
    .catch(() => {
      res.status(500)
      .json({success: false})
    });
});

// Catches all routes not defined and sends error
// app.get('*', function(req, res, next) {
//   let err = new Error('Page Not Found');
//   err.statusCode = 404;
//   next(err);
// });


  module.exports = router;