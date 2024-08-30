const { authenticateToken } = require("./auth");

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const user = await authenticateToken(req);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error in /user route:', error);
        res.status(500).json({ message: 'An error occurred' });
    }
};