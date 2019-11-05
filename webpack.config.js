const webpack = require('webpack')

module.exports = {
	mode: 'development',
	devtool: 'source-map',
	entry: {
		main: ['./src/App.jsx'],
	},
	output: {
		path: __dirname + '/static',
		filename: 'app.bundle.js'
	},
	optimization: {
		splitChunks: {
			chunks: 'all',
			minSize: 30000,
			maxSize: 0,
			minChunks: 1,
			maxAsyncRequests: 5,
			maxInitialRequests: 3,
			automaticNameDelimiter: '~',
			automaticNameMaxLength: 30,
			name: true,
			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					priority: -10
				},
			default: {
				minChunks: 2,
				priority: -20,
				reuseExistingChunk: true
			}
			}
		}
	},
	module: {
		rules: [
			{
				test: /\.jsx$/,
				use: [
				{
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-react', '@babel/preset-env']
					}
				}
				]
			}
		]
	},
	devServer: {
		host: '0.0.0.0',
		port: 7072,
		contentBase: 'static',
		disableHostCheck: true,
		proxy: {
			'/api/*': {
				target: 'http://localhost:3000'
			}
		}
	},
	plugins: []
}