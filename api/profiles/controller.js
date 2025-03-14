const Profile = require('./model');

// Récupérer tous les profils avec filtres optionnels
exports.getAllProfiles = async (req, res) => {
  try {
    const { skills, location } = req.query;
    let query = { isDeleted: false };
    
    if (skills) {
      query.skills = { $in: skills.split(',') };
    }
    
    if (location) {
      query['information.location'] = { $regex: location, $options: 'i' };
    }
    
    const profiles = await Profile.find(query);
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer un profil par ID
exports.getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findOne({ _id: req.params.id, isDeleted: false })
      .populate('friends', 'name email _id');
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Créer un nouveau profil
exports.createProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const newProfile = new Profile({
      name,
      email
    });
    
    const savedProfile = await newProfile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Mettre à jour un profil
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const updatedProfile = await Profile.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { name, email },
      { new: true }
    );
    
    if (!updatedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un profil (soft delete)
exports.deleteProfile = async (req, res) => {
  try {
    const deletedProfile = await Profile.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    
    if (!deletedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ajouter une expérience
exports.addExperience = async (req, res) => {
  try {
    const { title, company, dates, description } = req.body;
    
    Profile.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $push: { experience: { title, company, dates, description } } },
      { new: true }
    )
      .then(updatedProfile => {
        if (!updatedProfile) {
          return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(updatedProfile);
      })
      .catch(error => {
        res.status(400).json({ error: error.message });
      });

    await profile.save();
    
    res.json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer une expérience
exports.deleteExperience = async (req, res) => {
  try {
    const profile = await Profile.findOne({ _id: req.params.id, isDeleted: false });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    profile.experience = profile.experience.filter(
      exp => exp._id.toString() !== req.params.exp
    );
    
    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Ajouter une compétence
exports.addSkill = async (req, res) => {
  try {
    const { skill } = req.body;
    
    const profile = await Profile.findOne({ _id: req.params.id, isDeleted: false });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    if (!profile.skills.includes(skill)) {
      profile.skills.push(skill);
      await profile.save();
    }
    
    res.json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer une compétence
exports.deleteSkill = async (req, res) => {
  try {
    const skill = req.params.skill;
    
    const profile = await Profile.findOne({ _id: req.params.id, isDeleted: false });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    profile.skills = profile.skills.filter(s => s !== skill);
    await profile.save();
    
    res.json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Mettre à jour les informations
exports.updateInformation = async (req, res) => {
  try {
    const { bio, location, website } = req.body;
    
    const profile = await Profile.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { 
        information: { bio, location, website } 
      },
      { new: true }
    );
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Ajouter un ami
exports.addFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    
    const profile = await Profile.findOne({ _id: req.params.id, isDeleted: false });
    const friend = await Profile.findOne({ _id: friendId, isDeleted: false });
    
    if (!profile || !friend) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    if (!profile.friends.includes(friendId)) {
      profile.friends.push(friendId);
      await profile.save();
    }
    
    res.json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un ami
exports.deleteFriend = async (req, res) => {
  try {
    const friendId = req.params.friendId;
    
    const profile = await Profile.findOne({ _id: req.params.id, isDeleted: false });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    profile.friends = profile.friends.filter(id => id.toString() !== friendId);
    await profile.save();
    
    res.json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Récupérer les amis d'un profil
exports.getFriends = async (req, res) => {
  try {
    const profile = await Profile.findOne({ _id: req.params.id, isDeleted: false })
      .populate('friends', 'name email _id');
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.json(profile.friends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
