const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const basketSchema = new Schema({
	id: Number,
	startDate: String,
	items: Array,
	totalPremium: Number,
});

module.exports = mongoose.model('Basket', basketSchema);
