import express from "express";
import mongoose from "mongoose";
import expressLayouts from "express-ejs-layouts";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Middleware
app.use(expressLayouts);
app.set("layout", "layout");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 1. Schemas
const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageurl: { type: String, required: true },
});

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: Number, required: true },
  password: { type: String, required: true }
});

// 2. Models (Must be defined BEFORE routes)
const productModel = mongoose.model("products", productSchema);
const userModel = mongoose.model("users", userSchema);

// 3. Routes
app.get("/", async (req, res) => {
  try {
    const products = await productModel.find();
    const users = await userModel.find();
    res.render("index", { products, users });
  } catch (err) {
    res.status(500).send("Error fetching data");
  }
});

// Product Routes
app.get("/products/add", (req, res) => res.render("add"));
app.post("/products/save", async (req, res) => {
  await productModel.create(req.body);
  res.redirect("/");
});
app.get("/products/:id/edit", async (req, res) => {
  const product = await productModel.findById(req.params.id);
  res.render("edit", { product });
});
app.post("/products/:id/save", async (req, res) => {
  await productModel.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/");
});
app.post("/products/:id/delete", async (req, res) => {
  await productModel.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

// User Routes
app.get("/users/add", (req, res) => res.render("adduser"));
app.post("/users/save", async (req, res) => {
  await userModel.create(req.body);
  res.redirect("/");
});
app.get("/users/:id/edit", async (req, res) => {
  const user = await userModel.findById(req.params.id);
  res.render("edituser", { user });
});
app.post("/users/:id/save", async (req, res) => {
  await userModel.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/");
});
app.post("/users/:id/delete", async (req, res) => {
  await userModel.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

// 4. Server Initialization
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully");
    const PORT = process.env.PORT || 8083;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (err) {
    console.error("Connection failed:", err);
  }
};

startServer();