import React from 'react';
import { connect } from 'react-redux';
import StaticPageLayout from '../shared/static_page_layout';

const AccountPage = ({ currentUserId, users }) => {
    const user = users[currentUserId];
    if (!user) {
        return (
            <StaticPageLayout title="账户详情">
                <p>请先登录。</p>
            </StaticPageLayout>
        );
    }
    return (
        <StaticPageLayout title="账户详情">
            <ul className="account-info">
                <li>用户名：{user.username}</li>
                <li>邮箱：{user.email}</li>
                <li>用户 ID：{user.id}</li>
            </ul>
        </StaticPageLayout>
    );
};

const MSTP = (state) => ({
    currentUserId: state.session.id,
    users: state.entities.users,
});

export default connect(MSTP)(AccountPage);
