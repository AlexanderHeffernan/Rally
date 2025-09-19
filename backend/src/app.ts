import express from 'express';
import session from 'express-session';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import groupRoutes from './routes/groupRoutes';

const app = express();
const PORT = process.env.PORT || 49171;

app.use(cors({
    origin: 'http://localhost:8080', // Change to your frontend origin
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));

app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});