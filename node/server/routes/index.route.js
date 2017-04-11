import express from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import bookRoutes from './book.route';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount book routes at /books
router.use('/books', bookRoutes);

router.get('/statistics', fetchStatistics);

const fetchStatistics = () => {
  return 0;
}

export default router;
