class Api::Admin::DashboardController < Api::Admin::BaseController
  def show
    render json: {
      counts: {
        games: Game.count,
        users: User.count,
        purchases: Purchase.count,
        reviews: Review.count,
        news_items: NewsItem.count,
        curator_picks: CuratorPick.count
      },
      recent_games: Game.order(created_at: :desc).limit(5).pluck(:id, :title).map { |id, title| { id: id, title: title } },
      recent_purchases: Purchase.includes(:buyer, :game).order(created_at: :desc).limit(5).map do |purchase|
        {
          id: purchase.id,
          buyer: purchase.buyer.username,
          game: purchase.game.title,
          created_at: purchase.created_at
        }
      end,
      recent_reviews: Review.includes(:author, :game).order(created_at: :desc).limit(5).map do |review|
        {
          id: review.id,
          author: review.author.username,
          game: review.game.title,
          recommended: review.recommended,
          created_at: review.created_at
        }
      end
    }
  end
end
