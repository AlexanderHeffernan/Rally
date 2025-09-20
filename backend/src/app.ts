import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import groupRoutes from './routes/groupRoutes';

// Load environment variables from .env files
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 49171;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:8080';
const SESSION_SECRET = process.env.SESSION_SECRET as string || 'default_secret_key';

// Setup CORS
app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true
}));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup session management
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});