const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()

// db
mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

// init /public
app.use(express.static(__dirname + '/public'));

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls })
})

// dislay
app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl })

    res.redirect('/')
})

// delete
app.post('/delete/:shortUrl', async (req, res) =>{
    await ShortUrl.deleteOne({ short: req.params.shortUrl}).then (() => {
        console.log(req.body.shortUrl + " Entry Deleted")
    }).catch (() => {   
        console.log(error)
    })
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5000);