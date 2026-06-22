import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { logoutUser } from '../../actions/session_actions';
import MainHeader from './main_header';

const MSTP = (state) => {
    const id = state.session.id;
    const user = state.entities.users[id];
    return {
        loggedIn: Boolean(state.session.id),
        username: user ? user.username : null,
        id,
        locale: state.locale,
        isAdmin: user ? user.admin : false,
    };
};

const MDTP = (dispatch) => {
    return {
        logoutUser: () => dispatch(logoutUser()),
    };
};

export default withRouter(connect(MSTP, MDTP)(MainHeader));
