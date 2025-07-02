const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
require('dotenv').config();

const router = express.Router();
const upload = multer();

const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT);
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DO_SPACES_KEY,
  secretAccessKey: process.env.DO_SPACES_SECRET,
});

router.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  const params = {
    Bucket: process.env.DO_SPACES_BUCKET,
    Key: `${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ACL: 'public-read',
    ContentType: file.mimetype,
  };

  try {
    const data = await s3.upload(params).promise();
    res.json({ url: data.Location });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;