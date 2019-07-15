import mongodb from 'mongodb';
import uuid from 'uuid';

export default {
  "port": 3060,
  "mongoUrl": "mongodb://localhost:27018/triumph",
   // "port": process.env.PORT,
   // "mongoUrl": process.env.MONGODB_URI,
  "bodyLimit": "100kb",
}
