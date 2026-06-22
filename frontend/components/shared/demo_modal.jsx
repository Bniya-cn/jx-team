import React from 'react';

// 演示用弹窗：安装客户端 / 立即游玩等装饰按钮
class DemoModal extends React.Component {
    render() {
        if (!this.props.open) return null;
        return (
            <div className="demo-modal-overlay" onClick={this.props.onClose}>
                <div className="demo-modal-box" onClick={(e) => e.stopPropagation()}>
                    <h3>演示项目提示</h3>
                    <p>JX-Team 为期末作业演示版本，无需安装桌面客户端，直接在浏览器中体验即可。</p>
                    <button onClick={this.props.onClose}>知道了</button>
                </div>
            </div>
        );
    }
}

export default DemoModal;
