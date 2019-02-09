const path = require('path')

module.exports ={
    // entry: './src/index.js',
    // output: {
    //   path: path.join(__dirname, 'dist'),
    //   filename: 'main.js'
    // },
    module: {
        rules: [
                {
                test:  /\.js$/ ,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        
        ]
    },
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: __dirname
    }
}
