import express from 'express';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import tasksRoutes from './routes/tasks.routes.js';
import logger from './middlewares/requestLogger.js';
import 'dotenv/config';

const app = express();

app.use(express.json());

// Routes
app.use(logger);
app.use('/health', healthRoutes);
app.use('/tasks', tasksRoutes);
app.use('/auth', authRoutes);

export default app;
