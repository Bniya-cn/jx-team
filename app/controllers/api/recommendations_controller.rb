class Api::RecommendationsController < ApplicationController
  before_action :require_logged_in

  # 伪好友推荐：根据已购游戏的 genre 推荐未拥有的同类游戏
  def index
    owned_ids = current_user.games.pluck(:id)
    genres = current_user.games.pluck(:genre).compact.uniq

    games = if genres.empty?
              Game.includes(:game_images, :tags).where.not(id: owned_ids).limit(6)
            else
              Game.includes(:game_images, :tags).where(genre: genres).where.not(id: owned_ids).limit(6)
            end

    @games = games
    render 'api/games/index'
  end
end
