const mongoose = require("mongoose");
const validator = require("validator");
 
const user = require('./user')
const {Schema} = mongoose;
 const clothingItemSchema = new mongoose.Schema({ 
    name:{
        type: String ,
        required:true,
    },
    weather:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:  String,
        required:true,
        validate: {
            validator(value) {
              return validator.isURL(value);
            },
            message: "You must enter a valid URL",
          },

    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:user
        
    }, 
    likes:{
        type:[{type:mongoose.Schema.Types.ObjectId,
            ref:user
        }]
        
    }, 
    createdAt:{
        type: Date,
        default: Date.now

    }
 });
 

module.exports = mongoose.model("item", clothingItemSchema);
