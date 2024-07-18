// models/listing.js

const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({

    picname: {
        type: String,
        required: [true, 'Please enter a name using text']
    },
    photographer: {
        type: String,
        required: [true, 'Please enter a photographer using text']
    },
    image: {
        type: String,
        required: [true, 'Please enter an image URL']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },

});

const Listing = mongoose.model('Listing', listingSchema)

module.exports = Listing