import AccountInterestService from "../services/AccountInterestService";
import AccountService from "../services/AccountService";

class DailyInterestAccrualJob {

  /*
    sample code, not tested
    get all accounts and calculate interest accured daily
    This job will be called eveyday at 12:00 to calculate previous day's interest and save
  // 
  */
  async perform() {

    const accounts: Array<any> = await AccountService.getAll();

    accounts.forEach(async (account: any) => {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      await AccountInterestService.createInterestAccrued({
        // TODO
      });
    })

  }
}