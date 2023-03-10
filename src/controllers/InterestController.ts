import { Request, Response } from 'express';

export class InterestController {
  constructor() {
      this.getInterestAcquired = this.getInterestAcquired.bind(this);
  }

  getInterestAcquired(req: Request, res: Response) {
    return res.send("hello World");
  }
}