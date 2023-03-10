import { now } from 'sequelize/types/utils';
import { AccountModel } from "../models/AccountModel";
import AccountHistoryService from "./AccountHistoryService";
import AccountInterestService from './AccountInterestService';

class AccountService {
  constructor() {
  }

  async create(account: any) {
    const accountFromDB: AccountModel = await AccountModel.create(account);

    if (accountFromDB) {
      await AccountHistoryService.create(
        accountFromDB.id,
        accountFromDB.dataValues.currentBalance,
        accountFromDB.dataValues.currentBalance,
        'DEPOSIT');
    }
    return accountFromDB;
  }

  async getInterestAccrued(userId: number, monthFromParam?: number, yearFromParam?: number) {
    try {
      const account: AccountModel | null = await AccountModel.findOne({ where: { userId: userId } });
      const now = new Date();
      const month = monthFromParam ? monthFromParam : now.getMonth();
      const year =  yearFromParam ? yearFromParam : now.getFullYear();

      if (account) {
        // In real time, daily job runs at night and calculates and creates the AccountInterest for the day
        // this call will not be required in realtime
        await AccountInterestService.createDailyInterestAccrued(account.dataValues, month, year);

        // get total accruted interests for the month
        return await AccountInterestService.getTotalInterestAccruedForMonth(account.dataValues.id, month, year);
      } else {
        return 0;
      }
    } catch (e) {
      console.log(e)
      return false;
    }
  }

  async deposit(userId: number, ammount: number) {

    // consider we have one account for user at this moment

    const account: AccountModel | null = await AccountModel.findOne({ where: { userId: userId } });

    if (account) {
      account.currentBalance = account.dataValues.currentBalance + ammount;
      account.updatedAt = new Date();
      await account.save();

      await AccountHistoryService.create(account.id, ammount, account.currentBalance, 'DEPOSIT');
    }

    return true;
  }

  // consider we have one account for user at this moment
  async withdraw(userId: number, ammount: number) {

    const account: AccountModel | null = await AccountModel.findOne({ where: { userId: userId } });

    if (account) {
      const newBalance = account.dataValues.currentBalance - ammount;

      if (newBalance < 0) {
        throw new Error("Invalid operation");
      }

      account.currentBalance = newBalance;
      account.updatedAt = new Date();
      await account.save();

      await AccountHistoryService.create(account.dataValues.id, ammount, newBalance, 'WITHDRAW');
    }

    return true;
  }
}

export default new AccountService();