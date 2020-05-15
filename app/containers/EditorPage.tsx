import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Counter from '../components/Counter';
import {
  decrement,
  increment,
  incrementAsync,
  incrementIfOdd
} from '../actions/counter';
import { javroStateType } from '../reducers/types';

function mapStateToProps(state: javroStateType) {
  return {
    counter: state.counter
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      increment,
      decrement,
      incrementIfOdd,
      incrementAsync
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
