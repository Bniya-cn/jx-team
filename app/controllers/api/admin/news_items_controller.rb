class Api::Admin::NewsItemsController < Api::Admin::BaseController
  before_action :set_news_item, only: [:update, :destroy]

  def index
    render json: NewsItem.includes(:game).ordered.map { |item| news_payload(item) }
  end

  def create
    item = NewsItem.create!(news_item_params)
    render json: news_payload(item), status: :created
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: 422
  end

  def update
    @news_item.update!(news_item_params)
    render json: news_payload(@news_item)
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: 422
  end

  def destroy
    @news_item.destroy!
    head :no_content
  end

  private

  def set_news_item
    @news_item = NewsItem.find(params[:id])
  end

  def news_item_params
    params.require(:news_item).permit(:title, :summary, :game_id, :published_on, :position)
  end

  def news_payload(item)
    {
      id: item.id,
      title: item.title,
      summary: item.summary,
      game_id: item.game_id,
      game_title: item.game.title,
      published_on: item.published_on,
      position: item.position
    }
  end
end
