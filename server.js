import process from 'node:process';
import dotenv from 'dotenv-defaults';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Import mongoose
import mongoose from 'mongoose';

// Import model and schema
import Course from './models/course.js';

dotenv.config();

const app = express();

app.use(cors())

app.get('/course', async (request, response) => {
	/**
	 * @type {{ [key: string]: { $regex: RegExp }}}
	 */
	const matchers = {};

	// 從 request.query 取出 query parameter，
	// 然後建構不分大小寫的 Regex 的查詢請求。
	const addRegexMatcher = (queryName) => {
		if (queryName) {
			matchers[queryName] = request.query[queryName] ? {
				$regex: new RegExp(request.query[queryName], 'i'),
			} : null;
		}
	};

	// 如果 field 是 array 的話，那就直接找 query 有沒有在
	// array 裡面就好：https://stackoverflow.com/a/18148872/12652912
	const addArrayMatcher = (queryName) => {
		if (queryName) {
			matchers[queryName] = request.query[queryName] ?? null;
		}
	};

	for (const queryName of ['name', 'url', 'description', 'source']) {
		addRegexMatcher(queryName);
	}

	for (const queryName of ['instructor', 'keywords']) {
		addArrayMatcher(queryName);
	}

	const matchedResult = await Course.find(matchers);

	if (matchedResult?.length > 0) {
		response.status(200);
	} else {
		response.status(400);
	}

	response.send({data: matchedResult});
});

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
	response.send({data: document});
});

app.get('/', (request, response) => {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	response.status(200);
	response.sendFile(__dirname + "/homepage/index.html");
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
