import {
	InsertOneResult,
	MongoClient,
	ServerApiVersion,
	Document,
	ObjectId,
	WithId,
	DeleteResult,
	UpdateResult,
	FindCursor,
} from "mongodb";

const uri: string = process.env.DB_CONN_URL ? process.env.DB_CONN_URL : "mongodb+srv://admin:admin123@glass-edge.hqmedfc.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

export async function run() {
	try {
		await client.connect();
		await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} catch (error) {
		throw "Fucking server crashed!";
	}
}

export function end_server() {
	client.close();
}

export type Entry = {
	name: string;
	description: string;
	tags: string[]; // ! Do not let client define this. Only Admin.
	linkage: string[]; // ! Do not use this yet, not ready for development.
	thumbnail_src: string;
	option: EntryOption[];
	additional: EntryAdditional[];
	base_price: number;
};

export type EntryOption = {
	// * Slider options.
	name: string;
	choice: {
		label: string;
		modifier: number;
	}[];
};

export type EntryAdditional = {
	// * Boolean options.
	name: string;
	modifier: number;
};

export interface EntryListOptions {
	limit: number; // Number of entries to be queue
	skip: number; // Number of entries to be skip
	filter: any | null; // Filter entries
}

export async function getNumberOfEntries() {
	return new Promise<number>((resolve, reject) => {
		client
			.db("development")
			.collection("item")
			.countDocuments({}).then(
				(result) => {
					resolve(result);
				}
			)
	})
}

// * Testing
export async function getAllEntries(options: EntryListOptions) {
	return new Promise<Entry[]>(async (resolve, reject) => {
		const result: FindCursor<WithId<Entry>> = client
			.db("development")
			.collection<Entry>("item")
			.find({}, { limit: options.limit, skip: options.skip });

		let send_back: Entry[] = [];
		for await (const doc of result) {
			send_back.push(doc);
		}

		resolve(send_back);
	});
}

// ! DO NOT USE THIS! FOR RESETTING DB ONLY
export async function dropAllEntries() {
	return new Promise<any>((resolve, reject) => {
		client
			.db("development")
			.collection<Entry>("item")
			.deleteMany({})
			.then((result) => {
				resolve(result);
			});
	});
}

export async function getEntry(entry_id: string) {
	return new Promise<WithId<Entry> | null>((resolve, reject) => {
		client
			.db("development")
			.collection<Entry>("item")
			.findOne({ _id: new ObjectId(entry_id) })
			.then((result) => {
				resolve(result);
			});
	});
}

export async function addEntry(entry: Entry) {
	return new Promise<InsertOneResult<Entry>>((resolve, reject) => {
		client
			.db("development")
			.collection<Entry>("item")
			.insertOne(entry)
			.then((result) => {
				resolve(result);
			})
			.catch((failed) => {
				reject(new Error("Unexpected Failure!"));
			});
	});
}

export async function removeEntry(entry_id: string) {
	return new Promise<DeleteResult>((resolve, reject) => {
		client
			.db("development")
			.collection<Entry>("item")
			.deleteOne({ _id: new ObjectId(entry_id) })
			.then((result) => {
				resolve(result);
			});
	});
}

export async function updateEntry(entry_id: string, body_replacement: Entry) {
	return new Promise<UpdateResult<Entry> | null>((resolve, reject) => {
		client
			.db("development")
			.collection<Entry>("item")
			.updateOne(
				{ _id: new ObjectId(entry_id) },
				{ $set: body_replacement }
			)
			.then((result) => {
				resolve(result);
			});
	});
}
