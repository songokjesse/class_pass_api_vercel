const { authenticateToken } = require("./auth");

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const user = await authenticateToken(req);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // In a real-world scenario, you might want to blacklist the token here
        // This would require maintaining a blacklist of tokens in your database or a cache like Redis
        // await blacklistToken(req.user.token);

        res.status(204).send();
    } catch (error) {
        console.error('Logout error:', error);
        res.status(422).json({ message: 'An error occurred during logout.' });
    }
};