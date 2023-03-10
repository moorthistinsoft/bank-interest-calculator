import { Op } from "sequelize";
import { AccountHistoryModel } from "../models/AccountHistoryModel";

class AccountHistoryService {
  constructor() {
  }

  async create(accountId: number, amount: number, currentBalance: number, activityType: string) {
    const accountHistory: any = {
      accountId,
      amount,
      currentBalance,
      activityType
    }
   return await AccountHistoryModel.create(accountHistory);
  }

  async getCurrentBalanceByDate(accountId: number, date: Date) {

    date.setHours(23, 59, 59, 999);

    const result = await AccountHistoryModel.
      findOne({
        where: {
          accountId: accountId,
          createdAt: {
            [Op.lte]: [date]
          }
        },
        order: [['createdAt', 'DESC']]
      });

    return (result ? result.dataValues.currentBalance : 0);
  }
}

export default new AccountHistoryService();