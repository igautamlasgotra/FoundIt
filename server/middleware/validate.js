import { ApiError } from './error.js';

// Validation middleware factory using a Zod schema.
// Usage: router.post('/login', validate(loginSchema), controller)
// On success it replaces req.body with the parsed (and coerced/trimmed) data.
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const details = result.error.issues.map((i) => ({
      field: i.path.join('.'),
      message: i.message,
    }));
    return next(new ApiError(400, 'Validation failed', details));
  }
  req.body = result.data;
  next();
};
