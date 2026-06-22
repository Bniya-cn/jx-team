class Api::SessionsController < ApplicationController 
    def create
        @user = User.find_by_credentials(
            params[:user][:username],
            params[:user][:password]
        )
        if @user
            login!(@user)
            render 'api/users/show'
        else
            render json: ["您输入的账户名或密码不正确。"], status: 401
        end
    end

    def destroy
        if current_user
            logout!
            render json: {}
        else
            render json: ["您尚未登录！"], status: 404
        end
    end
end