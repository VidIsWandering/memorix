import { body, validationResult } from 'express-validator';

const validateRegister = [
  body('username').notEmpty().trim().withMessage('Username is required'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    return next();
  },
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    return next();
  },
];

const validateDeck = (_req, res, next) => {
  // eslint-disable-next-line no-unused-vars
  return next();
};

const validateFlashcard = (_req, res, next) => {
  // eslint-disable-next-line no-unused-vars
  return next();
};

const validateProgress = (_req, res, next) => {
  // eslint-disable-next-line no-unused-vars
  return next();
};

const validateGroup = (_req, res, next) => {
  // eslint-disable-next-line no-unused-vars
  return next();
};

const validateShare = (_req, res, next) => {
  // eslint-disable-next-line no-unused-vars
  return next();
};

const validateDevice = (_req, res, next) => {
  // eslint-disable-next-line no-unused-vars
  return next();
};

export default {
  validateRegister,
  validateLogin,
  validateDeck,
  validateFlashcard,
  validateProgress,
  validateGroup,
  validateShare,
  validateDevice,
};
