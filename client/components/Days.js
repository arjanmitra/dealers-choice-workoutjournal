import React from 'react';

export default function Days(props) {
  const { days, loadUserDayData } = props;
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
          <input id="newday"></input>
        </div>
      ) : null}
    </div>
  );
}
