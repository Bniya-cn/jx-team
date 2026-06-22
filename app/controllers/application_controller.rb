class ApplicationController < ActionController::Base

    helper_method :current_user, :logged_in?

    def current_user
        @current_user ||= User.find_by(session_token: session[:session_token])
    end

    def login!(user)
        user.reset_session_token!
        session[:session_token] = user.session_token
        @current_user = user;
    end
    
    def logged_in?
        !!current_user
    end

    def logout!
        current_user.reset_session_token!
        session[:session_token] = nil
        @current_user = nil
    end

    def require_logged_in
         unless current_user
            render json: { base: ['凭据无效，请先登录'] }, status: 401
        end
    end

    def require_admin
        return if current_user&.admin?

        render json: { base: ['您没有管理员权限'] }, status: 403
    end
end
