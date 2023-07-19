var express = require('express');
const Advice = require('../models/advice')
var router = express.Router();
const { check, validationResult } = require('express-validator')

/* GET home page. */
router.get('/', function(req, res, next) {
  Advice.find().sort({createdAt : -1})
  .then(allAdvice => {
    res.render('index', { title: 'Express' , allAdvice : allAdvice});
  })
  
});

/* GET Add Advice page. */
router.get('/new', function(req, res, next) {
  res.render('addAdvice', { title: 'Add your Advice' });
});


router.post('/new' , [
  // validation

  check('advice' , 'Your advice must be less that 120 letter')
  .isLength({max : 120})

], function(req, res){
 const errors = validationResult(req)

 const author = req.body.author;
 const advice = req.body.advice;

  if(errors.isEmpty()){

    const newAdvice = new Advice({
      author : author,
      advice : advice
    })
  
    newAdvice.save()
    .then((article) => {
      res.redirect('/')
    })
  } else {
    res.status(400).json({
      "Message" : "BAD request baby"
    })
  }

})

router.post('/advice/:adviceId/like', async (req, res) => {
  try {
    const { adviceId } = req.params;
    const likedCookie = req.cookies[`liked_${adviceId}`];

    // Check if the user has already liked the advice (based on the cookie)
    if (likedCookie) {
      return res.status(400).json({ error: 'You have already liked this advice' });
    }

    // Update the advice with the new like
    const advice = await Advice.findById(adviceId);
    advice.likes += 1;
    await advice.save();

    // Set a cookie to remember the user's like
    res.cookie(`liked_${adviceId}`, true, { maxAge: 30 * 24 * 60 * 60 * 1000 }); // Expires in 30 days

    return res.status(200).json({ message: 'Advice liked successfully' });
  } catch (err) {
    console.error('Error liking advice:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports = router;
