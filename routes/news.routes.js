const express = require('express')
const router = express.Router()
const News = require('../models/news.model')
const multer = require('multer')

// Function to calculate total pages
const getTotalPages = (totalCount, pageSize) => {
	return Math.ceil(totalCount / pageSize)
}

// Function to paginate results
const paginateResults = (results, page, pageSize) => {
	const skip = (page - 1) * pageSize
	return results.slice(skip, skip + pageSize)
}

router.get('/all', async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1
		const pageSize = parseInt(req.query.pageSize) || 6

		if (!req.query.page && !req.query.pageSize) {
			// Если не указаны параметры page и pageSize, вернуть все новости
			const allNews = await News.find()
			return res.json(allNews.reverse())
		}

		const skip = (page - 1) * pageSize

		const allNews = await News.find().skip(skip).limit(pageSize)
		const totalCount = await News.countDocuments()

		res.json({
			newsList: allNews.reverse(),
			totalPages: Math.ceil(totalCount / pageSize),
			currentPage: page,
		})
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

router.get('/top', async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1
		const pageSize = parseInt(req.query.pageSize) || 6

		const skip = (page - 1) * pageSize

		const topNews = await News.find({ isTop: true }).skip(skip).limit(pageSize)
		const totalCount = await News.countDocuments({ isTop: true })

		res.json({
			newsList: topNews.reverse(),
			totalPages: Math.ceil(totalCount / pageSize),
			currentPage: page,
		})
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.post('/add', upload.single('image'), async (req, res) => {
	try {
		const { title, description, textEditor, isTop, date } = req.body

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

router.put('/edit/:id', upload.single('image'), async (req, res) => {
	try {
		const newsId = req.params.id
		const { title, description, textEditor, isTop, date } = req.body

		const imageBuffer = req.file ? req.file.buffer : undefined

		const existingNews = await News.findById(newsId)

		if (!existingNews) {
			return res.status(404).json({ error: 'News not found' })
		}

		existingNews.title = title
		existingNews.description = description
		existingNews.textEditor = textEditor
		existingNews.isTop = isTop
		existingNews.date = date

		if (imageBuffer) {
			existingNews.image = imageBuffer
		}

		const updatedNews = await existingNews.save()
		const allNews = await News.find()

		res.json(allNews.reverse())
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

router.delete('/delete/:id', async (req, res) => {
	try {
		const newsId = req.params.id

		const existingNews = await News.findById(newsId)
		if (!existingNews) {
			return res.status(404).json({ error: 'News not found' })
		}

		await News.findByIdAndDelete(newsId)

		// Используйте переданные значения currentPage, totalPages и pageSize
		const currentPage = parseInt(req.query.currentPage) || 1
		const totalPages = parseInt(req.query.totalPages) || 1
		const pageSize = parseInt(req.query.pageSize) || 6

		// Пересчитайте количество новостей и верните результат с пагинацией
		const totalCount = await News.countDocuments()
		const skip = (currentPage - 1) * pageSize
		const allNews = await News.find().skip(skip).limit(pageSize)

		res.json({
			newsList: allNews.reverse(),
			totalPages: Math.ceil(totalCount / pageSize),
			currentPage: currentPage,
		})
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

module.exports = router
