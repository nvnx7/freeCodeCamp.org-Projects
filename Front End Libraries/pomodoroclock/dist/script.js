const SESSION = "Session";
const BREAK = "Break";
const PLAY_ICON_CLASS = "fa fa-play fa-3x";
const PAUSE_ICON_CLASS = "fa fa-pause fa-3x";
const TIMER_RUNNING = "timer_running";
const TIMER_PAUSED = "timer_paused";
const MAX_LEN = 60;
const MIN_LEN = 1;
const MAX_TIMER_DURATION = 3600;
const MIN_TIMER_DURATION = 60;

const getPlayPauseClass = previousClass => {
  if (previousClass.includes("fa-play")) {
    return "fa fa-pause fa-3x";
  } else {
    return "fa fa-play fa-3x";
  }
};

const formatTime = totalSeconds => {
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds - minutes * 60;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  minutes = minutes < 10 ? '0' + minutes : minutes;

  return minutes + ":" + seconds;
};

const defaultBreakLength = 5;
const defaultSessionLength = 25;
const defaultLengthsState = {
  breakLength: defaultBreakLength,
  sessionLength: defaultSessionLength };


const defaultTimerDuration = 1500;
const defaultTimerLabel = SESSION;
const defaultControlIconClass = PLAY_ICON_CLASS;
const defaultTimerStatus = TIMER_PAUSED;
const defaultTimerState = {
  timerStatus: defaultTimerStatus,
  timerDuration: defaultTimerDuration,
  timerLabel: defaultTimerLabel,
  intervalId: 0,
  controlIconClass: defaultControlIconClass };


//Redux
const INCREASE_BREAK_LEN = "INCREASE_BREAK_LEN";
const DECREASE_BREAK_LEN = "DECREASE_BREAK_LEN";
const INCREASE_SESSION_LEN = "INCREASE_SESSION_LEN";
const DECREASE_SESSION_LEN = "DECREASE_SESSION_LEN";
const RESET_LEN = "RESET_LEN";
const TICK_TIMER = "TICK_TIMER";
const PAUSE_TIMER = "PAUSE_TIMER";
const INCREASE_TIMER_SESSION_LEN = "INCREASE_TIMER_SESSION_LEN";
const DECREASE_TIMER_SESSION_LEN = "DECREASE_TIMER_SESSION_LEN";
const RESET_TIMER_SESSION_LEN = "RESET_TIMER_SESSION_LEN";
const SWITCH_TIMER = "SWITCH_TIMER";

const increaseBreakLength = () => {
  return {
    type: INCREASE_BREAK_LEN };

};

const increaseSessionLength = () => {
  return {
    type: INCREASE_SESSION_LEN };

};

const decreaseBreakLength = () => {
  return {
    type: DECREASE_BREAK_LEN };

};

const decreaseSessionLength = () => {
  return {
    type: DECREASE_SESSION_LEN };

};

const resetLengths = () => {
  return {
    type: RESET_LEN };

};

const tickTimer = intervalId => {
  return {
    type: TICK_TIMER,
    intervalId: intervalId };

};

const pauseTimer = intervalId => {
  return {
    type: PAUSE_TIMER,
    intervalId: intervalId };

};

const increaseTimerSessionLength = () => {
  return {
    type: INCREASE_TIMER_SESSION_LEN };

};

const decreaseTimerSessionLength = () => {
  return {
    type: DECREASE_TIMER_SESSION_LEN };

};

const resetTimerSessionLength = () => {
  return {
    type: RESET_TIMER_SESSION_LEN };

};

const switchTimer = length => {
  return {
    type: SWITCH_TIMER,
    length: length };

};

