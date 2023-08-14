import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { BookValidation } from "./book.validation";
import { BookController } from "./book.controller";

const router = express.Router();

router.get("/", BookController.getBooks);
router.post(
  "/add-book",
  validateRequest(BookValidation.addBookZodSchema),
  BookController.addBook
);
router.get("/:id", BookController.getOneBook);
router.patch("/:id", BookController.editBook);
router.delete("/:id", BookController.deleteBook);

export const BookRoutes = router;
