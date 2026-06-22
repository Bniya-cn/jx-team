class Api::Admin::GenresController < Api::Admin::BaseController
  before_action :set_genre, only: [:update, :destroy]

  def index
    render json: Genre.order(:name).map { |genre| genre_payload(genre) }
  end

  def create
    genre = Genre.create!(genre_params)
    render json: genre_payload(genre), status: :created
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: 422
  end

  def update
    @genre.update!(genre_params)
    render json: genre_payload(@genre)
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: 422
  end

  def destroy
    @genre.destroy!
    head :no_content
  end

  private

  def set_genre
    @genre = Genre.find(params[:id])
  end

  def genre_params
    params.require(:genre).permit(:name, :slug)
  end

  def genre_payload(genre)
    {
      id: genre.id,
      name: genre.name,
      slug: genre.slug,
      games_count: genre.games.count
    }
  end
end
