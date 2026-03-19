const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { getAllPosts, getMyPosts, createPost, updatePost, deletePost } = require('../controllers/postController');

const router = express.Router();

router.get('/', getAllPosts);
router.get('/mine', requireAuth, getMyPosts);
router.post('/', requireAuth, createPost);
router.put('/:id', requireAuth, updatePost);
router.delete('/:id', requireAuth, deletePost);

module.exports = router;
