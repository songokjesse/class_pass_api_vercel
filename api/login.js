const { body, validationResult } = require('express-validator');
const { login } = require("./auth");

const validateLogin = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
];

const runValidation = async (req) => {
    await Promise.all(validateLogin.map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errors.array();
    }
    return null;
};

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const errors = await runValidation(req);
        if (errors) {
            return res.status(422).json({ errors });
        }

        await login(req, res);
    } catch (error) {
        console.error('Login error:', error);
        res.status(422).json({ message: 'An error occurred during login.' });
    }
};