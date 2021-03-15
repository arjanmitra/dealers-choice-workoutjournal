import React from 'react';

export default function Days(props) {
  const {
    days,
    loadUserDayData,
    createUserDay,
    deleteDay,
    selectedUser,
  } = props;
  return (
    <div>
      {days.map((day) => {
        return (
          <div key={day.id}>
            <div
              onClick={() => {
                loadUserDayData(day.date);
              }}
            >
              {day.date}
            </div>
            <button key={day.id} onClick={() => deleteDay(day.id)}>
              x
            </button>
          </div>
        );
      })}
      {days.length !== 0 || selectedUser ? (
        <div>
          Add a new workout day!
          <input id="newday"></input>
          <button
            id="newdaybutton"
            onClick={() => {
              const newDayInput = document.querySelector('#newday');
              if (newDayInput.value === '') {
                alert('Please enter in a day!');
                return;
              }
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
