import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import accountsRoutes from './routes/accounts.js';

const app = express();
app.use(express.static('frontend/dist'));

app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Move CORS and logging ABOVE your routes
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

app.use('/auth', authRoutes);
app.use('/accounts', accountsRoutes);

app.get('*', (req, res) => {
    res.sendFile('index.html', { root: 'frontend/dist' });
});

