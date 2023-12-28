const express = require('express')
const router = express.Router()
const News = require('../models/news.model')
const multer = require('multer')

router.get('/all', async (req, res) => {
	try {
		const allNews = await News.find()
		res.json(allNews.reverse())
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// Set up multer for handling file uploads
const storage = multer.memoryStorage() // Store files in memory as Buffer
const upload = multer({ storage: storage })

router.post('/add', upload.single('image'), async (req, res) => {
	try {
		const { title, description, textEditor, isTop, date } = req.body

		// Access the file data as a Buffer
		const imageBuffer = req.file ? req.file.buffer : undefined

		const news = new News({
			// id,
			title,
			description,
			textEditor,
			isTop,
			date,
			image: imageBuffer,
		})

		const savedNews = await news.save()
		const allNews = await News.find()

		res.json(allNews.reverse())
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// Update news by ID
router.put('/edit/:id', upload.single('image'), async (req, res) => {
	try {
		const newsId = req.params.id
		const { title, description, textEditor, isTop, date } = req.body

		// Access the file data as a Buffer if an image is provided
		const imageBuffer = req.file ? req.file.buffer : undefined

		// Find the news by ID
		const existingNews = await News.findById(newsId)

		if (!existingNews) {
			return res.status(404).json({ error: 'News not found' })
		}

		// Update the news fields
		// existingNews.id = id
		existingNews.title = title
		existingNews.description = description
		existingNews.textEditor = textEditor
		existingNews.isTop = isTop
		existingNews.date = date

		// Update the image if provided
		if (imageBuffer) {
			existingNews.image = imageBuffer
		}

		// Save the updated news
		const updatedNews = await existingNews.save()
		const allNews = await News.find()

		res.json(allNews.reverse())
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// Delete news by ID
router.delete('/delete/:id', async (req, res) => {
	try {
		const newsId = req.params.id

		// Check if the news exists
		const existingNews = await News.findById(newsId)
		if (!existingNews) {
			return res.status(404).json({ error: 'News not found' })
		}

		// Delete the news
		await News.findByIdAndDelete(newsId)
		const allNews = await News.find()

		res.json(allNews.reverse())
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

module.exports = router
