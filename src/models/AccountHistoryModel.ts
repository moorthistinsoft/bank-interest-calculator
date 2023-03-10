import { Association, DataTypes, Model, Sequelize } from 'sequelize';
import db from '../config/database.config';
import { AccountModel } from './AccountModel';


export class AccountHistoryModel extends Model {

  id: number;
  accountId: number;
	activityType: string;
	amount: number;
  currentBalance: number;
  createdAt: Date;
  public account: AccountModel;

  public static associations: { 
    account: Association<AccountHistoryModel, AccountModel>; 
  };
}

AccountHistoryModel.init(
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
      references: {
        model: 'account',
        key: 'id'
      }
    },
    activityType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    currentBalance: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  },
	{
		sequelize: db,
		tableName: 'accountHistory',
	}
);