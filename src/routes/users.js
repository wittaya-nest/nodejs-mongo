const express = require('express')
const router = express.Router()
const passport = require('passport')

const User = require('../models/User')

router.get('/users/signin', function(req, res){
    res.render('users/signin')
})

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}))

router.get('/users/signup', function(req, res){
    res.render('users/signup')
})

router.post('/users/signup', async function(req, res){
    var {name, email, password, confirm_password} = req.body
    name = name.toLowerCase()
    email = email.toLowerCase()
    const errors = []
    if(name.length == 0){
        errors.push({text: 'Please Inpsert Username '}, {text: 'Please Insert Email '})
    }
    if(email.length == 0){
        errors.push({text: 'Please Insert Email '})
    }
    if(password != confirm_password){
        errors.push({text: 'Password do not match'})
    }
    if(password.length < 4){
        errors.push({text: 'Password must be at least 4 characters'})
    }
    if(errors.length > 0){
        res.render('users/signup', {errors, name, email})
    } else{ 
            const nameUser = await User.findOne({name: name})
            const emailUser = await User.findOne({email: email})

            if(nameUser && !emailUser){
                errors.push({text: 'The Username is already in use'})
                res.render('users/signup', {errors, email})
            }
            if(!nameUser && emailUser){
                errors.push({text: 'The Email is already in use'})
                res.render('users/signup', {errors, name})
            }
            if(nameUser && emailUser) {
                errors.push({text: 'The Username is already in use'}, {text: 'The Email is already in use'})
                res.render('users/signup', {errors})
            }
            if(!nameUser && !emailUser){
                const newUser = new User({name, email, password})
                newUser.password = await newUser.encryptPassword(password)
                await newUser.save()
                req.flash('success_msg', 'You are registered')
                res.redirect('/users/signin')
            }
        }
    })

router.get('/users/logout', function(req, res){
        req.logout()
        res.redirect('/')
})


module.exports = router