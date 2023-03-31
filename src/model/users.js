const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const usersSchema= mongoose.Schema({
    name:{type: String, required: true ,trim: true },
    id: {type: String, required: true, unique:true}, 
    email: { type:String, required:true, unique:true },
    role: {type:String, required:true, default: 'guest'},
	password: { type: String, required: true ,  min: 8},
    count: {type: Number, default:0},
    status: { type: String, enum: ['active','deactive'],default:'deactive'},
},{
    timestamps: true
});


// define a login method on the user schema for Mock test
usersSchema.statics.login = async function(email, password) {
    // find the user with the given email
    const user = await this.findOne({ email });
  
    if (!user) {
      // if no user is found, return null
      return null;
    }
  
    // compare the password with the hashed password in the database
    const match = await bcrypt.compare(password, user.password);
  
    if (match) {
      // if the password matches, return the user
      return user;
    } else {
      // if the password doesn't match, return null
      return null;
    }
  };

module.exports = mongoose.model('users',usersSchema);