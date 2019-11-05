'use strict'
const MongoClient = require('mongodb').MongoClient

function usage() {
	console.log('Usage:')
	console.log('node', __filename, '<options>')
	console.log('Where option is one of:')
	console.log('  callbacks    Use the callbacks paradigm')
	console.log('  promises     Use the Promises paradigm')
	console.log('  generator    Use the Generator paradigm')
	console.log('  asumc    	Use the async module')
}

if (process.argv.length < 3) {
	console.log('Incorrect number of arguments')
	usage()
} else {
	if (process.argv[2] === 'callbacks') {
		testWithCallbacks()
	} else if (process.argv[2] === 'callbacks') {
		testWithCallbacks()
	} else if (process.argv[2] === 'promises') {
		testWithPromises()
	} else if (process.argv[2] === 'generator') {
		testWithGenerator()
	} else if (process.argv[2] === 'async') {
		testWithAsync()
	} else {
		console.log("Invalid option:  ", process.argv[2])
		usage()
	}
}

function testWithCallbacks() {
	MongoClient.connect(
		'mongodb://localhost',
		function(err, client) {
			if (err) {
				console.log('Mongo DB connection error:  ', err)
			} else {
				console.log('Mongo DB connection success...')
				var db = client.db('issuetracker')
				db.collection('issues').insertOne(
					{
						status: 'Assigned',
						owner: 'Callback',
						created: new Date('2019-10-29'),
						effort: 3,
						title: 'Callback test...'
					},
					function(err, result) {
						console.log('Results of insert:  ', result.insertedId)
						db.collection('issues').find({_id: result.insertedId}).toArray(function(err, issues) {
							console.log('Result of find:', issues)
							client.close()
						})
					}
				)
			}
		}
	)
}

function testWithPromises() {
	let client
	let db
	MongoClient.connect('mongodb://localhost').then(connection => {
		client = connection
		db = client.db('issuetracker')
		return db.collection('issues').insertOne({
			status: 'Assigned',
			owner: 'Promise',
			created: new Date('2019-10-29'),
			effort: 3,
			title: 'Promise test...'
		})
	}).then(result => {
		console.log('Result of insert:  ', result.insertedId)
		return db.collection('issues').find({_id: result.insertedId}).toArray()
	}).then(issues => {
		console.log('Result of find:  ', issues)
		client.close()
	}).catch(err => {
		console.log('ERROR:  ', err)
	})
}

function testWithGenerator() {
	const co = require('co')
	co(function*() {
		const client = yield MongoClient.connect('mongodb://localhost')
		const db = client.db('issuetracker')
		
		const result = yield db.collection('issues').insertOne({
			status: 'Assigned',
			owner: 'Generator',
			created: new Date('2019-10-29'),
			effort: 3,
			title: 'Generator test...'
		})
		console.log('Result of insert:  ', result.insertedId)
		
		const issues = yield db.collection('issues').find({_id: result.insertedId}).toArray()
		console.log('Result of find:  ', issues)
		
		client.close()
	}).catch(err => {
		console.log('ERROR:  ', err)
	})
}

function testWithAsync() {
	const async = require('async')
	let client, db
	async.waterfall([
		next => {
			MongoClient.connect('mongodb://localhost', next)
		},
		(connection, next) => {
			client = connection
			db = client.db('issuetracker')
			db.collection('issues').insertOne({
				status: 'Assigned',
				owner: 'Async',
				created: new Date('2019-10-29'),
				effort: 3,
				title: 'Async test...'
			}, next)
		},
		(insertResult, next) => {
			console.log('Result of insert:  ', insertResult.insertedId)
			db.collection('issues').find({_id: insertResult.insertedId}).toArray(next)
		},
		(issues, next) => {
			console.log('Results of find:  ', issues)
			client.close()
			next(null, 'All done...')
		}
	], (err, result) => {
		if (err)
			console.log('ERROR:  ', err)
		else
			console.log(result)
	})
}