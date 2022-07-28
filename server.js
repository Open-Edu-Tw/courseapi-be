import process from 'node:process';
import dotenv from 'dotenv-defaults';
import express from 'express';

// Import mongoose
import mongoose from 'mongoose';

// Import model and schema
import Course from './models/course.js';

dotenv.config();

const app = express();

app.get('/course/:id', async (request, response) => {
	const {id} = request.params;

	const document = await Course.findById(id);

	if (document) {
		// 如果有內容，則回傳 200。
		response.status(200);
	} else {
		// 如果沒有內容，則回傳 404。
		response.status(404);
	}

	// 無論有沒有內容都回傳 data。
	response.send({data: document?.toJSON()});
});

app.get('/course/search', async (request, response) => {
	const {keyword} = request.query;

	if (!keyword) {
		response.status(400).send({error: '缺少必要的參數 “keyword”。'});
	}

	const keywordMatcher = new RegExp(keyword, 'i');

	const matchedResult = await Course.find({
		name: {
			$regex: keywordMatcher,
		},
	});

	if (matchedResult?.length > 0) {
		response.status(200);
	} else {
		response.status(400);
	}

	response.send({data: matchedResult.toJSON()});
});

async function main() {
	const dbHost = process.env.MONGO_URL;
	const port = process.env.PORT || '4000';

	if (!dbHost) {
		throw new Error('You must specify the MONGO_URL.');
	}

	// Connect to MongoDB
	mongoose
		.connect(dbHost, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => console.log('MongoDB connection has been created.'));

	const db = mongoose.connection;
	db.on('error', (error) => console.log(error));

	// Don't start Express before database started.
	db.once('open', () => {
		app.listen(port, () => console.log(`API started on port ${port}!`));
	});
}

main();
