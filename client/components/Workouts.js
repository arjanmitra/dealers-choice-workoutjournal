import React from 'react';

export default function Workouts(props) {
  const { workouts } = props;
  return (
    <div>
      {workouts.length !== 0 ? <h4>Workouts</h4> : null}
      {workouts.map((workout) => {
        return <p key={workout.id}>{workout.name}</p>;
      })}
    </div>
  );
}
