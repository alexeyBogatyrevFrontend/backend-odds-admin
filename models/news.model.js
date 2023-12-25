// models/news.model.js
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const newsSchema = new Schema(
	{
		id: { type: String, required: true },
		title: { type: String, required: true },
		description: { type: String, required: true },
		textEditor: { type: String, required: true },
		isTop: { type: Boolean, required: true },
		date: { type: Date, required: true },
		image: { type: Buffer, required: true }, // Use Buffer to store image data
	},
	{
		timestamps: true,
	}
)

const News = mongoose.model('News', newsSchema)

module.exports = News
