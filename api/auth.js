const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./db/db');
const { users } = require('./db/schema');
const { eq } = require('drizzle-orm');

const authenticateToken = async (req) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return null;

    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
};

const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (existingUser.length > 0) {
            return res.status(422).json({ message: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [newUser] = await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
        }).returning();

        res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(422).json({ message: 'An error occurred during registration' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(422).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(422).json({ message: 'An error occurred during login' });
    }
};

module.exports = { authenticateToken, register, login };