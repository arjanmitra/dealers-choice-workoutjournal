import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Users from './components/Users';
import Days from './components/Days';
import Workouts from './components/Workouts';
import Meals from './components/Meals';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      users: [],
      selectedUser: 0,
      selectedWorkout: '',
      days: [],
      workouts: [],
      meals: [],
    };
    this.loadUserDays = this.loadUserDays.bind(this);
    this.loadUserDayData = this.loadUserDayData.bind(this);
  }
  async componentDidMount() {
    try {
      const users = (await axios.get('/users')).data;
      this.setState({ users });
    } catch (error) {
      console.log(error);
    }
  }

  async loadUserDays(id) {
    try {
      const days = (await axios.get(`/users/${id}/days`)).data;
      this.setState({ days, selectedUser: id });
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
      this.setState({ meals, workouts, selectedWorkout: date });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <div>
        <h1>Workout Journal</h1>
        <Users users={this.state.users} loadUserDays={this.loadUserDays} />
        <Days days={this.state.days} loadUserDayData={this.loadUserDayData} />

        <Workouts workouts={this.state.workouts} />

        <Meals meals={this.state.meals} />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#root'));
