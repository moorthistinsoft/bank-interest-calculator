import { Association, DataTypes, Model, Sequelize } from 'sequelize';
import db from '../config/database.config';
import { AccountModel } from './AccountModel';

export class AccountInterestModel extends Model {
	id: number;
  accountId: number;
	accountBalance: number;
	interestRate: number;
	interestAccrued: number;
	accruedDate: Date;
	createdAt: Date;

  public account: AccountModel;

  public static associations: { 
    account: Association<AccountInterestModel, AccountModel>; 
  };
}

AccountInterestModel.init(
	{
		id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    accountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
		accountBalance: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0,
    },
    interestRate: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0,
    },
    interestAccrued: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0,
    },
    accruedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
	},
	{
		sequelize: db,
		tableName: 'accountInterest',
	}
);