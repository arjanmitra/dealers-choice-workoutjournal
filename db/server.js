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

app.get('/users', async (req, res, next) => {
  try {
    const users = await Users.findAll();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await Users.findAll({
      where: {
        id: req.params.id,
      },
    });
    res.send(user);
  } catch (error) {
    next(error);
  }
});

app.get('/users/:id/days', async (req, res, next) => {
  try {
    const userDays = await Users.findAll({
      include: Day,
      where: {
        id: req.params.id,
      },
    });
    res.send(userDays[0].days);
  } catch (error) {
    next(error);
  }
});

app.get('/users/:id/days/:date', async (req, res, next) => {
  try {
    const userDate = await Users.findAll({
      include: [
        {
          model: Day,
          where: { date: req.params.date },
        },
      ],
      where: {
        id: req.params.id,
      },
    });
    res.send(userDate);
  } catch (error) {
    next(error);
  }
});

app.get('/users/:id/days/:date/workouts', async (req, res, next) => {
  try {
    const userWorkouts = await Users.findAll({
      include: [
        {
          model: Day,
          where: { date: req.params.date },
          include: [
            {
              model: Workouts,
              include: Exercises,
            },
          ],
        },
      ],
      where: {
        id: req.params.id,
      },
    });
    res.send(userWorkouts[0].days[0].workouts);
  } catch (error) {
    next(error);
  }
});

app.get('/users/:id/days/:date/meals', async (req, res, next) => {
  try {
    const userMeals = await Users.findAll({
      include: [
        {
          model: Day,
          where: { date: req.params.date },
          include: [
            {
              model: Meals,
              include: Foods,
            },
          ],
        },
      ],
      where: {
        id: req.params.id,
      },
    });
    res.send(userMeals[0].days[0].meals);
  } catch (error) {
    next(error);
  }
});
