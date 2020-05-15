import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Editor from '../components/Editor';
import { JavroStateType } from '../reducers/types';
import { changeAvroWithDispatch, changeJson } from '../actions/editor';

function mapStateToProps(state: JavroStateType) {
  return { ...state.editor };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      changeAvro: changeAvroWithDispatch,
      changeJson
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
