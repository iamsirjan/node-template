const mongoose = require('mongoose');
const bycrypt = require('bcryptjs')
const jwt  = require('jsonwebtoken')


const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please provide a name '],
        minlength:3,
        maxlength:50,
    },
    email: {
        type:String,
        required:[true,'Please provide a email'],
        match:[/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,'please provide valid email'],
        unique:true

    },
    password:{
        type:String,
        required:[true,'Please provide a password'],
        minlength:6,
    }
})


UserSchema.pre('save', async function (next) {
    const salt = await bycrypt.genSalt(10)
    this.password = await bycrypt.hash(this.password, salt)

})

UserSchema.methods.createJWT  = function() {
    return jwt.sign({userId:this._id,name:this.name},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_LIFETIME,
    })
}

UserSchema.methods.comparePassword = async function(candidatePassword) {
    const isMatch = await bycrypt.compare(candidatePassword,this.password)
    return isMatch
}

module.exports = mongoose.model('User',UserSchema)