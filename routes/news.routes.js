const express = require('express')
const router = express.Router()
const News = require('../models/news.model')
const multer = require('multer')

router.get('/all', async (req, res) => {
	try {
		const allNews = await News.find()
		res.json(allNews)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// Set up multer for handling file uploads
const storage = multer.memoryStorage() // Store files in memory as Buffer
const upload = multer({ storage: storage })

router.post('/add', upload.single('image'), async (req, res) => {
	try {
		const { id, title, description, textEditor, isTop, date } = req.body

		// Access the file data as a Buffer
		const imageBuffer = req.file.buffer

		const news = new News({
			id,
			title,
			description,
			textEditor,
			isTop,
			date,
			image: imageBuffer,
		})

		const savedNews = await news.save()
		res.json(savedNews)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

module.exports = router
