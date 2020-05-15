import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Editor from '../components/Editor';
import { JavroStateType } from '../reducers/types';
import { changeAvro, changeJsonWithDispatch } from '../actions/editor';

function mapStateToProps(state: JavroStateType) {
  return { ...state.editor };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      changeJson: changeJsonWithDispatch,
      changeAvro
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
