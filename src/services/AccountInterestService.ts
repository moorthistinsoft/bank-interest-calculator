import { Op, Sequelize } from "sequelize";
import { AccountInterestModel } from "../models/AccountInterestModel";
import { AccountModel } from "../models/AccountModel";
import AccountHistoryService from "./AccountHistoryService";

class AccountInterestService {
  constructor() {
  }

  // 
  async create(accountInterest: any) {
    return await AccountInterestModel.create(accountInterest);
  }

  async createInterestAccrued(accountInterest: any) {

    const balanceByDate = await AccountHistoryService.getCurrentBalanceByDate(accountInterest.accountId, accountInterest.accruedDate);
    let interestAccrued = await this.calculateInteresetForADay(balanceByDate, accountInterest.interestRate);

    return await AccountInterestModel.create({
      accountId: accountInterest.accountId,
      accountBalance: accountInterest.accountBalance,
      interestRate: accountInterest.interestRate,
      accruedDate: accountInterest.accruedDate,
      interestAccrued: interestAccrued
    });
  }

  async getTotalInterestAccruedForMonth(accoutId: number, month: number, year: number) {
    const dailyInterestsAccrued = await this.getDailyInterestAccrued(accoutId, month, year);

    let totalInterests = 0;
    if (dailyInterestsAccrued) {
      totalInterests = dailyInterestsAccrued.reduce((result, value) => result + value.dataValues.interestAccrued, 0);
      totalInterests = Math.round((totalInterests + Number.EPSILON) * 100) / 100;
    }

    return totalInterests;
  }

  async getDailyInterestAccrued(accountId: number, month: number,
    year: number): Promise<AccountInterestModel[]>  {

    const currentDate = new Date();
    let firstDayToAccrueInterest = new Date(year, month, 1);
    let lastDateToAccrueInterest = new Date(year, month + 1, 0);

    if (currentDate.getMonth() == month && currentDate.getFullYear() == year) {
      lastDateToAccrueInterest = new Date(year, month, currentDate.getDate() - 1);
    }

    const result = await AccountInterestModel.
      findAll({
        where: {
          accountId: accountId,
          accruedDate: {
            [Op.between]: [firstDayToAccrueInterest, lastDateToAccrueInterest]
          }
        },
        order: [['accruedDate', 'ASC']]
      });

    return result;
  }

  async createDailyInterestAccrued(
    account: AccountModel,
    month: number,
    year: number) {

    var currentDate = new Date();

    let firstDayToAccrueInterest = new Date(year, month, 1);
    let lastDateToAccrueInterest = new Date(year, month + 1, 0);

    if (currentDate.getMonth() == month && currentDate.getFullYear() == year) {
      lastDateToAccrueInterest = new Date(year, month, currentDate.getDate() - 1);
    }

    const dailyInterestsAccrued = await this.getDailyInterestAccrued(account.id, month, year);
    const lastAccountInterest = dailyInterestsAccrued ? dailyInterestsAccrued?.pop()?.dataValues : null;

    if (lastAccountInterest?.accruedDate) {
      firstDayToAccrueInterest = new Date(Date.parse(lastAccountInterest?.accruedDate));
      firstDayToAccrueInterest.setDate(firstDayToAccrueInterest.getDate() + 1)
    }

    let dayToAccureInterest = firstDayToAccrueInterest;

    while (dayToAccureInterest <= lastDateToAccrueInterest) {
      await this.createInterestAccrued({
        accountId: account.id,
        accountBalance: account.currentBalance,
        interestRate: account.currentInterestRate,
        accruedDate: dayToAccureInterest
      });
      console.log(dayToAccureInterest);
      dayToAccureInterest.setDate(dayToAccureInterest.getDate() + 1)
    }

    return true;
  }

  async calculateInteresetForADay(accountBalance: number, interestRate: number) {
    return (interestRate / 100) / 365 * accountBalance;
  }
}

export default new AccountInterestService();