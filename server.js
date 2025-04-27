import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { router as chatRoutes } from './routes/chatRoutes.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config();

// Verificar configuración de OpenAI
if (!process.env.OPENAI_API_KEY) {
  console.warn('\x1b[33m%s\x1b[0m', '⚠️  ADVERTENCIA: No se encontró la variable OPENAI_API_KEY');
  console.log('\x1b[36m%s\x1b[0m', 'Para configurar la API key de OpenAI:');
  console.log('1. Crea un archivo .env en la carpeta backend');
  console.log('2. Añade la línea: OPENAI_API_KEY=tu-api-key-de-openai');
  console.log('3. Reinicia el servidor\n');
  
  // Verificar si existe el archivo .env
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.log('\x1b[31m%s\x1b[0m', 'No se encontró el archivo .env');
  }
}

// Verificar si el archivo .env fue cargado correctamente
if (!process.env.PORT || !process.env.MONGODB_URI) {
  console.error('\x1b[31m%s\x1b[0m', '❌ Error: No se cargaron las variables de entorno correctamente. Verifica el archivo .env.');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 6000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 6000;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => {
    console.error('❌ Error de conexión a MongoDB:', err);
    process.exit(1);
  });

// Rutas
app.use('/api/chat', chatRoutes);

// Ruta para probar el servidor
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de ChatGPT funcionando correctamente',
    status: 'OpenAI configurado con clave fija en el controlador'
  });
});

export const handler = serverless(app);