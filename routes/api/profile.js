const express = require("express");
const Profile = require("../../models/Profile");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const router = express.Router();

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.find({ user: req.user.id }).populate("user", [
      "avatar",
      "name",
    ]);

    if (!profile) {
      res.status(400).send({ msg: "profile not found" });
    }
    res.status(200).json({ profile });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is mandatory").not().isEmpty(),
      check("skills", "Skills is mandatory").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    console.log("🚀 ~ req:", req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
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
        console.log("🚀 ~ profile:", profile);
        // return res.status(400).json({ msg: "Profile Already Present" });
        const updatedProfile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.status(200).json(updatedProfile);
      }

      const newProfile = new Profile(profileFields);
      console.log("🚀 ~ newProfile:", newProfile);
      const isSavedSuccesfully = await newProfile.save();
      console.log("🚀 ~ isSavedSuccesfully:", isSavedSuccesfully);
      if (isSavedSuccesfully) {
        return res.status(200).json(newProfile);
      }
    } catch (error) {
      console.log("🚀 ~ error:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get("/", (req, res) => {
    try {


        
    } catch (error) {
      res.status(500).send("Internal Server Error");
        
    }
});

module.exports = router;
