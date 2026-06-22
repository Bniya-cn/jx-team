import { connect } from 'react-redux';
import { fetchUser } from '../../actions/user_actions';
import BadgesPage from './badges_page';

const MSTP = (state) => ({
    currentUserId: state.session.id,
    users: state.entities.users,
});

const MDTP = (d) => ({ fetchUser: (id) => d(fetchUser(id)) });

export default connect(MSTP, MDTP)(BadgesPage);
