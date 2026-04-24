const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: path.resolve(__dirname, './.env') })

process.env.NODE_ENV = process.env.NODE_ENV || 'production'

require(path.resolve(__dirname, './src/server'))
