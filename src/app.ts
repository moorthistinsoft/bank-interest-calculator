import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import interestRoute from './routes/Interest';
import accountRoute from './routes/AccountRoute'
import db from './config/database.config'

const app = express();

app.use(express.json());

const middleware = (req: Request, res: Response, next: NextFunction) => {
  console.log('Request Method:', req.method);
  console.log('Request Path Params:', req.params);
  console.log('Request Query Params:', req.query);
  console.log('Request Body:', req.body);

  next();
}

db.sync().then(() => {
	console.log("connect to db");
});

app.use(middleware);
app.use(helmet());
app.use("/api/interest", interestRoute);
app.use("/api/account", accountRoute);


app.listen(3000, () => {
  console.log("Applicaiton listening at http://localhost:3000");
});
