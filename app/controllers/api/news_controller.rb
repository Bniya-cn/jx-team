class Api::NewsController < ApplicationController
  def index
    items = NewsItem.includes(:game).ordered
    render json: items.map do |item|
      {
        id: item.id,
        title: item.title,
        summary: item.summary,
        published_on: item.published_on,
        game_id: item.game_id,
        game_title: item.game.title
      }
    end
  end
end
