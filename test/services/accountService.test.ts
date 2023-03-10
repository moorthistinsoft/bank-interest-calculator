import request from "supertest";
import { AccountInterestModel } from "../../src/models/AccountInterestModel";
import AccountService from "../../src/services/AccountService";
import db from '../../src/config/database.config'
import { AccountModel } from "../../src/models/AccountModel";

describe("Account Interest Accrued", () => {

  const initialInvestment = 10000;
  const initialInterestRate = 2;
  let startDay = new Date(2023, 0, 1);

  beforeAll(async () => {
    await db.sync({ force: true });
  })

  beforeEach(async () => {
    startDay = new Date(2023, 0, 1);
    jest.useFakeTimers().setSystemTime(startDay);
  })

  test("When investment with $10,000", async () => {

    const userId = 1;
    const account = await AccountService.create({
      "currentBalance": initialInvestment,
      "userId": userId,
      "currentInterestRate": initialInterestRate
    });

    expect(account.dataValues.userId).toBe(userId);

    jest.useRealTimers();

    const interestAccrued = await AccountService.getInterestAccrued(userId, startDay.getMonth(), startDay.getFullYear());
    expect(interestAccrued).toBe(16.99);
  })

  test("When investment with $10,000 add $5000 on Jan 5th, 2023", async () => {

    const userId = 2;
    let account: any = await AccountService.create({
      "currentBalance": initialInvestment,
      "userId": userId,
      "currentInterestRate": initialInterestRate
    });

    expect(account.dataValues.userId).toBe(userId);

    startDay.setDate(startDay.getDate() + 4);
    jest.useFakeTimers().setSystemTime(startDay);

    // deposit $5000 on Jan 5
    await AccountService.deposit(userId, 5000);

    account = await AccountService.get(account.id);
    expect(account.dataValues.currentBalance).toBe(15000);

    jest.useRealTimers();

    const interestAccrued = await AccountService.getInterestAccrued(userId, startDay.getMonth(), startDay.getFullYear());
    expect(interestAccrued).toBe(24.38);
  })

  test("When investment with $10, 000 withdraw $5000 on Jan 5th, 2023", async () => {

    const userId = 3;
    let account: any = await AccountService.create({
      "currentBalance": initialInvestment,
      "userId": userId,
      "currentInterestRate": initialInterestRate
    });

    expect(account.dataValues.userId).toBe(userId);

    startDay.setDate(startDay.getDate() + 4);
    jest.useFakeTimers().setSystemTime(startDay);

    // withdraw $5000 on Jan 5
    await AccountService.withdraw(userId, 5000);

    account = await AccountService.get(account.id);
    expect(account.dataValues.currentBalance).toBe(5000);

    jest.useRealTimers();

    const interestAccrued = await AccountService.getInterestAccrued(userId, startDay.getMonth(), startDay.getFullYear());
    expect(interestAccrued).toBe(9.59);
  })

  test("When investment with $10, 000 add $5000 on Jan 15th, 2023 and withdraw $5000 on Jan 27, 2023", async () => {

    const userId = 4;
    let account: any = await AccountService.create({
      "currentBalance": initialInvestment,
      "userId": userId,
      "currentInterestRate": initialInterestRate
    });

    expect(account.dataValues.userId).toBe(userId);

    // deposit $5000 on Jan 15
    startDay.setDate(startDay.getDate() + 14);
    jest.useFakeTimers().setSystemTime(startDay);
    await AccountService.deposit(userId, 5000);

    account = await AccountService.get(account.id);
    expect(account.dataValues.currentBalance).toBe(15000);

    // withdraw $5000 on Jan 27
    startDay.setDate(startDay.getDate() + 12);
    jest.useFakeTimers().setSystemTime(startDay);
    await AccountService.withdraw(userId, 5000);

    account = await AccountService.get(account.dataValues.id);
    expect(account.dataValues.currentBalance).toBe(10000);

    jest.useRealTimers();

    const interestAccrued = await AccountService.getInterestAccrued(userId, startDay.getMonth(), startDay.getFullYear());
    expect(interestAccrued).toBe(20.27);
  })

});
