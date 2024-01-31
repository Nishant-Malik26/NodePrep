const express = require("express");
const auth = require("../../middleware/auth");
const User = require("../../models/User");

const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwttoken = require("jsonwebtoken");
const config = require("config");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(400).json({ msg: "User Not Found" });
    } else return res.status(200).json({ user });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.post(
  "/",
  [
    // check("name", "Name is required").not().isEmpty(),
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
      const { password, email } = req.body;
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User Doesn't Exist" }] });

        // return new Error('User Already Exists')
      }

      // user = new User({
      //   name,
      //   password,
      //   avatar,
      //   email,
      // });

      const isPassCorrect = await bcrypt.compare(password, user.password);

      if (isPassCorrect) {
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
            } else
              res
                .status(200)
                .json({ msg: "User Succesfully logged in", token });
          }
        );
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;




