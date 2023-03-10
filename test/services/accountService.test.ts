import { describe } from "node:test";
import request from "supertest";
import AccountService from "../../src/services/AccountService";
import db from '../config/test-database.config'

describe("Account Interest Accrued", () => {

  const initialInvestment = 10000;
  const initialInterestRate = 2;
  const startDay = new Date(2023, 0, 1);

  beforeEach(async () => {
    // jest.setTimeout(600000);
    jest.useFakeTimers().setSystemTime(startDay);
    await db.sync({ force: true }).then(() => {
      console.log("connect to test db");
    });

   
  })

  test("Basic Investment", async() => {

    console.log('startDay: ', startDay);
    const userId = 1;
    const account = await AccountService.create({ 
      "currentBalance": initialInvestment,
      "userId": userId,
      "currentInterestRate": initialInterestRate
     });

     console.log(account.dataValues);

     expect(account.dataValues.userId).toBe(userId);

    jest.useRealTimers();

    const interestAccrued = await AccountService.getInterestAccrued(userId, startDay.getMonth() - 1, startDay.getFullYear());
    console.log('interestAccrued: ', interestAccrued);
    expect(interestAccrued).toBe(16.99);
  })

});