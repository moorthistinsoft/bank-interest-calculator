import express from 'express';
import AccountController from '../controllers/AccountController';

const router = express.Router();

router.post('/create', AccountController.createAccount);
router.get('/getInterestAccrued/:userId', AccountController.getInterestAccrued);
router.delete('/deleteAllInterestAccrues', AccountController.deleteAllInterestAccrued);

export default router;