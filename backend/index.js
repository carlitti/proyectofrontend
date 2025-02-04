const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(express.json());


let productos = [
    { id: 1, titulo: "Avión 1", precio: 100000, imagen: "https://via.placeholder.com/150" },
    { id: 2, titulo: "Helicóptero 2", precio: 200000, imagen: "https://via.placeholder.com/150" }
];

let users = [];

app.get("/api/publicaciones", (req, res) => {
    res.json(productos);
});


app.get("/api/publicaciones/:id", (req, res) => {
    const { id } = req.params;
    const producto = productos.find(p => p.id === parseInt(id));

    if (!producto) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(producto);
});

app.post("/api/publicaciones", (req, res) => {
    try {
        const { titulo, precio, imagen } = req.body;

        if (!titulo || !precio) {
            return res.status(400).json({ message: "Faltan datos" });
        }

        const newProduct = { id: productos.length + 1, titulo, precio, imagen: imagen || "https://via.placeholder.com/150" };
        productos.push(newProduct);

        res.status(201).json({ message: "Producto agregado", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
});


app.post("/api/auth/register", (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({ message: "Faltan datos" });
        }

        if (users.find(user => user.email === email)) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }

        const newUser = { id: users.length + 1, nombre, email, password };
        users.push(newUser);

        res.json({ message: "Usuario registrado con éxito", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
});


app.post("/api/auth/login", (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Faltan datos" });
        }

        const user = users.find(user => user.email === email && user.password === password);

        if (!user) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        res.json({ message: "Login exitoso", token: "fake-jwt-token", user });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
});


app.use((req, res) => {
    res.status(404).json({ message: "Ruta no encontrada" });
});


app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
