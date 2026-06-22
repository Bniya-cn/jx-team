class Api::Admin::ReviewsController < Api::Admin::BaseController
  before_action :set_review, only: [:destroy]

  def index
    reviews = Review.includes(:author, :game).order(created_at: :desc)
    render json: reviews.map do |review|
      {
        id: review.id,
        author_id: review.author_id,
        author_username: review.author.username,
        game_id: review.game_id,
        game_title: review.game.title,
        recommended: review.recommended,
        body: review.body,
        created_at: review.created_at
      }
    end
  end

  def destroy
    @review.destroy!
    head :no_content
  end

  private

  def set_review
    @review = Review.find(params[:id])
  end
end
