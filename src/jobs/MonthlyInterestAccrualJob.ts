import AccountInterestService from "../services/AccountInterestService";
import AccountService from "../services/AccountService";

class DailyInterestAccrualJob {

  /*
    sample code, not tested
    get all accounts and calculate interest accured monthly 
    This job will be called first of every month at 12:00 to calculate interest and add to balance
  // 
  */
  async perform() {

    const accounts: Array<any> = await AccountService.getAll();

    accounts.forEach(async (account: any) => {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      const totalInterestForMonth = await AccountInterestService.
        getTotalInterestAccruedForMonth(account.datavalues.id, date.getMonth(), date.getFullYear());

      AccountService.deposit(account.datavalues.userId, totalInterestForMonth, "INTERET_ACCURED");

    });
  }
}