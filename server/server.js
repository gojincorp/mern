
import express from 'express'
import bodyParser from 'body-parser'
import { MongoClient } from 'mongodb'
import Issue from './issues.js'
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import SourceMapSupport from 'source-map-support'
SourceMapSupport.install()

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
	app.use(webpackDevMiddleware(bundler, {noInfo: true}))
	app.use(webpackHotMiddleware(bundler, {log: console.log}))
}

app.get('/api/issues', (req, res) => {
	// Pull data from mongoDB
	db.collection('issues').find().toArray().then(issues => {
		const metadata = {
			total_count: issues.length
		}
		res.json({
			_metadata: metadata,
			records: issues
		})
	}).catch(error => {
		console.log('ERROR:  ', error)
		res.status(500).json({message: `Internal Server Error:  ${error}`})
	})
})

app.post('/api/issues', (req, res) => {
	const newIssue = req.body
	newIssue.created = new Date()
	
	if(!newIssue.status)
		newIssue.status = 'New'
	
	const err = Issue.validateIssue(newIssue)
	if (err) {
		res.status(422).json({ message: `Invalid request: ${err}` })
		return
	}
			
	db.collection('issues').insertOne(newIssue).then(result =>
		db.collection('issues').find({id: result.insertedId}).limit(1).next()
	).then(newIssue => {
		res.json(newIssue)
	}).catch(error => {
		console.log('ERROR:  ', error)
		res.status(500).json({message: `Internal Server Error:  ${error}`})
	})
})

let client, db
MongoClient.connect('mongodb://localhost', {useUnifiedTopology: true}).then(connection => {
	client = connection
	db = client.db('issuetracker')

	app.listen(7072, () => {
		console.log('App started on port 7072...')
	})
}).catch(error => {
	console.log('ERROR:  ', error)
})
