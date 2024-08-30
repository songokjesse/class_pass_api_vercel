const { authenticateToken } = require("./auth");
const db = require('./db/db');
const { users } = require("./db/schema");

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(422).json({ message: 'Method Not Allowed' });
    }

    try {
        const user = await authenticateToken(req);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const allUsers = await db.select().from(users);
        res.json(
            allUsers.map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
            }))
        );
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(422).json({ message: 'An error occurred while fetching users.' });
    }
};