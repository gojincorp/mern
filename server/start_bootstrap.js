require('@babel/register')({
	presets: [
		[
			"@babel/preset-env",
			{
				"targets": {
					"node": true
				}
			}
		]
	]
})

require('./server.js')