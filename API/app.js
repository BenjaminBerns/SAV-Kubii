const express = require("express");
const app = express();
const users = require("./users");
const products = require("./products");
const cors = require("cors"); // Importer cors

// Configuration CORS
app.use(cors({ origin: ["http://localhost:4200", "https://tonfront.koyeb.app"] }));

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.get('/', (req, res) => res.send('Hello from Koyeb!'));

// Routes utilisateurs
app.post("/login", users.Login);
app.post("/Disconnect", users.Disconnect);

// Routes produits
app.get("/products", products.getAllProducts);
app.get("/products/:id", products.getProductById);
app.post("/products", products.createProduct);
app.put("/products/:id", products.updateProduct);
app.delete("/products/:id", products.deleteProduct);

// Routes problèmes
app.get("/products/:productId/problems", products.getProblemsForProduct);
app.get("/products/:productId/problems/:problemId", products.getProblemById);
app.post("/products/:productId/problems", products.createProblem);
app.put("/products/:productId/problems/:problemId", products.updateProblem);
app.delete("/products/:productId/problems/:problemId", products.deleteProblem);


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));
