import {createStore, getStore} from 'tbg-flux-factory';
import request from 'reqwest';

import moment from 'moment';

var authStore = getStore('auth');

function apiRequest (url, method, params = {}) {
  const { baseURL, auth_token } = authStore.getState()

  return request({
    url: `${baseURL}/${url}`,
    type: 'json',
    method: method || 'get',
    contentType: 'application/json',
    headers: {
      "Authorization": "BASIC " +  auth_token,
    },
    crossOrigin: true,
    data: params
  })
}


var REFERENCE = moment().utc();
var TODAY = REFERENCE.clone().startOf('day');
var YESTERDAY = REFERENCE.clone().subtract(1, 'days').startOf('day');
var A_WEEK_OLD = moment().startOf('isoWeek');

const apiStore = createStore({
  name: 'api',
  data: {
    loading: true,
    clockedIn: JSON.parse(localStorage.getItem('clockedIn')) || false,
    dateTimestamp : Date.now(),
    session: 0,
    today: 0,
    week: 0
  },
  actions: {
    server: {
      getMe() {
        this.setState({ loading: true })

        apiRequest('me.json', 'get', {
          includeClockIn: true
        })
        .then((resp) => {
          const {isClockedIn} = resp['person']

          this.setState({ clockedIn: isClockedIn })
          localStorage.setItem('clockedIn', isClockedIn)
          this.getClockins()
        })
        .always( () => {
          // this.setState({ loading: false })
        })
      },
      clock(clockedIn) {
        this.setState({ loading: true })

        apiRequest(`me/${ clockedIn ? 'clockin' : 'clockout'}.json`, 'post')
        .then((resp) => {
          this.setState({ clockedIn });
          localStorage.setItem('clockedIn', clockedIn);
          this.getClockins()
        })
        .always( () => {
          this.setState({ loading: false })
        })
      },
      getClockins() {
        this.setState({ loading: true })

        apiRequest('me/clockins.json')
        .then((resp) => {
          const clockins = resp['clockIns'];
          var session = 0;
          var today = 0;
          var week = 0;

          clockins.forEach((clock) => {
            if (moment(clock.clockInDatetime).isSame(TODAY, 'd')) {
              // if not clocked out
              if (!clock.clockOutDatetime) {
                today += session = moment().diff(moment(clock.clockInDatetime),'ms')
              }
              if (moment(clock.clockOutDatetime).diff(moment(clock.clockInDatetime),'ms'))
                today += moment(clock.clockOutDatetime).diff(moment(clock.clockInDatetime),'ms');
            }

            if (moment().week() == moment(clock.clockInDatetime).week()) {
              if (clock.clockOutDatetime) {
                week += moment(clock.clockOutDatetime).diff(moment(clock.clockInDatetime),'ms')
              } else {
                week += moment().diff(moment(clock.clockInDatetime),'ms')
              }
            }
          })
          this.setState({ session, today, week })
        })
        .always( () => {
          this.setState({ loading: false })
        })
      }
    },
    view: {}
  }
});

export default apiStore;
