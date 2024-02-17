const express = require('express');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const Posts = require('../../models/Posts');

const router = express.Router();

router.post(
  '/',
  [auth, [check('text', 'text is req').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const newPost = new Posts({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      const post = await newPost.save();
      res.json(post);
    } catch (error) {
      console.log('🚀 ~ error:', error);
      return res.status(500).send(error);
    }
  }
);

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Posts.find().sort({ date: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.log('🚀 ~ error:', error);
    return res.status(500).send(error);
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) {
      return res.status(400).send('Post not found');
    }
    res.status(200).json(post);
  } catch (error) {
    console.log('🚀 ~ error:', error);
    return res.status(500).send(error);
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    console.log('🚀 ~ router.delete ~ post:', post);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(401).send('User not Autherized');
    }
    await Posts.findOneAndDelete(req.params.id);
    res.status(200).json('Post deleted succesfully');
  } catch (error) {
    console.log('🚀 ~ error:', error);
    return res.status(500).send(error);
  }
});

router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    console.log('🚀 ~ router.put ~ post:', post);
    if (post.likes.find((like) => like.user.toString() === req.user.id)) {
      return res.status(400).send('Post already liked');
    }
    post.likes.unshift({ user: req.user.id });

    await post.save();
    res.status(200).json(post.likes);
  } catch (error) {
    console.log('🚀 ~ error:', error);
    return res.status(500).send(error);
  }
});
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post.likes.find((like) => like.user.toString() === req.user.id)) {
      return res.status(400).send('Post already unliked');
    }

    const index = post.likes.findIndex(
      (item) => item.id.toString() === req.user.id
    );
    post.likes.splice(index, 1);
    await post.save();
    res.status(200).json(post.likes);
  } catch (error) {
    console.log('🚀 ~ error:', error);
    return res.status(500).send(error);
  }
});

router.post(
  '/comment/:id',
  [auth, [check('text', 'text is req').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Posts.findById(req.params.id);
      post.comments.unshift({
        ...user,
        user: req.user.id,
        text: req.body.text,
      });
      //   const newComment = new Posts({});
      const comment = await post.save();
      res.json(comment);
    } catch (error) {
      console.log('🚀 ~ error:', error);
      return res.status(500).send(error);
    }
  }
);

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  const post = await Posts.findById(req.params.id);
  const comment = post.comments.find(
    (comment) => comment.id.toString() === req.params.comment_id
  );
  const commentIndex = post.comments.findIndex(
    (comment) => comment.id.toString() === req.params.comment_id
  );
  if (!comment) {
    return res.status(400).send('Comment Already deleted');
  } else if (comment.user.toString() !== req.user.id) {
    return res.status(400).send('User not Autherized');
  }
  post.comments.splice(commentIndex, 1);
  await post.save();
  res.status(200).send('Comment Deleted Successfully');
});

module.exports = router;
