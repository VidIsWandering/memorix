import { body, validationResult } from 'express-validator';

const validatePhone = (phone) => {
  if (!phone) return true; // Phone is optional
  const phoneRegex = /^\+?[\d\s-]+$/;
  return phoneRegex.test(phone);
};

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
    const { username, email, password, phone } = req.body;
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ error: 'Valid username is required' });
    }
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 6 characters long' });
    }
    if (phone && !validatePhone(phone)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
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
  body('phone')
    .optional()
    .custom(validatePhone)
    .withMessage('Invalid phone number format'),
  body('image_url').optional().isURL().withMessage('Invalid image URL format'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (
      !req.body.username &&
      !req.body.email &&
      !req.body.password &&
      !req.body.phone &&
      !req.body.image_url
    ) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'At least one field is required' }] });
    }
    return next();
  },
];

const validateDeck = [
  body('name').notEmpty().trim().withMessage('Deck name is required'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
  body('is_public')
    .optional()
    .isBoolean()
    .withMessage('is_public must be boolean'),
  body('image_url')
    .optional()
    .isURL()
    .withMessage('image_url must be a valid URL'),
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
    .optional()
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

    const { card_type, content } = req.body;

    const isNonEmptyString = (str) =>
      typeof str === 'string' && str.trim().length > 0;

    switch (card_type) {
      case 'two_sided':
        if (!isNonEmptyString(content.front) || !isNonEmptyString(content.back)) {
          return res.status(400).json({
            error: 'content must include non-empty "front" and "back" strings for two_sided card',
          });
        }
        break;

      case 'multiple_choice':
        if (
          !isNonEmptyString(content.question) ||
          !Array.isArray(content.options) ||
          content.options.length !== 4 ||
          !isNonEmptyString(content.answer) ||
          !content.options.includes(content.answer)
        ) {
          return res.status(400).json({
            error:
              'multiple_choice content must have: "question" (string), exactly 4 "options", and "answer" (string in options)',
          });
        }
        break;

      case 'fill_in_blank':
        if (
          !isNonEmptyString(content.text) ||
          !content.text.includes('_') ||  // chỉ cần có ít nhất 1 dấu _
          !isNonEmptyString(content.answer)
        ) {
          return res.status(400).json({
            error:
              'fill_in_blank content must have "text" (string containing at least one "_") and non-empty "answer"',
          });
        }
        break;
    }

    return next();
  },
];


const validateProgress = [
  body('flashcard_id')
    .isInt({ min: 1 })
    .withMessage('flashcard_id must be a positive integer'),
  body('rating')
    .isIn(['again', 'hard', 'good', 'easy'])
    .withMessage('rating must be one of: again, hard, good, easy'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
const validateGroup = (_req, res, next) => {
  return next();
};

const validateShare = [
  body('deck_id')
    .isInt({ min: 1 })
    .withMessage('deck_id must be a positive integer'),
  body('receiver_email')
    .isEmail()
    .normalizeEmail()
    .withMessage('receiver_email must be a valid email'),
  body('permission_level')
    .notEmpty()
    .isString()
    .withMessage('permission_level is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    return next();
  },
];

const validateDevice = [
  body('fcm_token')
    .notEmpty()
    .withMessage('FCM token is required')
    .isString()
    .withMessage('FCM token must be a string'),
  body('device_name')
    .optional()
    .isString()
    .withMessage('Device name must be a string'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    return next();
  },
];

const validateChangePassword = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || typeof currentPassword !== 'string') {
    return res.status(400).json({ error: 'Current password is required' });
  }

  if (
    !newPassword ||
    typeof newPassword !== 'string' ||
    newPassword.length < 6
  ) {
    return res
      .status(400)
      .json({ error: 'New password must be at least 6 characters long' });
  }

  next();
};

const validateForgotPassword = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateResetPassword = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

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
  validateChangePassword,
  validateForgotPassword,
  validateResetPassword,
};
