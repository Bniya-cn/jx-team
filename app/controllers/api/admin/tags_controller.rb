class Api::Admin::TagsController < Api::Admin::BaseController
  before_action :set_tag, only: [:update, :destroy]

  def index
    render json: Tag.order(:name).map { |tag| tag_payload(tag) }
  end

  def create
    tag = Tag.create!(tag_params)
    render json: tag_payload(tag), status: :created
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: 422
  end

  def update
    @tag.update!(tag_params)
    render json: tag_payload(@tag)
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: 422
  end

  def destroy
    @tag.destroy!
    head :no_content
  end

  private

  def set_tag
    @tag = Tag.find(params[:id])
  end

  def tag_params
    params.require(:tag).permit(:name, :slug)
  end

  def tag_payload(tag)
    {
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      games_count: tag.games.count
    }
  end
end