const lengthsReducer = (state = defaultLengthsState, action) => {
  switch (action.type) {
    case INCREASE_BREAK_LEN:
      return state.breakLength == MAX_LEN ?
      Object.assign({}, state, { breakLength: state.breakLength }) :
      Object.assign({}, state, { breakLength: state.breakLength + 1 });

    case DECREASE_BREAK_LEN:
      return state.breakLength == MIN_LEN ?
      Object.assign({}, state, { breakLength: state.breakLength }) :
      Object.assign({}, state, { breakLength: state.breakLength - 1 });

    case INCREASE_SESSION_LEN:
      return state.sessionLength == MAX_LEN ?
      Object.assign({}, state, { sessionLength: state.sessionLength }) :
      Object.assign({}, state, { sessionLength: state.sessionLength + 1 });

    case DECREASE_SESSION_LEN:
      return state.sessionLength == MIN_LEN ?
      Object.assign({}, state, { sessionLength: state.sessionLength }) :
      Object.assign({}, state, { sessionLength: state.sessionLength - 1 });

    case RESET_LEN:
      return defaultLengthsState;

    default:
      return state;}

};

const timerReducer = (state = defaultTimerState, action) => {
  switch (action.type) {
    case TICK_TIMER:
      return Object.assign({}, state, { timerStatus: TIMER_RUNNING,
        timerDuration: state.timerDuration - 1,
        intervalId: action.intervalId,
        controlIconClass: PAUSE_ICON_CLASS });
    case PAUSE_TIMER:
      return Object.assign({}, state, { timerStatus: TIMER_PAUSED,
        controlIconClass: PLAY_ICON_CLASS });
    case INCREASE_TIMER_SESSION_LEN:
      return state.timerDuration == MAX_TIMER_DURATION ?
      Object.assign({}, state, { timerDuration: state.timerDuration }) :
      Object.assign({}, state, { timerDuration: state.timerDuration + 60 });

    case DECREASE_TIMER_SESSION_LEN:
      return state.timerDuration == MIN_TIMER_DURATION ?
      Object.assign({}, state, { timerDuration: state.timerDuration }) :
      Object.assign({}, state, { timerDuration: state.timerDuration - 60 });

    case RESET_TIMER_SESSION_LEN:
      return Object.assign({}, defaultTimerState);

    case SWITCH_TIMER:
      return Object.assign({}, state, {
        timerLabel: state.timerLabel == SESSION ? BREAK : SESSION,
        timerDuration: Number(action.length) * 60 });


    default:
      return state;}

};

const mapStateToProps = state => {
  return {
    lengths: state.lengths,
    timer: state.timer };

};

const mapDispatchToProps = dispatch => {
  return {
    increaseBreakLength: () => {
      dispatch(increaseBreakLength());
    },
    decreaseBreakLength: () => {
      dispatch(decreaseBreakLength());
    },
    increaseSessionLength: () => {
      dispatch(increaseSessionLength());
    },
    decreaseSessionLength: () => {
      dispatch(decreaseSessionLength());
    },
    tickTimer: intervalId => {
      dispatch(tickTimer(intervalId));
    },
    pauseTimer: intervalId => {
      clearInterval(intervalId);
      dispatch(pauseTimer(intervalId));
    },
    increaseTimerSessionLength: () => {
      dispatch(increaseTimerSessionLength());
    },
    decreaseTimerSessionLength: () => {
      dispatch(decreaseTimerSessionLength());
    },
    resetTimerSessionLength: () => {
      dispatch(resetTimerSessionLength());
    },
    resetLengths: () => {
      dispatch(resetLengths());
    },
    switchTimer: length => {
      dispatch(switchTimer(length));
    } };

};

const rootReducer = Redux.combineReducers({
  lengths: lengthsReducer,
  timer: timerReducer });


const store = Redux.createStore(rootReducer);

//React
const Provider = ReactRedux.Provider;
const connect = ReactRedux.connect;

class TimerLengthControl extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      React.createElement("div", { className: "length-control-container" },
      React.createElement("div", { className: "control-label", id: this.props.labelId },
      this.props.title),


      React.createElement("div", { className: "length-control" },
      React.createElement("button", { className: "btn-up",
        id: this.props.incrBtnId,
        onClick: this.props.increaseLength },
      React.createElement("i", { className: "fa fa-arrow-down fa-2x" })),

      React.createElement("div", { className: "length", id: this.props.lengthId },
      this.props.length),

      React.createElement("button", { className: "btn-down",
        id: this.props.decrBtnId,
        onClick: this.props.decreaseLength },
      React.createElement("i", { className: "fa fa-arrow-up fa-2x" })))));




  }}


