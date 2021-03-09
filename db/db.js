const {
  Sequelize,
  STRING,
  INTEGER,
  DATE,
  INET,
  MEDIUMINT,
  ExclusionConstraintError,
} = require('sequelize');
const db = new Sequelize(
  process.env.DATABASE_URL ||
    'postgres://localhost/dealers-choice-workoutjournal'
);

const Users = db.define('users', {
  name: {
    type: STRING,
    allowNull: false,
  },
  age: {
    type: INTEGER,
    allowNull: false,
  },
  location: {
    type: STRING,
    allowNull: false,
  },
});

const Day = db.define('days', {
  date: {
    type: DATE,
    allowNull: false,
  },
});

const Workouts = db.define('workouts', {
  name: {
    type: STRING,
    allowNull: false,
  },
  duration: {
    type: INTEGER,
    allowNull: false,
  },
});

const Exercises = db.define('exercises', {
  name: {
    type: STRING,
    allowNull: false,
  },
});

const Meals = db.define('meals', {
  name: {
    type: STRING,
    allowNull: false,
  },
  contents: {
    type: STRING,
    allowNull: false,
  },
  totalCalories: {
    type: INTEGER,
    allowNull: false,
  },
});

const Foods = db.define('foods', {
  name: {
    type: STRING,
    allowNull: false,
  },
  type: {
    type: STRING,
    allowNull: false,
  },
  calories: {
    type: INTEGER,
    allowNull: false,
  },
});

Users.hasMany(Day);
Day.belongsTo(Users);

Day.hasMany(Workouts);
Workouts.belongsTo(Day);

Workouts.belongsToMany(Exercises, { through: 'Workouts_Exercises' });
Exercises.belongsToMany(Workouts, { through: 'Workouts_Exercises' });

Day.hasMany(Meals);
Meals.belongsTo(Day);

Meals.belongsToMany(Foods, { through: 'Meals_Foods' });
Foods.belongsToMany(Meals, { through: 'Meals_Foods' });

const seed = async () => {
  try {
    const arjan = await Users.create({
      name: 'arjan',
      age: 26,
      location: 'toronto',
    });
    const [march9, march10, march11] = await Promise.all(
      ['march9', 'march10', 'march11'].map((date) =>
        Day.create({ date: date + ',2020', userId: arjan.id })
      )
    );
    const [march9workout, march10workout, march11workout] = await Promise.all(
      ['5k + biceps', 'Morning Run + Shoulders', '5k + chest'].map((workout) =>
        Workouts.create({ name: workout, duration: 1 })
      )
    );
    march9workout.dayId = march9.id;
    march9workout.save();
    march10workout.dayId = march10.id;
    march10workout.save();
    march11workout.dayId = march11.id;
    march11workout.save();

    const [
      running,
      swimming,
      biking,
      shoulders,
      abs,
      chest,
      triceps,
      back,
      biceps,
      legs,
    ] = await Promise.all(
      [
        'running',
        'swimming',
        'biking',
        'shoulders',
        'abs',
        'chest',
        'triceps',
        'back',
        'biceps',
        'legs',
      ].map((exercise) => Exercises.create({ name: exercise }))
    );
    await march9workout.addExercises([running.id, biceps.id]);
    await march10workout.addExercises([running.id, shoulders.id]);
    await march11workout.addExercises([running.id, chest.id]);

    const banana = Foods.create({
      name: 'banana',
      type: 'fruit',
      calories: 50,
    });
    const yogurtcup = Foods.create({
      name: 'yogurt cup',
      type: 'dairy',
      calories: 100,
    });
    const clementine = Foods.create({
      name: 'clementine',
      type: 'fruit',
      calories: 80,
    });

    const march10breakfast = await Meals.create({
      name: 'post-workout breakfast',
      contents: 'yogurt, banana',
      totalCalories: 150,
    });
  } catch (error) {
    console.log(error);
  }
};

const init = async () => {
  try {
    await db.sync({ force: true });
    await seed();
  } catch (error) {
    console.log(error);
  }
};

module.exports = init;
