require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5001;

const cors = require("cors");
const { object } = require("zod");

app.use(cors());
app.use(express.json());

const pick = (obj, keys) => {
  const finalObj = {};

  for (const key of keys) {
    if (obj && object.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key];
    }
  }

  return finalObj;
};

const uri = process.env.DATABASE_URL;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("Baitul-Hikmah-Books");
    const bookCollection = db.collection("books");
    const wishlistCollection = db.collection("Wishlists");
    const readlistCollection = db.collection("ReadingList");

    app.get("/books", async (req, res) => {
      const filterableFields = ["searchTerm", "genre", "publicationYear"];
      const bookFilterData = ["title", "author", "genre"];

      const filters = pick(req.query, filterableFields);

      const { searchTerm, ...filterData } = filters;

      const andConditions = [];

      if (searchTerm) {
        andConditions.push({
          $or: bookFilterData.map((field) => ({
            [field]: {
              $regex: searchTerm,
              $options: "i",
            },
          })),
        });
      }

      if (Object.keys(filterData).length) {
        andConditions.push({
          $and: Object.entries(filterData).map(([field, value]) => ({
            [field]: value,
          })),
        });
      }

      const whereConditions =
        andConditions.length > 0 ? { $and: andConditions } : {};

      const result = bookCollection
        .find(whereConditions)
        .sort({ createdAt: -1 });

      const cursor = bookCollection.find({}).sort({ createdAt: -1 });
      const book = await result.toArray();

      res.send({ status: true, data: book });
    });

    app.post("/book", async (req, res) => {
      const book = req.body;
      book.createdAt = new Date();
      book.updatedAt = new Date();

      const result = await bookCollection.insertOne(book);
      res.send(result);
    });

    app.get("/book/:id", async (req, res) => {
      const id = req.params.id;
      const result = await bookCollection.findOne({ _id: ObjectId(id) });
      res.send(result);
    });

    app.patch("/book/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;

      const result = await bookCollection.findOneAndUpdate(
        { _id: ObjectId(id) },
        { $set: { updatedAt: new Date() } }
      );
      res.send(result);
    });

    app.delete("/book/:id", async (req, res) => {
      const id = req.params.id;

      const result = await bookCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });

    app.post("/review/:id", async (req, res) => {
      const bookId = req.params.id;
      const review = req.body;

      const result = await bookCollection.updateOne(
        { _id: ObjectId(bookId) },
        {
          $push: {
            reviews: review,
          },
          $set: {
            updatedAt: new Date(),
          },
        }
      );

      if (result.modifiedCount !== 1) {
        res.json({ error: "Book not found or review not added" });
        return;
      }

      res.json({ message: "Review added successfully" });
    });

    app.get("/review/:id", async (req, res) => {
      const bookId = req.params.id;

      const result = await bookCollection.findOne(
        { _id: ObjectId(bookId) },
        { projection: { _id: 0, reviews: 1 } }
      );

      if (result) {
        res.json(result);
      } else {
        res.status(404).json({ error: "Book not found" });
      }
    });

    app.patch("/review/:id/user/:email", async (req, res) => {
      const bookId = req.params.id;
      const userEmail = req.params.email;
      const updatedReview = req.body.review;

      const result = await bookCollection.findOneAndUpdate(
        { _id: ObjectId(bookId), "reviews.userEmail": userEmail },
        {
          $set: {
            "reviews.$.review": updatedReview,
          },
          $set: {
            updatedAt: new Date(),
          },
        }
      );

      if (result) {
        return res.json(result);
      }

      res.status(404).json({ error: "Book not found" });
    });

    app.delete("/review/:id/user/:email", async (req, res) => {
      const bookId = req.params.id;
      const userEmail = req.params.email;

      const result = await bookCollection.findOneAndUpdate(
        { _id: ObjectId(bookId) },
        { $pull: { reviews: { userEmail } } }
      );

      if (result) {
        return res.json(result);
      }

      res.status(404).json({ error: "Book not found" });
    });

    app.post("/wishlist", async (req, res) => {
      const { userEmail, book } = req.body;
      const payload = { userEmail, books: [book] };

      let result;
      const exist = await wishlistCollection.findOne({ userEmail });
      if (exist)
        result = await wishlistCollection.findOneAndUpdate(
          { userEmail },
          {
            $push: { books: book },

            $set: {
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          }
        );
      else result = await wishlistCollection.insertOne(payload);

      res.json({
        message: "Wishlist added successfully",
        result: result.value,
      });
    });

    app.get("/wishlist/:email", async (req, res) => {
      const userEmail = req.params.email;
      const result = await wishlistCollection.findOne({ userEmail });

      if (result) {
        return res.json(result);
      }

      res.status(404).json({ error: "Book not found" });
    });

    // ToDo: Fix This!
    app.delete("/wishlist/:email/book/:bookId", async (req, res) => {
      const userEmail = req.params.email;
      const bookId = req.params.bookId;

      const result = await wishlistCollection.findOneAndUpdate(
        { userEmail },
        { $pull: { books: { _id: ObjectId(bookId) } } }
      );

      if (result) {
        return res.json(result);
      }

      res.status(404).json({ error: "Book not found" });
    });

    app.post("/readinglist", async (req, res) => {
      const { userEmail, book } = req.body;
      const bookData = { ...book, completedReading: false };
      const payload = { userEmail, readingPlan: [bookData] };

      let result;
      const exist = await readlistCollection.findOne({ userEmail });
      if (exist)
        result = await readlistCollection.findOneAndUpdate(
          { userEmail },
          {
            $push: { readingPlan: bookData },
            $set: {
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          }
        );
      else result = await readlistCollection.insertOne(payload);

      res.json({
        message: "Book added to Reading List successfully",
        result: result.value,
      });
    });

    app.get("/readinglist/:email", async (req, res) => {
      const userEmail = req.params.email;
      const result = await readlistCollection.findOne({ userEmail });

      if (result) {
        return res.json(result);
      }

      res.status(404).json({ error: "Book not found" });
    });

    app.patch("/readinglist/:email/book/:bookId", async (req, res) => {
      const userEmail = req.params.email;
      const bookId = req.params.bookId;

      const result = await readlistCollection.findOneAndUpdate(
        { userEmail, "readingPlan._id": bookId },
        {
          $set: { "readingPlan.$.completedReading": true },
          $set: {
            updatedAt: new Date(),
          },
        }
      );

      if (result) {
        return res.json(result);
      }

      res.status(404).json({ error: "Book not found" });
    });

    app.post("/user", async (req, res) => {
      const user = req.body;
      user.createdAt = new Date();
      user.updatedAt = new Date();

      const result = await userCollection.insertOne(user);

      res.send(result);
    });

    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;

      const result = await userCollection.findOne({ email });

      if (result?.email) {
        return res.send({ status: true, data: result });
      }

      res.send({ status: false });
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
