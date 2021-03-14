import React from 'react';

export default function Users(props) {
  const { users, loadUserDays } = props;
  return (
    <div>
      {users.map((user) => {
        return (
          <p key={user.id} onClick={() => loadUserDays(user.id)}>
            {user.name}, {user.age}
          </p>
        );
      })}
    </div>
  );
}
