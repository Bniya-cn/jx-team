class Api::ActivitiesController < ApplicationController
  # 伪动态：聚合最新评论与购买记录
  def index
    review_items = Review.order(created_at: :desc).limit(10).map do |r|
      {
        type: 'review',
        username: r.author.username,
        game_title: r.game.title,
        body: r.body.to_s.truncate(80),
        created_at: r.created_at,
      }
    end

    purchase_items = Purchase.order(created_at: :desc).limit(10).map do |p|
      {
        type: 'purchase',
        username: p.buyer.username,
        game_title: p.game.title,
        created_at: p.created_at,
      }
    end

    feed = (review_items + purchase_items).sort_by { |i| i[:created_at] }.reverse.first(15)
    render json: feed
  end
end
