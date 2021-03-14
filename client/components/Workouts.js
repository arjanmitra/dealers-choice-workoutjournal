import React from 'react';

export default function Workouts(props) {
  const { workouts, createUserDayWorkout, selectedWorkoutDate } = props;
  return (
    <div>
      {workouts.length !== 0 || selectedWorkoutDate !== '' ? (
        <h4>Workouts</h4>
      ) : null}
      {workouts.map((workout) => {
        return <p key={workout.id}>{workout.name}</p>;
      })}
      {workouts.length !== 0 || selectedWorkoutDate !== '' ? (
        <div>
          Add a new workout!
          <input id="newworkout"></input>
          <button
            id="newworkoutbutton"
            onClick={() => {
              const newWorkoutInput = document.querySelector('#newworkout');
              createUserDayWorkout(newWorkoutInput.value);
              newWorkoutInput.value = null;
            }}
          >
            Create
          </button>
        </div>
      ) : null}
    </div>
  );
}
