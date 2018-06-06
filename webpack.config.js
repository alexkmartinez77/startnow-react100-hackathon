const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

module.exports = {
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
        loader: 'babel-loader',
        resolve: {
          extensions: ['.js', '.jsx']
        },

				options: {
					presets: ['env', 'react']
				}
			}
		]
	},

	plugins: [new UglifyJSPlugin()],
	entry: path.resolve(__dirname, 'src/index.jsx'),

	output: {
		filename: 'bundle.js',
		chunkFilename: '[name].[chunkhash].js',
		path: path.resolve(__dirname, 'dist')
	},

	mode: 'development'
};
