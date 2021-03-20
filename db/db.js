const { Sequelize, STRING, INTEGER, DATE } = require('sequelize');
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
    //any reason why you didnt use DATE as the dataType?
    type: STRING,
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
  //i dont believe there are unlimited foodgroups? maybe this should be a different DataType?
  //maybe https://sequelize.org/master/class/lib/data-types.js~ENUM.html
  name: {
    type: STRING,
    allowNull: false,
  },
});

/* think about what this would look like if you wanted to expand this application
for example, what if you had a trainer who wanted to look at a day and see which of his
trainees completed a workout on that day?
i would recommend having a many-to-many relationship between users and days,
so there is one representation of a day in your database for each date
that way the day model would be more like a calendar
OR since the only property on the Day model is the date, then date could also just be
a property on the Meals and Workouts models.
i think that would still give you all of the functionality you need*/
Users.hasMany(Day);
Day.belongsTo(Users);

Day.hasMany(Workouts);
Workouts.belongsTo(Day);

//with the feedback above, i think there should also be an association between Users and Workouts
Workouts.belongsToMany(Exercises, { through: 'Workouts_Exercises' });
Exercises.belongsToMany(Workouts, { through: 'Workouts_Exercises' });

Day.hasMany(Meals);
Meals.belongsTo(Day);
//meals and users?

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
        Day.create({ date: date, userId: arjan.id })
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

module.exports = {
  init,
  db,
  models: {
    Users,
    Day,
    Workouts,
    Exercises,
    Meals,
    Foods,
    FoodGroups,
  },
};
