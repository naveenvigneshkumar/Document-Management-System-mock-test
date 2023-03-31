const mongoose = require("mongoose");

const uploadSchema= mongoose.Schema({
    id: {type: String, required: true, unique:true}, 
    filename:{type: String, required: true },    
    filepath: { type:String, required:true },
    reviewerId: {type: mongoose.Schema.Types.ObjectId, ref:"users"},
    guestId: {type: String},
    status: { type: String, enum: ['approved','unapproved','reject'],default:'unapproved'},
},{
    timestamps: true
});

module.exports = mongoose.model('uploadmodel',uploadSchema);