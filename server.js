import process from 'node:process';
import dotenv from 'dotenv-defaults';
import express from 'express';

// Import mongoose
import mongoose from 'mongoose';

// Import model and schema
import Course from './models/course.js';

dotenv.config();

const app = express();

app.get('/course', async (request, response) => {
	/**
	 * @type {{ [key: string]: { $regex: RegExp }}}
	 */
	const matchers = {};

	// 從 request.query 取出 query parameter，
	// 然後建構不分大小寫的 Regex 的查詢請求。
	const addMatcher = (queryName) => {
		if (queryName) {
			matchers[queryName] = {
				$regex: new RegExp(request.query[queryName], 'i'),
			};
		}
	};

	for (const queryName of ['name', 'url', 'description', 'source']) {
		addMatcher(queryName);
	}

	const matchedResult = await Course.find(matchers);

	response.status(matchedResult?.length > 0 ? 200 : 400);

	response.send({data: matchedResult});
});

app.get('/course/:id', async (request, response) => {
	const {id} = request.params;

	const document = await Course.findById(id);

	response.status(document ? 200 : 404);

	// 無論有沒有內容都回傳 data。
	response.send({data: document});
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
