import { Request, Response } from 'express';
import { AccountHistoryModel } from '../models/AccountHistoryModel';
import { AccountInterestModel } from '../models/AccountInterestModel';
import { AccountModel } from '../models/AccountModel';
import AccountInterestService from '../services/AccountInterestService';
import AccountService from '../services/AccountService';

class AccountController {

  async createAccount(req: Request, res: Response) {
    try {
      const account = await AccountService.create({ ...req.body });
      return res.json({ account, msg: 'success' })
    } catch (e) {
      console.log(e);
      return res.json({ msg: 'error' })
    }
  }

  async getInterestAccrued(req: Request, res: Response) {
    try {
    let interestAccrued: number = 0;

    if (req.query.month && req.query.year) {
      interestAccrued = await AccountService.
          getInterestAccrued(parseInt(req.params.userId), parseInt(req.query.month.toString()), parseInt(req.query.year.toString()));
    } else {
      interestAccrued = await AccountService.getInterestAccrued(parseInt(req.params.userId));
    }
     
      return res.json({ interestAccrued: interestAccrued, msg: 'success' })
    } catch (e: any) {
      console.log(e);
      return res.json({ msg: e.message })
    }
  }

  async deleteAllInterestAccrued(req: Request, res: Response) {
    try {
      AccountHistoryModel.drop();
      AccountInterestModel.drop();
      AccountModel.drop();
      return res.json({ msg: 'success' })
    } catch (e) {
      console.log(e);
      return res.json({ msg: 'error' })
    }
  }
}

export default new AccountController();