const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const app = express();

require('dotenv').config();
const mongoose = require('mongoose');

const Items = require('./models/item');
const Basket = require('./models/basket');
const Category = require('./models/category');

const monoDB_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.rvwu6.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(monoDB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
mongoose.connection.once('open', () => {
	console.log('Connected to MongoDB');
});

const {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLBoolean,
	GraphQLInt,
	GraphQLFloat,
	GraphQLList,
	GraphQLNonNull,
	GraphQLID,
} = require('graphql');

const CategoryType = new GraphQLObjectType({
	name: 'category',
	description: 'Represents category of items to cover',
	fields: () => ({
		id: { type: GraphQLNonNull(GraphQLID) },
		type: { type: GraphQLNonNull(GraphQLString) },
	}),
});

const BasketType = new GraphQLObjectType({
	name: 'basket',
	description: 'Represents a basket of items to cover',
	fields: () => ({
		id: { type: GraphQLNonNull(GraphQLID) },
		startDate: { type: GraphQLNonNull(GraphQLString) },
		items: { type: GraphQLList(ItemType) },
		totalPremium: { type: GraphQLNonNull(GraphQLFloat) },
	}),
});

const ItemType = new GraphQLObjectType({
	name: 'item',
	description: 'Represents an item to insure',
	fields: () => ({
		id: { type: GraphQLNonNull(GraphQLID) },
		title: { type: GraphQLNonNull(GraphQLString) },
		subTitle: { type: GraphQLNonNull(GraphQLString) },
		itemType: { type: GraphQLNonNull(GraphQLString) },
		premium: { type: GraphQLNonNull(GraphQLFloat) },
	}),
});

const RootQueryType = new GraphQLObjectType({
	name: 'Query',
	description: 'Root Query',
	fields: () => ({
		items: {
			type: GraphQLList(ItemType),
			description: 'List of items',
			resolve: (args) => Items.findById(args.id),
		},
		basket: {
			type: GraphQLList(BasketType),
			description: 'Basket of goodies',
			resolve: (args) => Basket.findById(args.id),
		},
		category: {
			type: GraphQLList(CategoryType),
			description: 'Category list of items to buy',
			resolve: (args) => Category.findById(args.id),
		},
	}),
});

const Mutation = new GraphQLObjectType({
	name: 'Mutations',
	fields: {
		addItem: {
			type: ItemType,
			args: {
				title: { type: GraphQLNonNull(GraphQLString) },
				subTitle: { type: GraphQLNonNull(GraphQLString) },
				itemType: { type: GraphQLNonNull(GraphQLString) },
				premium: { type: GraphQLNonNull(GraphQLFloat) },
			},
			resolve: (parent, args) => {
				let item = new Items({
					title: args.title,
					subTitle: args.subTitle,
					itemType: args.itemType,
					premium: args.premium,
				});
				return item.save();
			},
		},
	},
});

const schema = new GraphQLSchema({
	query: RootQueryType,
	mutation: Mutation,
});

app.use(
	'/graphql',
	expressGraphQL({
		schema: schema,
		graphiql: true,
	})
);
app.listen(5000, () => console.log('SERVER IS RUNNING ʕʘ̅͜ʘ̅ʔ'));
