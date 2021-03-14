import React from 'react';

export default function Meals(props) {
  const { meals } = props;
  return (
    <div>
      {meals.length !== 0 ? <h4>Meals</h4> : null}
      {meals.map((meal) => {
        return (
          <p key={meal.id}>
            {meal.name}, {meal.contents}
          </p>
        );
      })}
    </div>
  );
}
