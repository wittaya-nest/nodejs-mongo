const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
// initalization
const app = express()
require('./database')
require('./config/passport')
//Setting
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}))
app.set('view engine', '.hbs')
//Middlewares
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
//Global Variables
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg')//use with if
    res.locals.error_msg = req.flash('error_msg')//use with each
    res.locals.error = req.flash('error')//use with if
    res.locals.user = req.user || null
    next()
})
//routes
app.use(require('./routes'))
app.use(require('./routes/notes'))
app.use(require('./routes/users'))
//Static Files
app.use(express.static(path.join(__dirname, 'public')))

//Server is Listening
app.listen(app.get('port'), function(){
    console.log('Server on port', app.get('port'))
})