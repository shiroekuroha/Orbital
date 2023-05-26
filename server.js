"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./services/db");
const app = (0, express_1.default)();
var cors_options = {
    //	origin: 'https://tame-jade-kingfisher-tux.cyclic.app',
    origin: '*',
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(cors_options));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Fuck You!");
});
app.get("/testing/:item", (req, res) => {
    console.log(req.params.item);
    res.send("Testing Message");
});
app.get("/testing", (req, res) => {
    console.log(req.query);
    res.send("Testing Message");
});
// Queue Entries from DB
app.get("/api/item/all", (req, res) => {
    let limit = req.query.limit
        ? Number.parseInt(req.query.limit.toString())
        : 10;
    let skip = req.query.skip
        ? Number.parseInt(req.query.skip.toString())
        : 0;
    let options = {
        limit: limit,
        skip: skip,
        filter: null,
    };
    (0, db_1.getAllEntries)(options).then((result) => {
        console.log(result);
        res.status(200).send(result);
    });
});
// Search Entry from DB
app.get("/api/item/:id", (req, res) => {
    if (req.params.id.length != 24) {
        res.status(400).send("Length of the ID is incorrect. Must be a 24 characters string.");
    }
    else {
        (0, db_1.getEntry)(req.params.id).then((result) => {
            if (result === null) {
                res.status(204).send(result);
            }
            else {
                res.status(200).send(result);
            }
        });
    }
});
// Add Entry to DB
app.put("/api/item", (req, res) => {
    (0, db_1.addEntry)(req.body).then((result) => {
        res.status(201);
        res.send(result);
    });
});
// Remove Entry from DB
app.delete("/api/item/:id", (req, res) => {
    if (req.params.id.length != 24) {
        res.status(400).send("Length of the ID is incorrect. Must be a 24 characters string.");
    }
    else {
        (0, db_1.removeEntry)(req.params.id).then((result) => {
            console.log(result);
            res.send({ message: result });
        });
    }
});
// Update Entry in DB
app.post("/api/item/:id", (req, res) => {
    if (req.params.id.length != 24) {
        res.status(400).send("Length of the ID is incorrect. Must be a 24 characters string.");
    }
    else {
        (0, db_1.updateEntry)(req.params.id, req.body).then((result) => {
            console.log(result);
            if (result === null) {
                res.status(204).send(result);
            }
            else {
                res.status(200).send(result);
            }
        });
    }
});
(0, db_1.run)()
    .then((good) => {
    app.listen(3000, () => {
        console.log("Server starting!");
    });
})
    .catch((bad) => {
    console.log("Bad Start, Need fixes!");
    console.log(bad);
});
const test = {
    name: "test item",
    description: "test item description",
    tags: ["for testing purpose", "development"],
    linkage: [],
    thumbnail_src: "none",
    option: [
        {
            name: "level of pain",
            choice: [
                {
                    label: "level 1",
                    modifier: 0,
                },
                {
                    label: "level 2",
                    modifier: 1,
                },
                {
                    label: "level 3",
                    modifier: 2,
                },
            ],
        },
        {
            name: "level of blood",
            choice: [
                {
                    label: "level 1",
                    modifier: 0,
                },
                {
                    label: "level 2",
                    modifier: 1,
                },
                {
                    label: "level 3",
                    modifier: 2,
                },
                {
                    label: "level 4",
                    modifier: 3,
                },
                {
                    label: "level 5",
                    modifier: 4,
                },
            ],
        },
    ],
    additional: [
        {
            name: "control 1",
            modifier: 1,
        },
        {
            name: "control 2",
            modifier: 2,
        },
    ],
    base_price: 10,
};
