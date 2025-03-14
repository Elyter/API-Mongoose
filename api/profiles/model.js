const mongoose = require('mongoose');
const { Schema } = mongoose;

const experienceSchema = new Schema({
  title: String,
  company: String,
  dates: String,
  description: String
});

const profileSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  experience: [experienceSchema],
  skills: [String],
  information: {
    bio: String,
    location: String,
    website: String
  },
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  }],
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
