const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
	id: Number,
	title: String,
	subtitle: String,
	itemType: String,
	premium: Number,
});

module.exports = mongoose.model('Item', itemSchema);
