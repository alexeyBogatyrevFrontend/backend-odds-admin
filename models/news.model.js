// models/news.model.js
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const newsSchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		textEditor: { type: String, required: true },
		isTop: { type: Boolean, required: true },
		date: { type: Date, required: true },
		image: { type: Buffer, required: true },
	},
	{
		timestamps: true,
	}
)

const News = mongoose.model('News', newsSchema)

module.exports = News
