import { now } from 'sequelize/types/utils';
import { AccountModel } from "../models/AccountModel";
import AccountHistoryService from "./AccountHistoryService";
import AccountInterestService from './AccountInterestService';

class AccountService {
  constructor() {
  }

  /*
  Create new account for user
  Assume user already created and exists
  @param: account: any - Account details
  */
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

  async get(account_id: number) {
    return await AccountModel.findByPk(account_id);
  }

  async getAll() {
    return await AccountModel.findAll();
  }

  /*
  Get Accrued interests for given month
   @param: userId
   @param: month to calculate interest Accured
   @param: year to calculate interest Accured
  */
  async getInterestAccrued(userId: number, monthFromParam?: number, yearFromParam?: number) {
    try {
      const account: AccountModel | null = await AccountModel.findOne({ where: { userId: userId } });
      const now = new Date();
      const month = monthFromParam != null ? monthFromParam : now.getMonth();
      const year = yearFromParam != null ? yearFromParam : now.getFullYear();

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

  /*
  Consider we have one account for user at this moment
  Deposit to bank account
  @param: userId - user to deposit amount
  @param: amount: amount to deposit
  */
  async deposit(userId: number, ammount: number, type: string = 'DEPOSIT') {
    const account: AccountModel | null = await AccountModel.findOne({ where: { userId: userId } });

    if (account) {
      const newBalance = account.dataValues.currentBalance + ammount;
      await account.update({
        currentBalance: newBalance,
        updatedAt: new Date(),
      });

      await AccountHistoryService.create(account.dataValues.id, ammount, newBalance, type);
    }

    return true;
  }

  /*
 // consider we have one account for user at this moment
 Withdraw from bank account
 @param: userId - user to withdraw amount
 @param: amount: amount to withdraw
 */
  async withdraw(userId: number, ammount: number) {

    const account: AccountModel | null = await AccountModel.findOne({ where: { userId: userId } });

    if (account) {
      const newBalance = account.dataValues.currentBalance - ammount;

      if (newBalance < 0) {
        throw new Error("Invalid operation");
      }

      await account.update({
        currentBalance: newBalance,
        updatedAt: new Date(),
      });

      await AccountHistoryService.create(account.dataValues.id, ammount, newBalance, 'WITHDRAW');
    }

    return true;
  }
}

export default new AccountService();