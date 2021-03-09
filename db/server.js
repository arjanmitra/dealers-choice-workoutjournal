const {
  init,
  db,
  models: { Users, Day, Workouts, Exercises, Meals, Foods, FoodGroups },
} = require('./db');
const morgan = require('morgan');
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

init();
const serverInit = () => {
  try {
    app.listen(port, () => console.log(`listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};
serverInit();

app.use(morgan('dev'));
app.use('/dist', express.static(path.join(__dirname, '../dist')));
app.use('/public', express.static(path.join(__dirname, '../public')));

app.get('/', async (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, '../index.html'));
  } catch (error) {
    next(error);
  }
});
