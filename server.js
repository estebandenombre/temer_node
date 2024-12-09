const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log(`Conectado a MongoDB: ${mongoose.connection.host}`);
    } catch (err) {
        console.error('Error conectando a MongoDB:', err);
        // Intenta reconectar
        setTimeout(connectDB, 5000);
    }
};

connectDB();

// Manejo de errores de conexión después de la conexión inicial
mongoose.connection.on('error', err => {
    console.error('Error de conexión a MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB desconectado. Intentando reconectar...');
    connectDB();
});

// Cierre adecuado de la conexión
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Conexión a MongoDB cerrada debido a la terminación de la aplicación');
        process.exit(0);
    });
});

// Importar rutas
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const publicationRoutes = require('./src/routes/publications');
const categoryRoutes = require('./src/routes/categories');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/publications', publicationRoutes);
app.use('/api/categories', categoryRoutes);

// Ruta para manejar cualquier solicitud que no coincida con las rutas anteriores
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));