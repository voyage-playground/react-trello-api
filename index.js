const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const redis = require('redis');
const { promisify } = require('util');

const app = express();
const port = 8080;
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:6379`,
});
const setKey = promisify(redisClient.set).bind(redisClient);

const url = `mongodb://root:secret@${process.env.DB_HOST}:27017`;
const dbName = 'trello_clone';
const client = new MongoClient(url);

const getDB = async () => {
  await client.connect();
  const db = client.db(dbName);
  return db;
};

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('ping ;)');
});

app.get('/board', async (req, res) => {
  const db = await getDB();
  const collection = db.collection('boards');
  const data = await collection.findOne({ _id: 1 });
  res.json(data);
});

app.post('/board', async (req, res) => {
  const db = await getDB();
  const collection = db.collection('boards');
  await collection.updateOne(
    { _id: 1 },
    { $set: { lanes: req.body.lanes } },
    { upsert: true }
  );
  const timestamp = Math.floor(new Date().getTime() / 1000);

  await setKey(timestamp, JSON.stringify({ lanes: req.body.lanes }));
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Trello API listening at http://localhost:${port}`);
});
