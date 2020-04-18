var express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const config = require("config");
const Profile = require("./../../models/Profile");
const User = require("./../../models/User");
const Post = require("./../../models/Post");
const auth = require("./../../middleware/auth");

// @route   POST api/posts
// @desc    create post
// @access  Private

router.post(
  "/",
  [
    auth,
    [
      check("text", "text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
      }
      const user = await User.findById(req.user.id).select("-password");
      const newPost = new Post({
        user: req.user.id,
        text: req.body.text,
        avatar: user.avatar,
        name: user.name
      });
      await newPost.save();
      return res.send(newPost);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({ msg: "Server error" });
    }
  }
);

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.send(posts);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ msg: "Server error" });
  }
});
// @route   GET api/posts/:id
// @desc    Get Post by id
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send({ msg: "Post not found" });
    }
    res.send(post);
  } catch (err) {
    console.log(err.message);
    if (err.kind == "ObjectId")
      return res.status(404).send({ msg: "Post not found" });
    res.status(500).send({ msg: "Server error" });
  }
});
// @route   DELETE api/posts/:id
// @desc    Delete Post
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //check if it's the owner
    if (post.user.toString() !== req.user.id) {
      return res.status(400).send({ msg: "Action denied" });
    }
    if (!post) {
      return res.status(404).send({ msg: "Post not found" });
    }
    await post.remove();
    res.send("Post deleted");
  } catch (err) {
    console.log(err.message);
    if (err.kind == "ObjectId")
      return res.status(404).send({ msg: "Post not found" });
    res.status(500).send({ msg: "Server error" });
  }
});

// @route   PUT api/posts/like/:id
// @desc    Like Post
// @access  Private

router.put("/like/:id", auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    //check if the posted is already liked by this user
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).send({ msg: "Post already liked" });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.send(post.likes);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ msg: "Server error" });
  }
});

// @route   PUT api/posts/unlike/:id
// @desc    Unlike Post
// @access  Private

router.put("/unlike/:id", auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    //check if the posted is not  liked by this user
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).send({ msg: "Post not liked yet" });
    }
    post.likes = post.likes.filter(
      like => like.user.toString() !== req.user.id
    );
    await post.save();
    res.send(post.likes);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ msg: "Server error" });
  }
});

// @route   POST api/posts/comment/:postId
// @desc    Add comment
// @access  Private

router.post(
  "/comment/:id",
  [
    auth,
    [
      check("text", "text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
      }
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        user: req.user.id,
        text: req.body.text,
        avatar: user.avatar,
        name: user.name
      };

      post.comments.unshift(newComment);
      post.save();
      return res.send(post.comments);
    } catch (err) {
      console.log(err.message);
      res.status(500).send({ msg: "Server error" });
    }
  }
);

// @route   POST api/posts/comment/:postId
// @desc    Delete comment
// @access  Private

router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // console.log(post.comments);
    // console.log(req.params.comment_id)
    const comment = post.comments.find(
      comment => comment._id.toString() === req.params.comment_id
    );
    //console.log(comment)
    if (!comment) {
      return res.status(404).send({ msg: "Comment not found!" });
    }
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).send({ msg: "User not authorized" });
    }

    post.comments = post.comments.filter(
      comment =>
        comment.user.toString() !== req.user.id ||
        comment._id.toString() !== req.params.comment_id
    );

    await post.save();
    res.send(post.comments)

  } catch (err) {
    console.log(err.message);
    res.status(500).send({ msg: "Server error" });
  }
});

module.exports = router;
