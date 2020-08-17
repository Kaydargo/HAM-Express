const express      = require('express');
const router       = express.Router();
const User         = require('../model/User');
const AUTH         = require('../lib/auth.middleware');


//POST user - /user/ - REGISTER
router.post('/', (req, res) =>{
    const user = new User ({
        username : req.body.username
    });

    user
    .setPassword(req.body.password)
    .then(() => user.save()) // saves local object to database as document
    .then(() => res.json({success : true}))
    .catch(() => res
        .status(500)
        .json({success : false})
    );
});

//POST - /user/login
router.post('/login', (req, res) => {

    return User
      .findOne({username: req.body.username})
      .then (user => user.authenticate(req.body.password))
      .then (auth => {
        if (auth.user !== false) {
          req.session.user = auth.user.id
        }
        res.json({success: auth.user !== false})
      })
      .catch(() => res
        .status(500)
        .json({success: false})
      );
  });

router.get('/profile', AUTH.checkUserLoggedIn, async (req, res) => {
    try {
        const user = await User
            .findOne({ _id: req.session.user });
        return res.json(user);
    }
    catch (e) {
        return res.status(500)
            .json({ success: false });
    }
});

// Update userprofile
router.put('/', AUTH.checkUserLoggedIn, (req, res) =>{

    User
        .findOne({ _id: req.session.user })
        .then(function(user) {
            if (!user) {
                return res.sendStatus(401); 
            }
            if (req.body.username !== 'undefined') {
                user.username = req.body.username;
                
            }
            if (req.body.password !== 'undefined') {
                user.setPassword(req.body.password);
            }
        return user.save().then(() => res.json({success : true}))
    })
    .catch(()=>{
        return res.status(500).json({ success: false });
    });
});

// Logout
router.get('/logout', AUTH.checkUserLoggedIn, (req, res) => {
    res.status(200)
    .clearCookie('connect.sid', {path: '/'})
    .json({status: "Success"})
});

// Catches all routes not defined and sends error
// app.get('*', function(req, res, next) {
//     let err = new Error('Page Not Found');
//     err.statusCode = 404;
//     next(err);
// });


module.exports = router;