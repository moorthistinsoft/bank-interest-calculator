import { Association, DataTypes, Model, Sequelize } from 'sequelize';
import db from '../config/database.config';
import { AccountHistoryModel } from './AccountHistoryModel';


export class AccountModel extends Model {
  public id: number;
  public userId: number;
	public currentBalance: number;
	public currentInterestRate: number;
  public createdAt: Date;
  public updatedAt: Date;
  public accountHistories: AccountHistoryModel;

  public static associations: { 
    accountHistories: Association<AccountModel, AccountHistoryModel>; 
  };
}

AccountModel.init(
	{
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currentBalance: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    currentInterestRate: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  },
	{
		sequelize: db,
		tableName: 'account',
	}
);

AccountModel.hasMany(AccountHistoryModel);