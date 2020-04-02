const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const validator = require("email-validator");
//const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const User = require('../models/User')

/*passport.use(new LocalStrategy({
    usernameField: 'id',
    passReqToCallback: true
}, async function(req, id, password, done){
    var user
    id = id.toLowerCase()
    if(validator.validate(id)){user = await User.findOne({email: id})}
    else{user = await User.findOne({name: id})}

    if(!user){
        return done(null, false, req.flash('error', 'Not User found'))
    } else{
        const match = await user.matchPassword(password)

        if(match) {
            return done(null, user, req.flash('success_msg', 'Welcome  ' + user.name))
        } else{
            return done(null, false, req.flash('error', 'Incorrect Password'))
        }
    }
}))*/


passport.use(new LocalStrategy({
    usernameField: 'id',
    passReqToCallback: true
}, function(req, id, password, done){
    id = id.toLowerCase();
    if(validator.validate(id)){
        User.findOne({email: id}, compare(req, password, done))
    }else{
        User.findOne({name: id}, compare(req, password, done))
    }
}))

function compare(req, password, done){
return function (err, user){
    console.log(user)
    console.log(password)
    if (err) throw (err)
    if(!user) {
        return done(null, false, req.flash('error', 'Not User found')); 
    }
    user.comparePassword(password, function(err, isMatch) {
        if (err) throw (err)
        if(isMatch) {
            return done(null, user, req.flash('success_msg', 'Welcome  ' + user.name))
        } else{
            return done(null, false, req.flash('error', 'Incorrect Password'))
        }
    })
}
}

passport.serializeUser(function(user, done){
    done(null, user.id)
})

passport.deserializeUser(function(id, done){
    User.findById(id, function(err,user){
        done(err, user)
    })
})
   
