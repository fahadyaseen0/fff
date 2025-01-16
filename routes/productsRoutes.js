import express from "express";
import { getProductController, addProductController, updateProductController, deleteProductController, getProductsBySeller } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/getproducts", getProductController);
productRouter.post("/addproducts", addProductController);
productRouter.put("/updateproducts", updateProductController);
productRouter.post("/deleteproducts", deleteProductController);

// Route to get products by seller ID
productRouter.get("/by-seller/:sellerId", getProductsBySeller);

export default productRouter;
