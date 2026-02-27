import express from "express";
import mongoose from "mongoose";
import expressLayouts from "express-ejs-layouts";
import dbconnect from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(expressLayouts);
app.set("layout","layout");
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const startServer = async () => {
  await dbconnect();
  app.listen(8080, () => console.log("Server started"));
};

//*******product Schema************* */
const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageurl: { type: String, required: true },
});


//*******userSchema************* */
const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true ,unique:true },
  phoneNumber: { type: Number, required: true },
  password: {type: String ,required: true}
});


const productModel = mongoose.model("products", productSchema);


app.get("/products/add", (req, res) => {
  res.render("add");
});

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


//************user routes */
const userModel = mongoose.model("users", userSchema);
app.get("/", async (req, res) => {
  const products = await productModel.find();
  const users = await userModel.find();
  res.render("index", { products, users });
});
app.get("/users/add", (req, res) => {
  res.render("adduser");
});

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
// Show edit user form
app.get("/users/:id/edit", async (req, res) => {
  const user = await userModel.findById(req.params.id);
  res.render("edituser", { user });
});

// Save edited user
app.post("/users/:id/save", async (req, res) => {
  await userModel.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/");
});
app.post("/users/:id/delete", async (req, res) => {
  await userModel.findByIdAndDelete(req.params.id);
  res.redirect("/");
});
// // Show delete confirmation
// app.get("/:id/delete", async (req, res) => {
//   const product = await productModel.findById(req.params.id);
//   res.render("delete", { product });
// });

// // Delete after confirmation
// app.post("/:id/delete", async (req, res) => {
//   await productModel.findByIdAndDelete(req.params.id);
//   res.redirect("/");
// });

startServer();