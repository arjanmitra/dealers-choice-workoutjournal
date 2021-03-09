import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return (
      <div>
        <h1> hi</h1>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#root'));
