import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Editor from '../components/editor/Editor';
import { JavroStateType } from '../reducers/types';
import {
  avroMouseMove,
  changeAvroPristineWithDispatch,
  changeAvroWithDispatch
} from '../actions/editor';

function mapStateToProps(state: JavroStateType) {
  return { ...state.editor };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      changeAvro: changeAvroWithDispatch,
      avroMouseMove,
      changeAvroPristine: changeAvroPristineWithDispatch
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
