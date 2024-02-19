const express = require('express');
const Profile = require('../../models/Profile');
const auth = require('../../middleware/auth');
const request = require('request');

const { check, validationResult } = require('express-validator');
const config = require('config');

const router = express.Router();

router.get('/me', auth, async (req, res) => {
  console.log('🚀 ~ router.get ~ req.user.id:', req.user.id);
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['avatar', 'name']
    );

    if (!profile) {
      return res.status(400).send({ msg: 'profile not found' });
    }
    res.status(200).json({ profile });
  } catch (error) {
    console.log('🚀 ~ router.get ~ error:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is mandatory').not().isEmpty(),
      check('skills', 'Skills is mandatory').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body?.handle) profileFields.handle = req.body?.handle;
    if (req.body?.company) profileFields.company = req.body?.company;
    if (req.body?.website) profileFields.website = req.body?.website;
    if (req.body?.location) profileFields.location = req.body?.location;
    if (req.body?.bio) profileFields.bio = req.body?.bio;
    if (req.body?.status) profileFields.status = req.body?.status;
    if (req.body?.githubusername)
      profileFields.githubusername = req.body?.githubusername;
    if (typeof req.body.skills !== 'undefined') {
      profileFields.skills = req.body.skills.split(',');
    }

    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        console.log('🚀 ~ profile:', profile);
        // return res.status(400).json({ msg: "Profile Already Present" });
        const updatedProfile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.status(200).json(updatedProfile);
      }

      const newProfile = new Profile(profileFields);
      console.log('🚀 ~ newProfile:', newProfile);
      const isSavedSuccesfully = await newProfile.save();
      console.log('🚀 ~ isSavedSuccesfully:', isSavedSuccesfully);
      if (isSavedSuccesfully) {
        return res.status(200).json(newProfile);
      }
    } catch (error) {
      console.log('🚀 ~ error:', error);
      res.status(500).send('Internal Server Error');
    }
  }
);

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    return res.status(200).json(profiles);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).send({ msg: 'profile not found' });
    }
    return res.status(200).json(profile);
  } catch (error) {
    console.log('🚀 ~ router.get ~ error:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/', auth, async (req, res) => {
  try {
    await Profile.findOneAndDelete({ user: req.user.id });
    await User.findOneAndDelete({ _id: req.user.id });
    res.status(200).json('Deleted Succesfully');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

router.put('/experience', auth, (req, res) => {
  Profile.findOne({ user: req.user.id }).then((profile) => {
    const newExp = {
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description,
    };

    profile.experience.unshift(newExp);

    profile.save().then((profile) => res.json(profile));
  });
});

router.delete('/experience/:exp_id', auth, (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      const removeIndex = profile.experience
        .map((item) => item.id)
        .indexOf(req.params.exp_id);

      profile.experience.splice(removeIndex, 1);
      profile.save().then((profile) => res.json(profile));
    })
    .catch((err) => res.status(404).json(err));
});

router.put('/education', auth, (req, res) => {
  Profile.findOne({ user: req.user.id }).then((profile) => {
    const newEdu = {
      school: req.body.school,
      degree: req.body.degree,
      fieldofstudy: req.body.fieldofstudy,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description,
    };

    profile.education.unshift(newEdu);

    profile.save().then((profile) => res.json(profile));
  });
});

router.delete('/education/:edu_id', auth, (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      const removeIndex = profile.education
        .map((item) => item.id)
        .indexOf(req.params.edu_id);

      profile.education.splice(removeIndex, 1);

      profile.save().then((profile) => res.json(profile));
    })
    .catch((err) => res.status(404).json(err));
});

router.get('/github/:username', (req, res) => {
  try {
    const option = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=e6517508e1b0b4d88237&client_secret=e6517508e1b0b4d88237`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };
    request(option, (err, response, body) => {
      console.log('🚀 ~ request ~ option:', option);
      console.log('🚀 ~ request ~ response:', response);
      if (err) console.error(err);
      if (response.statusCode !== 200) {
        res.status(400).json('Profile Not Found');
      }
      res.json(JSON.parse(body));
    });
  } catch (error) {
    console.log('🚀 ~ router.get ~ error:', error);
    res.status(500).json(error);
  }
});

module.exports = router;
