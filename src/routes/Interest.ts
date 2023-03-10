import express, { Request, Response } from 'express';
import { InterestController } from '../controllers/InterestController';

const router = express.Router();
const interestController = new InterestController();

router.get('/', interestController.getInterestAcquired);


router.get('/', );


export default router;