import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import store from './store';
import Users from './components/Users';
import Days from './components/Days';
import Workouts from './components/Workouts';
import Meals from './components/Meals';

class App extends React.Component {
  constructor() {
    super();
    this.state = store.getState();
    //now that we know a little more about react-redux,
    //what do you think this would look like if refactored to
    //use react-redux?
    this.loadUserDays = this.loadUserDays.bind(this);
    this.loadUserDayData = this.loadUserDayData.bind(this);
    this.createUserDay = this.createUserDay.bind(this);
    this.createUserDayWorkout = this.createUserDayWorkout.bind(this);
    this.createUserDayMeal = this.createUserDayMeal.bind(this);
    this.deleteMeal = this.deleteMeal.bind(this);
    this.deleteWorkout = this.deleteWorkout.bind(this);
    this.deleteDay = this.deleteDay.bind(this);
  }
  async componentDidMount() {
    try {
      const users = (await axios.get('/users')).data;
      store.subscribe(() => {
        this.setState(store.getState());
      });
      store.dispatch({
        type: 'LOAD_USERS',
        payload: {
          users: users,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async loadUserDays(id) {
    try {
      const days = (await axios.get(`/users/${id}/days`)).data;
      store.dispatch({
        type: 'LOAD_DAYS',
        payload: {
          days: days,
          selectedUser: id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async loadUserDayData(date) {
    try {
      const workouts = (
        await axios.get(
          `/users/${this.state.selectedUser}/days/${date}/workouts`
        )
      ).data;
      const meals = (
        await axios.get(`/users/${this.state.selectedUser}/days/${date}/meals`)
      ).data;
      store.dispatch({
        type: 'LOAD_DAYS_DATA',
        payload: {
          workouts: workouts,
          meals: meals,
          selectedWorkoutDate: date,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async createUserDay(data) {
    try {
      //typically what you want to do here is capture the newObject that the server responds with
      //and dispatch it to the store. it means you can accomplish the same functionality here in just one server call
      //your reducer should be set up to handle an action like CREATE_USER_DAY
      //it would look something like this:
      //const newDay = await axios.post(/*path here*/)
      /*dispatch {
        type: 'CREATE_USER_DAY'
        payload: {
          newDay
        }
      }*/
      await axios.post(`users/${this.state.selectedUser}/days/${data}`);
      this.loadUserDays(this.state.selectedUser);
    } catch (error) {
      console.log(error);
    }
  }

  async createUserDayWorkout(data) {
    try {
      //same as above, dispatch new object to store instead of getting all the data over again
      //set up a CREATE_USER_WORKOUT action in your reducer
      //const newWorkout = await axios.post(/*path here*/)
      /* dispatch({
        type: 'CREATE_USER_WORKOUT',
        payload: {
          newWorkout
        }
      })

      */
      await axios.post(
        `users/${this.state.selectedUser}/days/${this.state.selectedWorkoutDate}/workouts/${data}`
      );
      this.loadUserDayData(this.state.selectedWorkoutDate);
    } catch (error) {
      console.log(error);
    }
  }

  async createUserDayMeal(data) {
    try {
      await axios.post(
        `users/${this.state.selectedUser}/days/${this.state.selectedWorkoutDate}/meals/`,
        {
          mealName: data[0],
          mealContents: data[1],
          mealCalories: data[2],
        }
      );
      this.loadUserDayData(this.state.selectedWorkoutDate);
    } catch (error) {
      console.log(error);
    }
  }

  async deleteDay(dayId) {
    try {
      await axios.delete('/days/', {
        data: {
          dayId: dayId,
        },
      });
      this.loadUserDays(this.state.selectedUser);

      store.dispatch({
        type: 'DELETE_DAY',
        payload: {
          workouts: [],
          meals: [],
          selectedWorkoutDate: '',
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteWorkout(workoutId) {
    try {
      await axios.delete('/workouts/', {
        data: {
          workoutId: workoutId,
        },
      });
      this.loadUserDayData(this.state.selectedWorkoutDate);
    } catch (error) {
      console.log(error);
    }
  }

  async deleteMeal(mealId) {
    try {
      await axios.delete('/meals/', {
        data: {
          mealId: mealId,
        },
      });
      this.loadUserDayData(this.state.selectedWorkoutDate);
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <div>
        <h1>Workout Journal</h1>
        <Users users={this.state.users} loadUserDays={this.loadUserDays} />
        <Days
          days={this.state.days}
          loadUserDayData={this.loadUserDayData}
          createUserDay={this.createUserDay}
          selectedUser={this.state.selectedUser}
          deleteDay={this.deleteDay}
        />

        <Workouts
          workouts={this.state.workouts}
          createUserDayWorkout={this.createUserDayWorkout}
          selectedWorkoutDate={this.state.selectedWorkoutDate}
          deleteWorkout={this.deleteWorkout}
        />

        <Meals
          meals={this.state.meals}
          createUserDayMeal={this.createUserDayMeal}
          selectedWorkoutDate={this.state.selectedWorkoutDate}
          deleteMeal={this.deleteMeal}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#root'));
