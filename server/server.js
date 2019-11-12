
import express from 'express'
import bodyParser from 'body-parser'
import { MongoClient, ObjectId } from 'mongodb'
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import SourceMapSupport from 'source-map-support'
import Issue from './issues'
import path from 'path'

SourceMapSupport.install()

let client
let db
const app = express()
app.use(express.static('static'))
app.use(bodyParser.json())

if (process.env.NODE_ENV !== 'production') {
    const webpack = require('webpack')
    const webpackDevMiddleware = require('webpack-dev-middleware')
    const webpackHotMiddleware = require('webpack-hot-middleware')

    const config = require('../webpack.config')
    config.entry.main.push('webpack-hot-middleware/client?reload=true&timeout=1000')
    config.plugins.push(new webpack.HotModuleReplacementPlugin())

    const bundler = webpack(config)
    app.use(webpackDevMiddleware(bundler, { noInfo: true }))
    app.use(webpackHotMiddleware(bundler, { log: console.log }))
}

app.get('/api/issues', (req, res) => {
    const filter = {}
    if (req.query.status) filter.status = req.query.status
    if (req.query.effort_lte || req.query.effort_gte) filter.effort = {}
    if (req.query.effort_lte) filter.effort.$lte = parseInt(req.query.effort_lte, 10)
    if (req.query.effort_gte) filter.effort.$gte = parseInt(req.query.effort_gte, 10)
    // Pull data from mongoDB
    db.collection('issues').find(filter).toArray()
        .then(issues => {
            const metadata = {
                total_count: issues.length,
            }
            res.json({
                _metadata: metadata,
                records: issues,
            })
        })
        .catch(error => {
            console.log('ERROR:  ', error)
            res.status(500).json({ message: `Internal Server Error:  ${error}` })
        })
})

app.get('/api/issues/:id', (req, res) => {
    let issueId
    try {
        issueId = new ObjectId(req.params.id)
    } catch (err) {
        res.status(422).json({ message: `Invalid issue ID format:  ${err}`})
        return
    }
    
    db.collection('issues').find({ _id: issueId }).limit(1)
    .next()
    .then(issue => {
        if (!issue) res.status(404).json({ messgage: `No such issue: ${issueId}` })
        else res.json(issue)
    })
    .catch(err => {
        console.log(error)
        res.status(500).json({ message: `Internal Server Error: ${err}`})
    })
})

app.post('/api/issues', (req, res) => {
    const newIssue = req.body
    newIssue.created = new Date()

    if (!newIssue.status) {
        newIssue.status = 'New'
    }

    const err = Issue.validateIssue(newIssue)
    if (err) {
        res.status(422).json({ message: `Invalid request: ${err}` })
        return
    }

    db.collection('issues').insertOne(Issue.cleanupIssue(newIssue))
        .then(result => db.collection('issues').find({ _id: result.insertedId }).limit(1).next())
        .then(returnIssue => {
            res.json(returnIssue)
        })
        .catch(error => {
            console.log('ERROR:  ', error)
            res.status(500).json({ message: `Internal Server Error:  ${error}` })
        })
})

app.get('*', (req, res) => {
    res.sendFile(path.resolve('static/index.html'))
})

MongoClient.connect('mongodb://localhost', { useUnifiedTopology: true }).then(connection => {
    client = connection
    db = client.db('issuetracker')

    app.listen(7072, () => {
        console.log('App started on port 7072...')
    })
}).catch(error => {
    console.log('ERROR:  ', error)
})
