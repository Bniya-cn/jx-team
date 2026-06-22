import React from 'react';
import { Link } from 'react-router-dom';

class SessionForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            email: '',
        };
        this.guest = {
            username: 'Guest',
            password: 'password',
        };
        this.checked = false;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderErrors = this.renderErrors.bind(this);
        this.toggleChecked = this.toggleChecked.bind(this);
        this.handleGuest = this.handleGuest.bind(this);
    }

    componentDidMount() {
        this.props.clearErrors();
    }

    toggleChecked() {
        this.checked = !this.checked;
    }

    handleGuest(e) {
        e.preventDefault();
        this.props.action(this.guest);
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.props.formMode === 'signup' && !this.checked) {
            this.props.receiveErrors(['您必须年满 13 岁才能注册。']);
            return;
        }
        const user = Object.assign({}, this.state);
        this.props.action(user);
    }

    update(field) {
        return (e) =>
            this.setState({
                [field]: e.currentTarget.value,
            });
    }

    renderErrors() {
        return (
            <ul>
                {this.props.errors.map((error, idx) => {
                    return <li key={`error-${idx}`}>{error}</li>;
                })}
            </ul>
        );
    }

    // 匹配中英文校验错误，用于高亮对应输入框
    hasError(field) {
        const patterns = {
            username: ['用户名', 'Username', 'username'],
            email: ['邮箱', 'Email', 'email'],
            password: ['密码', 'Password', 'password'],
            age: ['13'],
        };
        for (let i = 0; i < this.props.errors.length; i++) {
            for (const token of patterns[field]) {
                if (this.props.errors[i].includes(token)) {
                    return true;
                }
            }
        }
        return false;
    }

    render() {
        const isSignup = this.props.formMode === 'signup';
        const hasErrors = this.props.errors.length > 0 ? 'login-errors' : 'empty';
        return (
            <div className={this.props.klassName}>
                <div className="left-login-section">
                    <form className="session-form" onSubmit={this.handleSubmit}>
                        <h2>{isSignup ? '创建您的账户' : '登录'}</h2>
                        <div className={hasErrors}>{this.renderErrors()}</div>

                        <label>
                            JX-Team 账户名
                            <input
                                type="text"
                                value={this.state.username}
                                onChange={this.update('username')}
                                className={this.hasError('username') ? 'red-border' : ''}
                            />
                        </label>

                        {isSignup ? (
                            <label>
                                邮箱
                                <input
                                    type="text"
                                    value={this.state.email}
                                    onChange={this.update('email')}
                                    className={this.hasError('email') ? 'red-border' : ''}
                                />
                            </label>
                        ) : null}

                        <label>
                            密码
                            <input
                                type="password"
                                value={this.state.password}
                                onChange={this.update('password')}
                                className={this.hasError('password') ? 'red-border' : ''}
                            />
                        </label>

                        {isSignup ? (
                            <div>
                                <div className="captcha-box">
                                    <label>
                                        <input type="checkbox" /> <p>我不是机器人</p>
                                    </label>
                                    <i className="fas fa-recycle"></i>
                                </div>
                                <div className="age-check">
                                    <label>
                                        <input
                                            id="age-check"
                                            onChange={() => this.toggleChecked()}
                                            type="checkbox"
                                            className={this.hasError('age') ? 'red-border' : ''}
                                        />
                                        我已年满 13 岁，并同意
                                        <Link to="/legal/terms">JX-Team 用户协议</Link>
                                        和
                                        <Link to="/legal/privacy">JX-Team 隐私政策</Link>
                                    </label>
                                </div>
                            </div>
                        ) : null}

                        <button>{isSignup ? '注册' : '登录'}</button>
                        {!isSignup ? (
                            <div className="login-bottom">
                                <p className="forgot-pw" onClick={() => alert('此功能暂未开放')}>
                                    忘记密码？
                                </p>
                                <button className="guest-button" onClick={(e) => this.handleGuest(e)}>
                                    以访客身份登录！
                                </button>
                            </div>
                        ) : null}
                    </form>
                </div>
                {!isSignup ? (
                    <div className="right-login-section">
                        <div className="right-side">
                            <p>加入 JX-Team，探索数十款精彩游戏。</p>
                            <a className="learn-more" target="_blank" href="https://lrharris215.github.io./">
                                了解更多
                            </a>

                            <div className="computerImage">
                                <img src={window.joinPic} alt="电脑示意图" />
                                <p>免费注册，简单易用。</p>
                                <Link className="join-button" to="/signup">
                                    加入 JX-Team
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="right-login-section"></div>
                )}
            </div>
        );
    }
}

export default SessionForm;
