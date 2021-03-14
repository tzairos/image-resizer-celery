module.exports = {

	entry: './src/app.js',
	output: {
	  filename: 'bundle.js'
	},
	devServer: {
		contentBase: './dist'
	},
	module: {
	  rules: [
		{
		  test: /\.js$/,
		  exclude: /node_modules/,
		  use: 'babel-loader'
		},
		{ 
			test: /\.css$/i,
			use: ['style-loader', 'css-loader'],
		}
	  ]
	}
  };