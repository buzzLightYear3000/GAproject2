// controllers/listings.js
const express = require('express')
const router = express.Router()

const Listing = require('../models/listing')

//ROUTES

//GET 

// all listinngs

router.get('/', async (req, res) => {
  try {
    const populatedListings = await Listing.find({}).populate('owner');
    res.render('listings/index.ejs', {
      listings: populatedListings,
    });
  } catch (error) {
    console.log(error);
    res.render("error.ejs");
  }
});

//new listing

router.get('/new', (req, res) => {
  try {
    res.render('listings/new.ejs');
  } catch (error) {
    console.log(error);
    console.log(error);
    //res.render("error.ejs");
  }

});

//Create new listing

router.post('/', async (req, res) => {
  try {
    req.body.owner = req.session.user._id;
    const newListing = await Listing.create(req.body);
    console.log(newListing);
    res.redirect('/'); 
  } catch (error) {
    console.log(error);
    //res.render("error.ejs");
  }
});

//show by ID
router.get('/:listingId', async (req, res) => {
  try {
    const listingId = req.params.listingId;
    const foundListing = await Listing.findById(listingId).populate('owner');;
    res.render('listings/show.ejs', { listing: foundListing });
  } catch (error) {
    console.log(error);
    res.render("error.ejs");
  }
});

// ID + delete

router.delete('/:listingId', async (req, res) => {
  try {
    const listingId = req.params.listingId;
    const listingToDelete = await Listing.findById(listingId).populate('owner');
  if(listingToDelete.owner._id.equals(req.session.user._id)) {
      await listingToDelete.deleteOne();
      res.redirect('/');
  } else {
  res.send('You do not have permission to delete this listing')
  }
  } catch (error) {
    console.log(error);
    res.render("error.ejs");
  }
});

// edit

router.get('/:listingId/edit', async (req, res) => {
  try {
    console.log(req.params.listingId);
    const listingId = req.params.listingId;
    const listingToEdit = await Listing.findById(listingId).populate('owner');
    console.log(listingToEdit);
   if (listingToEdit.owner._id.equals(req.session.user._id)) {
      res.render('listings/edit.ejs', {
        listing: listingToEdit,
      });
    } else {
     res.send('You do not have permission to edit this page');
   }
  } catch (error) {
    console.log(error);
    res.render("error.ejs");
  }
});


router.put('/:listingId', async (req, res) => {
  try {
    console.log(req.params.listingId);
    console.log(req.body);
    const listingId = req.params.listingId;
    console.log(listingId);
    console.log(req.body)
    const listingToEdit = await Listing.findById(listingId).populate('owner');
    // Update the listing in the database
    if (listingToEdit.owner._id.equals(req.session.user._id)) {
    await listingToEdit.updateOne(req.body);
    // Redirect to the show page to see the updates
    res.redirect(`/listings/${req.params.listingId}`);
  } else {
    res.send('You do not have permission to edit this page');
  }
  } catch (err) {
    console.log(error);
    res.render("error.ejs", { msg: err.message });
  }


});

module.exports = router