class Timer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      React.createElement("div", { className: "timer-wrapper" },
      React.createElement("div", { className: "timer-box" },
      React.createElement("div", { className: "timer-label" },
      this.props.timerLabel),

      React.createElement("div", { className: "time-left", id: "time-left" },
      this.props.timerDuration)),



      React.createElement("div", { className: "timer-controls" },
      React.createElement("button", { id: "start_stop",
        onClick: this.props.timerControl },
      React.createElement("i", { className: this.props.controlIconClass })),

      React.createElement("button", { id: "reset",
        onClick: this.props.reset },
      React.createElement("i", { className: "fa fa-refresh fa-3x" })))));




  }}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.timerControl = this.timerControl.bind(this);
    this.increaseSession = this.increaseSession.bind(this);
    this.decreaseSession = this.decreaseSession.bind(this);
    this.reset = this.reset.bind(this);
    this.switchTimer = this.switchTimer.bind(this);
    this.beginCountdown = this.beginCountdown.bind(this);
    this.beep = this.beep.bind(this);
  }

  increaseSession() {
    this.props.increaseSessionLength();
    this.props.increaseTimerSessionLength();
  }

  decreaseSession() {
    this.props.decreaseSessionLength();
    this.props.decreaseTimerSessionLength();
  }

  reset() {
    if (this.props.timer.timerStatus == TIMER_RUNNING) {
      this.props.pauseTimer(this.props.timer.intervalId);
    }
    this.beepAudio.pause();
    this.beepAudio.currentTime = 0;
    this.props.resetLengths();
    this.props.resetTimerSessionLength();
  }

  timerControl() {
    if (this.props.timer.timerStatus == TIMER_RUNNING) {
      this.props.pauseTimer(this.props.timer.intervalId);
    } else {
      this.beginCountdown();
    }
  }

  beginCountdown() {
    let intervalId = setInterval(() => {
      this.props.tickTimer(intervalId);
      this.beep();
      if (this.props.timer.timerDuration < 0) {
        clearInterval(intervalId);
        this.switchTimer();
      }
    }, 1000);
  }

  switchTimer() {
    if (this.props.timer.timerLabel == SESSION) {
      this.props.switchTimer(this.props.lengths.breakLength);
    } else {
      this.props.switchTimer(this.props.lengths.sessionLength);
    }
    this.beginCountdown();
  }

  beep() {
    if (this.props.timer.timerDuration == 0) {
      this.beepAudio.play();
    }
  }

  render() {
    return (
      React.createElement("div", { className: "timer-container" },
      React.createElement("div", { className: "length-controls-container" },

      React.createElement(TimerLengthControl, {
        title: "Break Length",
        lableId: "break-label",
        incrBtnId: "break-increment",
        decrBtnId: "break-decrement",
        lengthId: "break-length",
        length: this.props.lengths.breakLength,
        increaseLength: this.props.decreaseBreakLength,
        decreaseLength: this.props.increaseBreakLength }),

      React.createElement(TimerLengthControl, {
        title: "Session Length",
        labelId: "session-label",
        incrBtnId: "session-increment",
        decrBtnId: "session-decrement",
        lengthId: "session-length",
        length: this.props.lengths.sessionLength,
        increaseLength: this.decreaseSession,
        decreaseLength: this.increaseSession })),


      React.createElement(Timer, { className: "timer",
        timerDuration: formatTime(this.props.timer.timerDuration),
        timerLabel: this.props.timer.timerLabel,
        controlIconClass: this.props.timer.controlIconClass,
        reset: this.reset,
        timerControl: this.timerControl }),

      React.createElement("audio", {
        id: "beep",
        preload: "auto",
        src: "https://goo.gl/65cBl1",
        ref: audio => {this.beepAudio = audio;} })));


  }}


const Container = connect(mapStateToProps, mapDispatchToProps)(App);

class AppWrapper extends React.Component {
  render() {
    return (
      React.createElement(Provider, { store: store },
      React.createElement(Container, null)));


  }}


ReactDOM.render(React.createElement(AppWrapper, null), document.getElementById("app"));