require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5001;

const cors = require("cors");

app.use(cors());
app.use(express.json());

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
    const wishlistCollection = db.collection("wishlists");
    const readlistCollection = db.collection("ReadingList");

    app.get("/books", async (req, res) => {
      const cursor = bookCollection.find({}).sort({ publicationDate: -1 });
      const book = await cursor.toArray();

      res.send({ status: true, data: book });
    });

    app.post("/book", async (req, res) => {
      const book = req.body;

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
        { $set: updatedData }
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
        { $push: { reviews: review } }
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
        { $set: { "reviews.$.review": updatedReview } }
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
          { $push: { books: book } }
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
      console.log(bookId);
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
          { $push: { readingPlan: bookData } }
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
        { $set: { "readingPlan.$.completedReading": true } }
      );

      if (result) {
        return res.json(result);
      }

      res.status(404).json({ error: "Book not found" });
    });

    app.post("/user", async (req, res) => {
      const user = req.body;

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
