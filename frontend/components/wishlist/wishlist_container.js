import { connect } from 'react-redux';
import Wishlist from './wishlist';

const MSTP = (state) => ({
    currentUserId: state.session.id,
    locale: state.locale,
});

export default connect(MSTP)(Wishlist);
