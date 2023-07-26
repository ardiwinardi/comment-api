import { ConnectOptions } from 'mongoose';
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME
} from './config';

type DatabaseConnectionProps = {
  url: string;
  options: ConnectOptions;
};

export const databaseConnection: DatabaseConnectionProps = {
  url: `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
  options: {
    autoIndex: true, // build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    authSource: 'admin'
  }
};
