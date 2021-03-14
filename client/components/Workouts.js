import React from 'react';

export default function Workouts(props) {
  const { workouts } = props;
  return (
    <div>
      {workouts.length !== 0 ? <h4>Workouts</h4> : null}
      {workouts.map((workout) => {
        return <p key={workout.id}>{workout.name}</p>;
      })}
      {workouts.length !== 0 ? (
        <div>
          Add a new workout!
          <input id="newworkout"></input>
          <button
            id="newworkoutbutton"
            onClick={() => {
              const newDayInput = document.querySelector('#newworkout');
              //createUserDay(newDayInput.value);
              //newDayInput.value = null;
            }}
          >
            Create
          </button>
        </div>
      ) : null}
    </div>
  );
}
