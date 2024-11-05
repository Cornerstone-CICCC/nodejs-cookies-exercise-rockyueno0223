"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const pageRouter = (0, express_1.Router)();
// In-memory database
let users = [
    { username: 'admin', password: 'admin12345' },
];
// Home route
pageRouter.get('/', (req, res) => {
    res.status(200).render('index');
});
// Login route
pageRouter.get('/login', auth_1.checkLoginAuth, (req, res) => {
    res.status(200).render('login');
});
// Process login route
pageRouter.post('/login', (req, res) => {
    const { username, password } = req.body;
    const found = users.find(user => user.username === username && user.password === password);
    if (found) {
        res.cookie('authToken', 'authenticated', {
            maxAge: 3 * 60 * 1000, // 3 minutes
            httpOnly: true,
            signed: true
        });
        res.cookie('user_info', JSON.stringify({
            username: found.username
        }), {
            maxAge: 3 * 60 * 1000,
            httpOnly: true
        });
        res.redirect('/profile');
    }
    else {
        res.redirect('/login');
    }
});
// Profile route
pageRouter.get('/profile', auth_1.checkAuth, (req, res) => {
    const { username } = JSON.parse(req.cookies.user_info); // Convert string to object
    res.status(200).render('profile', { username });
});
// Logout Route
pageRouter.get('/logout', (req, res) => {
    res.clearCookie('authToken');
    res.clearCookie('user_info');
    res.redirect('/login');
});
exports.default = pageRouter;
