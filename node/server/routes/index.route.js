import express from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import bookRoutes from './book.route';
import { libAddress, libInstance, libChainInstance} from '../../index';
import { getAllPublishers } from '../controllers/book.controller';

const router = express.Router(); // eslint-disable-line new-cap

const fetchStatistics = (req, res) => {
  let publishers = getAllPublishers()
  Promise.all(publishers).then((publisherInstances) => {
    let pubMetrics = Promise.map(publisherInstances, (publisherInstance => {
      return publisherInstance.getMetrics.call()
    }))
    let libMetrics = libInstance.getMetrics.call()

    return [pubMetrics, libMetrics]
  })
  .then((metricsPromises) => {
    return Promise.all(metricsPromises)
  })
  .then(metrics => {
    console.log(metrics)
    let publisherMetrics = metrics[0].map(publisherMetric => {
      return {
        soldInstances: publisherMetric[0],
        books: publisherMetric[1],
        name: publisherMetric[2]
      }
    })

    let libraryMetrics = {
      boughtInstances: metrics[1][0],
      loans: metrics[1][1],
      returns: metrics[1][2],
      name: metrics[1][3]
    }

    res.json({
      publishers: publisherMetrics,
      library: libraryMetrics
    })
  })
}

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


export default router;
