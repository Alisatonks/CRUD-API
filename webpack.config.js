import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  entry: './src/index.ts', 
  target: 'node', 
  mode: isProduction ? 'production' : 'development',
  module: {
    rules: [
        {
            test: /\.ts$/,
            use: 'ts-loader', 
            exclude: /node_modules/,
        },
    ],
},
  output: {
    filename: 'bundle.js', 
    path: path.resolve(process.cwd(), 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};