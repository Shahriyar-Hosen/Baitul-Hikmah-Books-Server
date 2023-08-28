require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5001;

const cors = require("cors");
const { object } = require("zod");

app.use(cors());
app.use(express.json());

const filterableFields = ["searchTerm", "genre", "publicationDate"];
const searchableFields = ["title", "author", "genre"];
const paginationFields = ["page", "limit", "sortBy", "sortOrder"];

const pick = (obj, keys) => {
  const finalObj = {};

  for (const key of keys) {
    if (obj && object.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key];
    }
  }

  return finalObj;
};

const paginationHelpers = (options) => {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || 10);
  const skip = (page - 1) * limit;

  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
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
    const Book = db.collection("books");
    const Wishlist = db.collection("Wishlists");
    const ReadingList = db.collection("ReadingList");

    app.get("/books", async (req, res) => {
      const filters = pick(req.query, filterableFields);
      const paginationOptions = pick(req.query, paginationFields);

      const { limit, page, skip, sortBy, sortOrder } =
        paginationHelpers(paginationOptions);

      const { searchTerm, ...filtersData } = filters;

      const andConditions = [];

      if (searchTerm) {
        andConditions.push({
          $or: searchableFields.map((field) => ({
            [field]: {
              $regex: searchTerm,
              $options: "i",
            },
          })),
        });
      }

      if (Object.keys(filtersData).length) {
        andConditions.push({
          $and: Object.entries(filtersData).map(([field, value]) => ({
            [field]: value,
          })),
        });
      }

      const sortConditions = {};

      if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
      }
      const whereConditions =
        andConditions.length > 0 ? { $and: andConditions } : {};

      const result = Book.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);

      const books = await result.toArray();
      const total = await Book.countDocuments();

      res.send({
        status: true,
        meta: {
          page,
          limit,
          total,
        },
        data: books,
      });
    });

    app.post("/book", async (req, res) => {
      const book = req.body;
      book.createdAt = new Date();
      book.updatedAt = new Date();

      const result = await Book.insertOne(book);
      res.send(result);
    });

    app.get("/book/:id", async (req, res) => {
      const id = req.params.id;
      const result = await Book.findOne({ _id: ObjectId(id) });
      res.send(result);
    });

    app.patch("/book/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      updatedData.updatedAt = new Date();

      const result = await Book.findOneAndUpdate(
        { _id: ObjectId(id) },
        { $set: updatedData }
      );
      res.send(result);
    });

    app.delete("/book/:id", async (req, res) => {
      const id = req.params.id;

      const result = await Book.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });

    app.post("/review/:id", async (req, res) => {
      const bookId = req.params.id;
      const review = req.body;

      const result = await Book.updateOne(
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

      const result = await Book.findOne(
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

      const result = await Book.findOneAndUpdate(
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

      const result = await Book.findOneAndUpdate(
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
      const exist = await Wishlist.findOne({ userEmail });
      if (exist)
        result = await Wishlist.findOneAndUpdate(
          { userEmail },
          { $push: { books: book } }
        );
      else result = await Wishlist.insertOne(payload);

      res.json({
        message: "Wishlist added successfully",
        result: result.value,
      });
    });

    app.get("/wishlist/:email", async (req, res) => {
      const userEmail = req.params.email;
      const result = await Wishlist.findOne({ userEmail });

      if (result) {
        return res.json(result);
      }

      res.status(404).json({ error: "Book not found" });
    });

    // ToDo: Fix This!
    app.delete("/wishlist/:email/book/:bookId", async (req, res) => {
      const userEmail = req.params.email;
      const bookId = req.params.bookId;

      const result = await Wishlist.findOneAndUpdate(
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
      const exist = await ReadingList.findOne({ userEmail });
      if (exist)
        result = await ReadingList.findOneAndUpdate(
          { userEmail },
          {
            $push: { readingPlan: bookData },
            $set: {
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          }
        );
      else result = await ReadingList.insertOne(payload);

      res.json({
        message: "Book added to Reading List successfully",
        result: result.value,
      });
    });

    app.get("/readinglist/:email", async (req, res) => {
      const userEmail = req.params.email;
      const result = await ReadingList.findOne({ userEmail });

      if (result) {
        return res.json(result);
      }

      res.status(404).json({ error: "Book not found" });
    });

    app.patch("/readinglist/:email/book/:bookId", async (req, res) => {
      const userEmail = req.params.email;
      const bookId = req.params.bookId;

      const result = await ReadingList.findOneAndUpdate(
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
