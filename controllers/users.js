const User = require("../models/user");
const { BAD_REQUEST, DEFAULT, OKAY_REQUEST, CREATE_REQUEST, NOT_FOUND } = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OKAY_REQUEST).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(DEFAULT).send({ message: err.message });
    });
};
const getUser =(req, res)=>{
  const {userId} = req.params;
  console.log(userId)

  User.findById(userId).orFail().then((user)=>res.status(OKAY_REQUEST).send(user)).catch((err)=>{
    console.error(err);
      if (err.name === "ValidationError" || err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      if (err.name === 'DocumentNotFoundError'){
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      return res.status(DEFAULT).send({ message: err.message });
  })

}
const createUser = (req, res) => {
  
  const { name, avatar, email, password } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res.status(DEFAULT).send({ message: err.message });
    });
    
};

// User.findOne({ email }).select('+password')
//   .then((user) => {
//    if(user){
//     return res.status(HTTP_USER_DUPLICATED).send({message:'Duplicate error'})
//    }
//    return bcrypt.hash(password, 10);
//   }).then((hash)=>{
//     User.create({
//       name,
//       avatar,
//       password:hash,
//     });
//   })
 const signUp =(req,res)=>{

 }
module.exports = { getUsers, createUser, getUser, BAD_REQUEST,DEFAULT, OKAY_REQUEST, CREATE_REQUEST, NOT_FOUND };
