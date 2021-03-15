import { createStore } from 'redux';

const store = createStore((state = {}, action) => {
  if (action.type === 'LOAD_USERS') {
    state = { ...state, users: action.payload.users };
  } else if (action.type === 'LOAD_DAYS') {
    state = {
      ...state,
      days: action.payload.days,
      selectedUser: action.payload.selectedUser,
    };
  } else if (action.type === 'LOAD_DAYS_DATA') {
    state = {
      ...state,
      workouts: action.payload.workouts,
      meals: action.payload.meals,
      selectedWorkoutDate: action.payload.selectedWorkoutDate,
    };
  }
  return state;
});

export default store;
