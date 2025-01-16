import Product from "../models/productModel.js";
import Seller from "../models/sellerModel.js"; // Import Seller model

// Fetch all products and include seller data
export const getProductController = async (req, res) => {
    try {
        // Populate the `sellerId` field with the seller's details from the Seller model
        const products = await Product.find().populate('sellerId');
        res.status(200).send(products);
    } catch (error) {
        console.log("Error fetching products:", error);
        res.status(500).send({ message: "Failed to fetch products" });
    }
};

// Fetch products by seller ID
export const getProductsBySeller = async (req, res) => {
    const { sellerId } = req.params;
    try {
        const products = await Product.find({ sellerId });
        console.log(`Products for seller ${sellerId}:`, products); // Debug log
        res.status(200).json(products);
    } catch (error) {
        console.log("Error fetching products for seller:", error);
        res.status(500).json({ message: "Error fetching products for the seller", error });
    }
};

// Add a new product
export const addProductController = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(200).send("Product Created Successfully!");
    } catch (error) {
        console.log("Error saving product:", error);
        res.status(500).send({ message: "Failed to create product", error });
    }
};

// Update a product
export const updateProductController = async (req, res) => {
    try {
        await Product.findOneAndUpdate({ _id: req.body.productId }, req.body, { new: true });
        res.status(201).json("Product Updated!");
    } catch (error) {
        console.log("Error updating product:", error);
        res.status(400).send(error);
    }
};

// Delete a product
export const deleteProductController = async (req, res) => {
    try {
        await Product.findOneAndDelete({ _id: req.body.productId });
        res.status(200).json("Product Deleted!");
    } catch (error) {
        console.log("Error deleting product:", error);
        res.status(400).send(error);
    }
};



