import React from 'react';
import Sidebar from '../sidebar/sidebar';

// 带侧边栏的静态内容页布局
const StaticPageLayout = ({ title, children }) => (
    <div className="homepage static-page">
        <Sidebar />
        <div className="main-content static-page-content">
            {title && <h2 className="stage-panel" style={{ '--enter-delay': '60ms' }}>{title}</h2>}
            {children}
        </div>
    </div>
);

export default StaticPageLayout;
