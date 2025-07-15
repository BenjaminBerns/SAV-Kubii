
const fs = require('fs');
const path = require('path');

// Fonctions utilitaires
function readProductsData() {
    const fileData = fs.readFileSync('data/products.json', 'utf-8');
    return JSON.parse(fileData);
}

function writeProductsData(products) {
    fs.writeFileSync('data/products.json', JSON.stringify(products, null, 2), 'utf-8');
}

function getNextProductId(products) {
    return products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
}

function getNextProblemId(problems) {
    return problems.length > 0 ? Math.max(...problems.map(p => p.id)) + 1 : 1;
}

// CRUD Produits
function getAllProducts(req, res) {
    try {
        const products = readProductsData();
        res.status(200).json({
            message: "Produits récupérés avec succès",
            data: products
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des produits" });
    }
}

function getProductById(req, res) {
    try {
        const products = readProductsData();
        const productId = parseInt(req.params.id);
        const product = products.find(p => p.id === productId);
        
        if (!product) {
            return res.status(404).json({ message: "Produit introuvable" });
        }
        
        res.status(200).json({
            message: "Produit récupéré avec succès",
            data: product
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du produit" });
    }
}

function createProduct(req, res) {
    try {
        if (!req.body || !req.body.name || !req.body.description) {
            return res.status(400).json({ message: "Erreur : Nom et description requis" });
        }
        
        const products = readProductsData();
        const newProduct = {
            id: getNextProductId(products),
            name: req.body.name,
            description: req.body.description,
            problems: []
        };
        
        products.push(newProduct);
        writeProductsData(products);
        
        res.status(201).json({
            message: "Produit créé avec succès",
            data: newProduct
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création du produit" });
    }
}

function updateProduct(req, res) {
    try {
        const products = readProductsData();
        const productId = parseInt(req.params.id);
        const productIndex = products.findIndex(p => p.id === productId);
        
        if (productIndex === -1) {
            return res.status(404).json({ message: "Produit introuvable" });
        }
        
        if (req.body.name) products[productIndex].name = req.body.name;
        if (req.body.description) products[productIndex].description = req.body.description;
        
        writeProductsData(products);
        
        res.status(200).json({
            message: "Produit mis à jour avec succès",
            data: products[productIndex]
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du produit" });
    }
}

function deleteProduct(req, res) {
    try {
        const products = readProductsData();
        const productId = parseInt(req.params.id);
        const productIndex = products.findIndex(p => p.id === productId);
        
        if (productIndex === -1) {
            return res.status(404).json({ message: "Produit introuvable" });
        }
        
        products.splice(productIndex, 1);
        writeProductsData(products);
        
        res.status(200).json({ message: "Produit supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du produit" });
    }
}

// CRUD Problèmes
function getProblemsForProduct(req, res) {
    try {
        const products = readProductsData();
        const productId = parseInt(req.params.productId);
        const product = products.find(p => p.id === productId);
        
        if (!product) {
            return res.status(404).json({ message: "Produit introuvable" });
        }
        
        res.status(200).json({
            message: "Problèmes récupérés avec succès",
            data: product.problems
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des problèmes" });
    }
}

function getProblemById(req, res) {
    try {
        const products = readProductsData();
        const productId = parseInt(req.params.productId);
        const problemId = parseInt(req.params.problemId);
        
        const product = products.find(p => p.id === productId);
        if (!product) {
            return res.status(404).json({ message: "Produit introuvable" });
        }
        
        const problem = product.problems.find(p => p.id === problemId);
        if (!problem) {
            return res.status(404).json({ message: "Problème introuvable" });
        }
        
        res.status(200).json({
            message: "Problème récupéré avec succès",
            data: problem
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du problème" });
    }
}

function createProblem(req, res) {
    try {
        if (!req.body || !req.body.name || !req.body.description || !req.body.solution) {
            return res.status(400).json({ message: "Erreur : Nom, description et solution requis" });
        }
        
        const products = readProductsData();
        const productId = parseInt(req.params.productId);
        const productIndex = products.findIndex(p => p.id === productId);
        
        if (productIndex === -1) {
            return res.status(404).json({ message: "Produit introuvable" });
        }
        
        const newProblem = {
            id: getNextProblemId(products[productIndex].problems),
            name: req.body.name,
            description: req.body.description,
            solution: req.body.solution,
            data: req.body.data || "",
            link: req.body.link || ""
        };
        
        products[productIndex].problems.push(newProblem);
        writeProductsData(products);
        
        res.status(201).json({
            message: "Problème créé avec succès",
            data: newProblem
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création du problème" });
    }
}

function updateProblem(req, res) {
    try {
        const products = readProductsData();
        const productId = parseInt(req.params.productId);
        const problemId = parseInt(req.params.problemId);
        
        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: "Produit introuvable" });
        }
        
        const problemIndex = products[productIndex].problems.findIndex(p => p.id === problemId);
        if (problemIndex === -1) {
            return res.status(404).json({ message: "Problème introuvable" });
        }
        
        const problem = products[productIndex].problems[problemIndex];
        if (req.body.name) problem.name = req.body.name;
        if (req.body.description) problem.description = req.body.description;
        if (req.body.solution) problem.solution = req.body.solution;
        if (req.body.data) problem.data = req.body.data;
        if (req.body.link) problem.link = req.body.link;
        
        writeProductsData(products);
        
        res.status(200).json({
            message: "Problème mis à jour avec succès",
            data: problem
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du problème" });
    }
}

function deleteProblem(req, res) {
    try {
        const products = readProductsData();
        const productId = parseInt(req.params.productId);
        const problemId = parseInt(req.params.problemId);
        
        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: "Produit introuvable" });
        }
        
        const problemIndex = products[productIndex].problems.findIndex(p => p.id === problemId);
        if (problemIndex === -1) {
            return res.status(404).json({ message: "Problème introuvable" });
        }
        
        products[productIndex].problems.splice(problemIndex, 1);
        writeProductsData(products);
        
        res.status(200).json({ message: "Problème supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du problème" });
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProblemsForProduct,
    getProblemById,
    createProblem,
    updateProblem,
    deleteProblem
};
