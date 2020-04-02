const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { Schema } = mongoose

const UserSchema = new Schema({
    name: { type: String, required: true},
    email: { type: String, required: true},
    password: { type: String, required: true},
    date: { type: Date, default: Date.now}
})

UserSchema.methods.encryptPassword = async function(password){
    const salt = await bcrypt.genSalt(10)
    const hash = bcrypt.hash(password, salt)
    return hash
}

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    })
}

/*UserSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password)
    
}*/
module.exports = mongoose.model('User', UserSchema)