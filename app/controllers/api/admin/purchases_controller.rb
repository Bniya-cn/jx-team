class Api::Admin::PurchasesController < Api::Admin::BaseController
  def index
    purchases = Purchase.includes(:buyer, :game).order(created_at: :desc)
    render json: purchases.map do |purchase|
      {
        id: purchase.id,
        buyer_id: purchase.buyerId,
        buyer_username: purchase.buyer.username,
        game_id: purchase.gameId,
        game_title: purchase.game.title,
        created_at: purchase.created_at
      }
    end
  end
end
