import express from 'express';
import bookCtrl from '../controllers/book.controller';
import config from '../../config/config';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')

  /** GET /api/books - Fetches lib books */
  .get(bookCtrl.getLibBooks);

router.route('/testbuy')

/** GET /api/books - Fetches lib books */
  .post(bookCtrl.buySomeBooksTest);

router.route('/admin')
  /** GET /api/books/admin - Fetches publisher books  */
  .get(bookCtrl.getAllPubBooks)

export default router;
