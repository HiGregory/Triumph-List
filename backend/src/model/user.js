import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: String, default: "",
  lastname: String, default: "",
  username: String, default: "",
  email: String, default: "",
  phonenumber: Number, default: "",
  profilepicurl: String, default: "",
  passwordresettoken: String,
  tokenexpiration: String,
  isactivated: String, default: false
});

module.exports = mongoose.model('User', userSchema);
