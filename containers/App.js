import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchMessage } from '../actions/messageActions';
import Message from '../components/Message'

export class App extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
      this.props.dispatch(fetchMessage())
  }
  render() {
    return (
          <div>
            <div>
              <h2>App</h2>
              <Message messages={this.props.messages}/>
            </div>
            <p>Loading : {this.props.isLoading.toString()}</p>
            <a href="/logout">Log Out</a>
          </div>
    );
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  messages : PropTypes.array.isRequired,
  isLoading : PropTypes.bool.isRequired
};

// Retrieve data from store as props
function mapStateToProps(state) {
  const {messages, isLoading } = {
    isLoading: state.message.isLoading,
    messages: state.message.messages
  }
  return {
      messages,
      isLoading
    }
}

export default connect(mapStateToProps)(App);
