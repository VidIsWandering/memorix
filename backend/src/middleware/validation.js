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

const validateUpdateUser = [
  body('username')
    .optional()
    .notEmpty()
    .trim()
    .withMessage('Username is required'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (!req.body.username && !req.body.email && !req.body.password) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'At least one field is required' }] });
    }
    return next();
  },
];

const validateDeck = [
  body('name')
    .notEmpty()
    .trim()
    .withMessage('Deck name is required'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
  body('is_public')
    .optional()
    .isBoolean()
    .withMessage('is_public must be boolean'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    return next();
  },
];

const validateFlashcard = [
  body('deck_id')
    .notEmpty()
    .withMessage('deck_id is required')
    .isInt({ min: 1 })
    .withMessage('deck_id must be a positive integer'),
  body('card_type')
    .notEmpty()
    .withMessage('card_type is required')
    .isIn(['two_sided', 'multiple_choice', 'fill_in_blank'])
    .withMessage('card_type must be one of: two_sided, multiple_choice, fill_in_blank'),
  body('content')
    .notEmpty()
    .withMessage('content is required')
    .isObject()
    .withMessage('content must be an object'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    return next();
  },
];

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
  validateUpdateUser,
  validateDeck,
  validateFlashcard,
  validateProgress,
  validateGroup,
  validateShare,
  validateDevice,
};
