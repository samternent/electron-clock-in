import '../state/api';

import 'moment-duration-format';

import moment from 'moment';

import React, {Component} from 'react'
import TotalTarget from '../components/TotalTarget'

import {getStore} from 'tbg-flux-factory';
const api = getStore('api');

class Clocker extends Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({}, api.getState(), {
      interval: 0
    })
    this.handleStoreUpdate = this.handleStoreUpdate.bind(this);
    this.tick = this.tick.bind(this);
  }

  tick() {
    if (!this.state.clockedIn) return null

    if (this.state.interval === 60000) {
      return this.setState({
        interval: 0
      }, () => {
        api.Actions.getClockins();
      })
    }

    api.setState({
      dateTimestamp: Date.now(),
      session: this.state.session + 1000,
      today: this.state.today + 1000,
      week: this.state.week + 1000
    });

    this.setState({
      interval: this.state.interval + 1000
    })
  }

  componentWillMount() {
    api.addChangeListener(this.handleStoreUpdate);
  }

  componentWillUnmount() {
    api.removeChangeListener(this.handleStoreUpdate);
    clearInterval(this.interval);
  }

  componentDidMount() {
    api.Actions.getMe();
    this.interval = setInterval(this.tick, 1000);
  }

  handleStoreUpdate() {
    this.setState(api.getState(), (state) => {

    })
  }

  getCurrentSession() {
    if (!this.state.clockedIn) return '00 : 00 : 00'

    var durationMs = moment.duration(this.state.session, "ms")
    var duration = durationMs.format("hh : mm : ss", { trim: false })

    return duration
  }

  render() {
    return (
      <div className="content">
        <div className="header">
          <div className='clock-in__session'>
            {this.getCurrentSession()}
          </div>
          <div
            className={`clock-in__button ${this.state.clockedIn ? 'clocked-in' : 'clocked-out'}`}
            onClick={() => { api.Actions.clock(!this.state.clockedIn) }}>
            {
              this.state.clockedIn ? 'Clock Out' : 'Clock In'
            }
          </div>
        </div>
        <div className='clock-in__wrapper'>
          <TotalTarget
            title="Today"
            radius={50}
            color="#6fdb6f"
            value={moment.duration(this.state.today, "ms").format("h[h] m[m]")}
            perc={((this.state.today / 28800000)*100).toFixed(2)}
          />
          <TotalTarget
            title="This Week"
            radius={50}
            color="#6fdb6f"
            value={moment.duration(this.state.week, "ms").format("h[h] m[m]")}
            perc={((this.state.week / 144000000)*100).toFixed(2)} />
        </div>
      </div>
    );
  }
}

export default Clocker
