const express = require("express");
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwttoken = require("jsonwebtoken");
const User = require("../../models/User");
const config = require("config");
const router = express.Router();

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is not in correct format").isEmail(),
    check("password", "Password length should be greater than 6").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const error = validationResult(req);
    console.log(error);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }

    try {
      console.log(config);
      const { name, password, email } = req.body;
      // if()
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User Already Exists" }] });

        // return new Error('User Already Exists')
      }
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new User({
        name,
        password,
        avatar,
        email,
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwttoken.sign(
        payload,
        config.get("secretKey"),
        { expiresIn: 3600000 },
        (err, token) => {
          if (err) {
            throw err;
          } else res.json({ token });
        }
      );
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
