class Api::CuratorsController < ApplicationController
  def index
    picks = CuratorPick.includes(:game).ordered
    render json: picks.map do |pick|
      {
        id: pick.id,
        curator_name: pick.curator_name,
        note: pick.note,
        position: pick.position,
        game_id: pick.game_id,
        game_title: pick.game.title
      }
    end
  end
end
