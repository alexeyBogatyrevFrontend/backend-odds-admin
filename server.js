// server.js
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const newsRouter = require('./routes/news.routes')

const app = express()
const PORT = 3001

app.use(cors())
app.use(bodyParser.json({ limit: '5mb' }))

const mongoURI =
	'mongodb+srv://adminpanel:adminpanel@adminpanel.khj0hmz.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

const connection = mongoose.connection
connection.once('open', () => {
	console.log('MongoDB database connection established successfully')
})

app.use('/news', newsRouter)

app.listen(PORT, () => {
	console.log(`Server is running on port: ${PORT}`)
})
