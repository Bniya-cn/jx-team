class Api::Admin::UsersController < Api::Admin::BaseController
  before_action :set_user, only: [:update]

  def index
    users = User.order(created_at: :desc)
    users = users.where('username ILIKE ?', "%#{params[:query]}%") if params[:query].present?
    render json: users.map { |user| user_payload(user) }
  end

  def update
    @user.update!(user_params)
    render json: user_payload(@user)
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: 422
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:admin)
  end

  def user_payload(user)
    {
      id: user.id,
      username: user.username,
      email: user.email,
      admin: user.admin,
      owned_games_count: user.games.count,
      reviews_count: user.reviews.count
    }
  end
end
