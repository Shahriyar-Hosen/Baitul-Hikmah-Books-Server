import express from "express";
import { BookController } from "./book.controller";

const router = express.Router();

router.get("/publishedYears", BookController.getPublishedYears);
router.patch("/add-review/:id", BookController.addReview);
router.get("/featuredBook", BookController.getFeaturedBooks);
router.get("/:id", BookController.getSingleBook);
router.get("/", BookController.getAllBooks);
router.post("/", BookController.addNewBook);
router.patch("/:id", BookController.updateBook);
router.delete("/:id", BookController.deleteBook);

export const BookRoute = router;
