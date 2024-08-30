const { body, validationResult } = require('express-validator');
const { register } = require("./auth");

const validateRegister = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/\d/).withMessage('Password must contain a number')
        .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain a special character'),
];

const runValidation = async (req) => {
    await Promise.all(validateRegister.map(validation => validation.run(req)));
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

        await register(req, res);
    } catch (error) {
        console.error('Registration error:', error);
        res.status(522).json({ message: 'An error occurred during registration.' });
    }
};