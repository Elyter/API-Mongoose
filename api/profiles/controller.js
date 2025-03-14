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
    
    // Optimisation: utilisation de lean() pour des performances améliorées quand on n'a pas besoin d'instances complètes
    const profiles = await Profile.find(query).lean();
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
    const { name, email, skills = [], information = {} } = req.body;
    
    // Optimisation: initialisation avec toutes les propriétés disponibles
    const newProfile = new Profile({
      name,
      email,
      skills,
      information
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
    const updatedFields = {};
    
    // Optimisation: ne mise à jour que les champs fournis
    Object.keys(req.body).forEach(key => {
      if (key !== 'isDeleted' && key !== '_id') { // Sécurité pour éviter les modifications interdites
        updatedFields[key] = req.body[key];
      }
    });
    
    const updatedProfile = await Profile.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $set: updatedFields },
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

// Ajouter une expérience - Corrigé le mélange d'async/await et then/catch
exports.addExperience = async (req, res) => {
  try {
    const { title, company, dates, description } = req.body;

    const updatedProfile = await Profile.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $push: { experience: { title, company, dates, description } } },
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

// Supprimer une expérience
exports.deleteExperience = async (req, res) => {
  try {
    // Optimisation: mise à jour directe sans récupérer d'abord
    const updatedProfile = await Profile.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $pull: { experience: { _id: req.params.exp } } },
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

// Ajouter une compétence
exports.addSkill = async (req, res) => {
  try {
    const { skill } = req.body;
    
    // Optimisation: utilisation de l'opérateur $addToSet qui évite les duplications
    const updatedProfile = await Profile.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $addToSet: { skills: skill } },
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

// Supprimer une compétence
exports.deleteSkill = async (req, res) => {
  try {
    const skill = req.params.skill;
    
    // Optimisation: utilisation de l'opérateur $pull pour une mise à jour directe
    const updatedProfile = await Profile.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $pull: { skills: skill } },
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

// Mettre à jour les informations
exports.updateInformation = async (req, res) => {
  try {
    const updatedInfo = { ...req.body };
    
    const updatedProfile = await Profile.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $set: { information: updatedInfo } },
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

// Ajouter un ami
exports.addFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    
    // Vérification en une seule requête
    const [profile, friend] = await Promise.all([
      Profile.findOne({ _id: req.params.id, isDeleted: false }),
      Profile.findOne({ _id: friendId, isDeleted: false })
    ]);
    
    if (!profile || !friend) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    // Optimisation: utilisation de $addToSet
    const updatedProfile = await Profile.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { friends: friendId } },
      { new: true }
    );
    
    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un ami
exports.deleteFriend = async (req, res) => {
  try {
    const friendId = req.params.friendId;
    
    // Optimisation: utilisation de $pull
    const updatedProfile = await Profile.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $pull: { friends: friendId } },
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

// Récupérer les amis d'un profil
exports.getFriends = async (req, res) => {
  try {
    const profile = await Profile.findOne({ _id: req.params.id, isDeleted: false })
      .select('friends')
      .populate('friends', 'name email _id');
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.json(profile.friends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
