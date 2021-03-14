import React from 'react';

export default function Meals(props) {
  const { meals, createUserDayMeal, selectedWorkoutDate } = props;
  return (
    <div>
      {meals.length !== 0 || selectedWorkoutDate !== '' ? <h4>Meals</h4> : null}
      {meals.map((meal) => {
        return (
          <p key={meal.id}>
            {meal.name}, {meal.contents}
          </p>
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
