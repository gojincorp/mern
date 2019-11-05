db = new Mongo().getDB('issuetracker')

db.issues.remove({})

db.issues.insert([
	{
		status: 'Open',
		owner: 'Winnie',
		created: new Date('2016-08-15'),
		effort: 5,
		completionDate: undefined,
		title: 'Error in concole when clicking Add'
	},
	{
		status: 'Assigned',
		owner: 'Eric',
		created: new Date('2016-08-25'),
		effort: 3,
		completionDate: new Date('2016-09-05'),
		title: 'My mother told me...'
	},
	{
		status: 'Assigned',
		owner: 'Congee',
		created: new Date('2016-08-29'),
		effort: 3,
		completionDate: new Date('2016-09-05'),
		title: 'Short and fat...'
	}
])

db.issues.createIndex({status: 1})
db.issues.createIndex({owner: 1})
db.issues.createIndex({created: 1})