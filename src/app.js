import express from 'express';
import healthRoutes from './routes/health.routes.js';
import logger from './middlewares/requestLogger.js';

const app = express();

app.use(express.json());

// Routes
app.use(logger);
app.use('/health', healthRoutes);

export default app;
