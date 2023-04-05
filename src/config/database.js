const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.Promise = global.Promise;
module.exports = mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
