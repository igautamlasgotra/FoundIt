import { Router } from 'express';
import { ensureDb, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { writeLimiter } from '../middleware/rateLimit.js';
import {
  createItem,
  listItems,
  myItems,
  getItem,
  getItemMatches,
  updateItem,
  deleteItem,
  createItemSchema,
  updateItemSchema,
} from '../controllers/itemController.js';
import {
  createClaim,
  listItemClaims,
  markCollected,
  createClaimSchema,
} from '../controllers/claimController.js';

const router = Router();

// All item routes require the DB and a logged-in SMVDU user (community-only).
router.use(ensureDb, requireAuth);

router.route('/').get(listItems).post(writeLimiter, validate(createItemSchema), createItem);
router.get('/mine', myItems);
router.get('/:id/matches', getItemMatches);
router
  .route('/:id/claims')
  .get(listItemClaims)
  .post(writeLimiter, validate(createClaimSchema), createClaim);
router.post('/:id/collected', markCollected);
router
  .route('/:id')
  .get(getItem)
  .patch(validate(updateItemSchema), updateItem)
  .delete(deleteItem);

export default router;
