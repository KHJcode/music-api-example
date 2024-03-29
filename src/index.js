import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

import { sequelize } from './models';
import musicRouter from './routes/music';


dotenv.config();

const app = express();

const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

app.set('port', isProd ? process.env.PORT : '6060');

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('DB connected!');
  })
  .catch(err => {
    console.error(err);
  });

if (isProd || isTest) {
  app.use(hpp());
  app.use(helmet());
  app.use(cors());
}

app.use(morgan(isProd ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

app.use('/music', musicRouter);

app.get('*', (err, res, req, next) => {
  console.log(err);
  res.status(500).json('error');
});

app.get('/', (req, res, next) => {
  res.status(200).json('server is test.');
});

app.listen(app.get('port'), () => {
  console.log(`Server is running on port ${app.get('port')}.`);
});
