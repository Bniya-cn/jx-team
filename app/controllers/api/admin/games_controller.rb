class Api::Admin::GamesController < Api::Admin::BaseController
  before_action :set_game, only: [:show, :update]

  def index
    games = Game.includes(:genres, :tags, :game_images).order(updated_at: :desc)
    games = games.where('title ILIKE ?', "%#{params[:query]}%") if params[:query].present?
    games = games.joins(:genres).where(genres: { slug: params[:genre] }).distinct if params[:genre].present?

    render json: games.map { |game| game_payload(game) }
  end

  def show
    render json: game_payload(@game)
  end

  def update
    ActiveRecord::Base.transaction do
      @game.update!(game_params.except(:genre_ids, :tag_ids))
      @game.genre_ids = genre_ids if params[:game].key?(:genre_ids)
      @game.tag_ids = tag_ids if params[:game].key?(:tag_ids)
      sync_primary_genre!(@game)
    end

    @game.reload
    render json: game_payload(@game)
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: 422
  end

  private

  def set_game
    @game = Game.includes(:genres, :tags, :game_images).find(params[:id])
  end

  def game_params
    params.require(:game).permit(
      :title,
      :description,
      :developer,
      :publisher,
      :price,
      :sale_price,
      :release_date,
      :featured,
      :controller_support,
      :genre,
      genre_ids: [],
      tag_ids: []
    )
  end

  def genre_ids
    Array(game_params[:genre_ids]).reject(&:blank?)
  end

  def tag_ids
    Array(game_params[:tag_ids]).reject(&:blank?)
  end

  def sync_primary_genre!(game)
    primary = game_params[:genre].presence || game.genres.order(:name).pluck(:slug).first
    game.update_column(:genre, primary)
  end

  def game_payload(game)
    {
      id: game.id,
      title: game.title,
      developer: game.developer,
      publisher: game.publisher,
      price: game.price,
      sale_price: game.sale_price,
      release_date: game.release_date,
      featured: game.featured,
      controller_support: game.controller_support,
      genre: game.genre,
      genres: game.genres.order(:name).map { |genre| { id: genre.id, slug: genre.slug, name: genre.name } },
      tags: game.tags.order(:name).map { |tag| { id: tag.id, slug: tag.slug, name: tag.name } }
    }
  end
end
