import UserAccountScreen from './view';
import { connect } from 'react-redux';
import {
  deleteUserAccountAction,
  getUserAccountListAction,
} from '~/actions/userAccountActions';

const mapStateToProps = ({ userAccount }) => {
  const data = userAccount.get('data');
  const count = userAccount.get('count') || 0;
  return {
    list: data,
    totalCount: count,
  };
};

const mapDispatchToProps = dispatch => ({
  handleGetList: payload => {
    dispatch(getUserAccountListAction(payload));
  },
  handleDeleteAccount: payload => {
    dispatch(deleteUserAccountAction(payload));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UserAccountScreen);
