const express = require('express')
const router = express.Router()

const Note = require('../models/Note')
const {isAuthenticated} = require('../helpers/auth')

router.get('/notes/add', isAuthenticated, function(req, res) {
    res.render('notes/add-note')
})

router.post('/notes/new-note', isAuthenticated, async function(req, res) {
    const { title, description } = req.body
    const errors = []
    if(!title) {
        errors.push({text: 'Please Write a Title'})
    }
    if(!description) {
        errors.push({text: 'Please Write a Description'})
    }
    if(errors.length > 0) {
        res.render('notes/add-note', {
            errors,
            title,
            description
        })
    } else {
        const newNote = new Note({ title, description})
        newNote.user = req.user.id
        await newNote.save();
        req.flash('success_msg', 'Note Added Successfully')
        res.redirect('/notes')
    }
})

router.get('/notes', isAuthenticated, async function(req, res){
    const notes = await Note.find({user: req.user.id}).sort({date: 'desc'})
    res.render('notes/all-notes', {notes})
})

router.get('/notes/edit/:id', isAuthenticated, async function(req, res){
    const note = await Note.findById(req.params.id)
    res.render('notes/edit-note', {note})
})


router.put('/notes/edit-note/:id', isAuthenticated, async function(req, res){
    const {title, description} = req.body
    await Note.findByIdAndUpdate(req.params.id, {title, description})
    req.flash('success_msg', 'Note Updated Successfully')
    res.redirect('/notes')
})

router.delete('/notes/delete/:id', isAuthenticated, async function(req, res){
    await Note.findByIdAndDelete(req.params.id)
    req.flash('success_msg', 'Note Deleted Successfully')
    res.redirect('/notes')
})

module.exports = router


//find() but don't have handlebars
/*router.get('/notes', async function(req, res) {
    const findData = Note.find().sort({date: 'desc'})
    await findData.then(function(documents) {
        const context = {notes: documents.map(function(document) {
            return {
                id: document.id,
                title: document.title,
                description: document.description
            }
        })
        }
        res.render('notes/all-notes', { notes: context.notes }) 
        console.log(context.notes)
    })
    .catch(error => res.status(500).send(error))
})*/