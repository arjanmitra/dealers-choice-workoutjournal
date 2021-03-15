import React from 'react';

export default function Meals(props) {
  const { meals, createUserDayMeal, selectedWorkoutDate, deleteMeal } = props;
  return (
    <div>
      {meals.length !== 0 || selectedWorkoutDate !== '' ? <h4>Meals</h4> : null}
      {meals.map((meal) => {
        return (
          <div key={meal.id}>
            <div>
              {meal.name}, {meal.contents}
            </div>
            <form method="POST" action="/meals?_method=DELETE">
              <button
                type="submit"
                onClick={() => {
                  deleteMeal(meal.id);
                }}
              >
                x
              </button>
            </form>
          </div>
        );
      })}

      {meals.length !== 0 || selectedWorkoutDate !== '' ? (
        <div>
          Meal name:
          <input id="mealName"></input>
          Meal contents:
          <input id="mealContents"></input>
          Calories:
          <input id="mealCalories"></input>
          <button
            id="newmealbutton"
            onClick={() => {
              const mealNameInput = document.querySelector('#mealName');
              const mealContentsInput = document.querySelector('#mealContents');
              const mealCaloriesInput = document.querySelector('#mealCalories');
              createUserDayMeal([
                mealNameInput.value,
                mealContentsInput.value,
                mealCaloriesInput.value,
              ]);
              mealNameInput.value = null;
              mealContentsInput.value = null;
              mealCaloriesInput.value = null;
            }}
          >
            Create
          </button>
        </div>
      ) : null}
    </div>
  );
}
