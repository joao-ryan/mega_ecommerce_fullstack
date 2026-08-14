import { Router } from "express";
import multer from "multer";
import uploadConfig from "../../../../config/upload.js";
import { ProductImagesController } from "./controllers/ProductImagesController.js";
import { ensureAuthenticated } from "../../../../shared/middlewares/ensureAuthenticated.js";

const imagesRouter = Router();
const upload = multer(uploadConfig);
const imagesController = new ProductImagesController();

// Recebe a foto usando multipart/form-data com a chave 'image'
imagesRouter.post(
  "/",
  ensureAuthenticated,
  upload.single("image"),
  imagesController.create,
);

export default imagesRouter;
