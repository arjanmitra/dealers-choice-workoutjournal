import React from 'react';

export default function Workouts(props) {
  const { workouts, createUserDayWorkout, selectedWorkoutDate } = props;
  return (
    <div>
      {workouts.length !== 0 || selectedWorkoutDate !== '' ? (
        <h4>Workouts</h4>
      ) : null}
      {workouts.map((workout) => {
        return (
          <div key={workout.id}>
            <div>{workout.name}</div>
            <button>x</button>
          </div>
        );
      })}
      {workouts.length !== 0 || selectedWorkoutDate !== '' ? (
        <div>
          Add a new workout!
          <input id="newworkout"></input>
          <button
            id="newworkoutbutton"
            onClick={() => {
              const newWorkoutInput = document.querySelector('#newworkout');
              if (newWorkoutInput.value === '') {
                alert('Please add workout details!');
                return;
              }
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
