const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

// Get Posts
router.get('/', async (req, res) => {
  const posts = await loadPostsCollection();
  res.send(await posts.find({}).toArray());
});

// Add Post
router.post('/', async (req, res) => {
  const posts = await loadPostsCollection();
  await posts.insertOne({
    text: req.body.text,
    createAt: new Date()
  });
  res.status(201).send();
});

// Update Post
router.put('/', async (req, res) => {
  const posts = await loadPostsCollection();
  await posts.findOneAndUpdate(
    {_id: new mongodb.ObjectID(req.body.id)},
    {$set: {text: req.body.text, updatedAt: new Date()}}
  );
  res.status(200).send();
});

// Delete Post
router.delete('/:id', async (req, res) => {
  const posts = await loadPostsCollection();
  await posts.deleteOne({_id: new mongodb.ObjectID(req.params.id)});
  res.status(200).send();
});

// Connect to Post Collection

async function loadPostsCollection() {
  const client = await mongodb.MongoClient.connect
  ('mongodb://processTest:process1234@ds157493.mlab.com:57493/vue_process', {
    useNewUrlParser: true
  });

  return client.db('vue_process').collection('posts');
}

module.exports = router;