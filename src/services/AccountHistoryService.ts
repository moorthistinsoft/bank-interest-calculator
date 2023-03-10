import { Op } from "sequelize";
import { AccountHistoryModel } from "../models/AccountHistoryModel";

class AccountHistoryService {
  constructor() {
  }


  /*
  Create hsitory for each accont activity (DEPOSIT, WITHDRAW, INTERET_ACCURED etc)
   @param: accountId - user's account id
   @param: amount for the activity
   @param: currentBalance after this activity
  */
  async create(accountId: number, amount: number, currentBalance: number, activityType: string) {
    const accountHistory: any = {
      accountId,
      amount,
      currentBalance,
      activityType,
      createdAt: new Date()
    }
    return await AccountHistoryModel.create(accountHistory);
  }

  /*
  Get the balance as of the giving date for the account
  @param: accountId - user's account id
  @param: date - balance as of the date to calculate interest
 */
  async getCurrentBalanceByDate(accountId: number, date: Date) {

    const dateForQuery = new Date(date.getTime());
    dateForQuery.setHours(23, 59, 59, 999);

    const result = await AccountHistoryModel.
      findOne({
        where: {
          accountId: accountId,
          createdAt: {
            [Op.lte]: dateForQuery
          }
        },
        order: [['createdAt', 'DESC']]
      });

    const balance = (result ? result.dataValues.currentBalance : 0);

    return balance;
  }
}

export default new AccountHistoryService();