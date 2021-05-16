const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
	title: String,
	subtitle: String,
	itemType: String,
	premium: Number,
});

module.exports = mongoose.model('Item', itemSchema);
