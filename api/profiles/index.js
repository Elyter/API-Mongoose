const express = require('express');
const controller = require('./controller');

const router = express.Router();

// Routes principales
router.get('/', controller.getAllProfiles);
router.get('/:id', controller.getProfileById);
router.post('/', controller.createProfile);
router.put('/:id', controller.updateProfile);
router.delete('/:id', controller.deleteProfile);

// Routes pour les expériences
router.post('/:id/experience', controller.addExperience);
router.delete('/:id/experience/:exp', controller.deleteExperience);

// Routes pour les compétences
router.post('/:id/skills', controller.addSkill);
router.delete('/:id/skills/:skill', controller.deleteSkill);

// Route pour les informations
router.put('/:id/information', controller.updateInformation);

// Routes pour les amis (bonus)
router.post('/:id/friends', controller.addFriend);
router.delete('/:id/friends/:friendId', controller.deleteFriend);
router.get('/:id/friends', controller.getFriends);

module.exports = router;
