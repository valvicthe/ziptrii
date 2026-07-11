const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// Pull routes from the local directory
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const gameRoutes = require('./routes/games');

// Subdomain interceptor middleware
app.use((req, res, next) => {
    const host = req.headers.host || '';
    
    if (host.startsWith('auth.')) {
        return authRoutes(req, res, next);
    } else if (host.startsWith('users.')) {
        return userRoutes(req, res, next);
    } else if (host.startsWith('games.')) {
        return gameRoutes(req, res, next);
    }
    next();
});

// Serve the static frontend assets if accessing the main domain (ziptrii.xyz)
app.use(express.static(path.join(__dirname, '../../frontend/public')));

// Render the 2020 layout homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/views/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`[Ziptrii] Monorepo online on port ${PORT}`));
