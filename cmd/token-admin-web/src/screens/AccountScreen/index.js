import AccountScreen from './view';
import { connect } from 'react-redux';
import {
  addAccountAction,
  getAccountListAction,
  updateAccountAction,
  deleteAccountAction,
} from '~/actions/accountActions';
import { allRoles } from '~/constants/mock/allRoles';
import { listToMap } from '~/utils/format';

const mapStateToProps = ({ account }) => {
  const count = account.get('count') || 0;
  const size = 10; // 每頁顯示數量
  return {
    records: account.get('rows'),
    allRoles: allRoles.toJS(),
    allRoleMap: listToMap(allRoles, 'roleId', 'roleName'),
    roles: [],
    pages: Math.ceil(count / size) || 1,
    total: count,
  };
};

const mapDispatchToProps = dispatch => ({
  handleGetAction: payload => {
    dispatch(getAccountListAction(payload));
  },
  handleAddAction: payload => {
    dispatch(addAccountAction(payload));
  },
  handleUpdateAction: payload => {
    dispatch(updateAccountAction(payload));
  },
  handleDeleteAction: payload => {
    dispatch(deleteAccountAction(payload));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountScreen);
