import React from 'react';

export default function Days(props) {
  const { days, loadUserDayData, createUserDay } = props;
  return (
    <div>
      {days.map((day) => {
        return (
          <div
            key={day.id}
            onClick={() => {
              loadUserDayData(day.date);
            }}
          >
            {day.date}
          </div>
        );
      })}
      {days.length !== 0 ? (
        <div>
          Add a new workout day!
          <input id="newday"></input>
          <button
            id="newdaybutton"
            onClick={() => {
              const newDayInput = document.querySelector('#newday');
              createUserDay(newDayInput.value);
              newDayInput.value = null;
            }}
          >
            Create
          </button>
        </div>
      ) : null}
    </div>
  );
}
