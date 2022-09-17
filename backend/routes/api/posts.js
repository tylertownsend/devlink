const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/post');
const User = require('../../models/users');

/**
 * @route       GET api/post
 * @description Test route
 * @access      Public
 */
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Send error');
  }
});

/**
 * @route       GET api/post/:id
 * @description Test route
 * @access      Public
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    if (!err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    console.error(err);
    res.status(500).send('Send error');
  }
});

/**
 * @route       POST api/post
 * @description Make a new post
 * @access      private
 */
router.post('/', [ auth, [
  check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = await User.findById(req.user.id).select('-password');

  try {
    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    });

    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send('Send error');
  }
});

/**
 * @route       DELETE api/post/:id
 * @description Delete a new post
 * @access      private
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'user not authorized' });
    }
    
    await post.remove();
    res.json({ msg: 'Post removed' });
  } catch (err) {
    if (!err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    console.error(err);
    res.status(500).send('Send error');
  }
});

/**
 * @route       DELETE api/post/:id
 * @description Delete a new post
 * @access      private
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'user not authorized' });
    }
    
    await post.remove();
    res.json({ msg: 'Post removed' });
  } catch (err) {
    if (!err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    console.error(err);
    res.status(500).send('Send error');
  }
});

/**
 * @route       PUT api/post/unlike/:id
 * @description Unlike a post
 * @access      private
 */
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    if (post.likes.filter(like => like.user.toString() === req.user.id).length == 0) {
      return res.status(400).json({ msg: 'Post already not liked' });
    }

    const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post.likes);
  } catch (err) {
    if (!err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    console.error(err);
    res.status(500).send('Send error');
  }
});

/**
 * @route       PUT api/post/like/:id
 * @description Like a post
 * @access      private
 */
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    if (!err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    console.error(err);
    res.status(500).send('Send error');
  }
});

router.post('/comment/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const user = await User.findById(req.user.id).select('-password');

    const comment = {
      user: req.user.id,
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
    };
    post.comments.unshift(comment);
    await post.save();

  } catch (err) {
    if (!err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    console.error(err);
    res.status(500).send('Send error');
  }
});

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const comment = post.comments.find(comment => {
      return comment.id.toString() === req.params.comment_id;
    });
    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }
    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    post.comments = post.comments.filter(
      ({ id }) => id !== req.params.comment_id
    );
    await post.save();
    return res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

module.exports = router;