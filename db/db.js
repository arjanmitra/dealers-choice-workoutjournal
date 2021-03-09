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
  calories: {
    type: INTEGER,
    allowNull: false,
  },
});

const FoodGroups = db.define('foodgroups', {
  name: {
    type: STRING,
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

FoodGroups.hasMany(Foods);
Foods.belongsTo(FoodGroups);

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

    const [fruit, vegetable, dairy, protein, carb] = await Promise.all(
      ['fruit', 'vegetable', 'dairy', 'protein', 'carb'].map((foodgroup) =>
        FoodGroups.create({ name: foodgroup })
      )
    );

    const banana = await Foods.create({
      name: 'banana',
      calories: 50,
      foodgroupId: fruit.id,
    });
    const yogurtcup = await Foods.create({
      name: 'yogurt cup',
      calories: 100,
      foodgroupId: dairy.id,
    });
    const clementine = await Foods.create({
      name: 'clementine',
      calories: 80,
      foodgroupId: fruit.id,
    });

    const lentilSoup = await Foods.create({
      name: 'lentil soup',
      calories: 200,
      foodgroupId: carb.id,
    });
    const rice = await Foods.create({
      name: 'rice',
      calories: 150,
      foodgroupId: carb.id,
    });
    const chickenBreast = await Foods.create({
      name: 'chicken breast',
      calories: 250,
      foodgroupId: protein.id,
    });
    const fish = await Foods.create({
      name: 'fish',
      calories: 250,
      foodgroupId: protein.id,
    });

    const march9breakfast = await Meals.create({
      name: 'post-workout breakfast',
      contents: 'yogurt, banana',
      totalCalories: 150,
      dayId: march9.id,
    });
    const march9lunch = await Meals.create({
      name: 'early lunch',
      contents: 'rice, lentilsoup',
      totalCalories: 350,
      dayId: march9.id,
    });
    const march9dinner = await Meals.create({
      name: 'early dinner',
      contents: 'rice, chicken',
      totalCalories: 500,
      dayId: march9.id,
    });

    const march10breakfast = await Meals.create({
      name: 'post-workout breakfast',
      contents: 'yogurt, banana, clementine',
      totalCalories: 250,
      dayId: march10.id,
    });
    const march10lunch = await Meals.create({
      name: 'lunch',
      contents: 'rice, chicken',
      totalCalories: 400,
      dayId: march10.id,
    });
    const march10dinner = await Meals.create({
      name: 'dinner',
      contents: 'rice, dal',
      totalCalories: 400,
      dayId: march10.id,
    });

    const march11breakfast = await Meals.create({
      name: 'late breakfast',
      contents: 'banana, clementine',
      totalCalories: 200,
      dayId: march11.id,
    });
    const march11lunch = await Meals.create({
      name: 'late lunch',
      contents: 'rice, fish',
      totalCalories: 400,
      dayId: march11.id,
    });
    const march11dinner = await Meals.create({
      name: 'early dinner',
      contents: 'rice, chicken',
      totalCalories: 400,
      dayId: march11.id,
    });

    await march9breakfast.addFoods([yogurtcup.id, banana.id]);
    await march9lunch.addFoods([rice.id, lentilSoup.id]);
    await march9dinner.addFoods([rice.id, chickenBreast.id]);

    await march10breakfast.addFoods([yogurtcup.id, banana.id, clementine.id]);
    await march10lunch.addFoods([rice.id, chickenBreast.id]);
    await march10dinner.addFoods([rice.id, lentilSoup.id]);

    await march11breakfast.addFoods([banana.id, clementine.id]);
    await march11lunch.addFoods([rice.id, fish.id]);
    await march11dinner.addFoods([rice.id, chickenBreast.id]);
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
