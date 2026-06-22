class Api::StatsController < ApplicationController
  def show
    render json: {
      games: Game.count,
      users: User.count,
      reviews: Review.count,
      purchases: Purchase.count,
    }
  end
end
