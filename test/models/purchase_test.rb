require 'test_helper'

class PurchaseTest < ActiveSupport::TestCase
  def setup
    @user = User.create!(username: 'buyer', email: 'buy@example.com', password: 'secret12')
    @game = Game.create!(
      title: 'Buy Game',
      developer: 'Dev',
      publisher: 'Pub',
      price: 2000,
      release_date: Date.today,
      genre: 'rpg'
    )
  end

  test '成功创建购买记录' do
    purchase = Purchase.create!(buyerId: @user.id, gameId: @game.id)
    assert purchase.persisted?
  end

  test '同一用户不能重复购买同一游戏' do
    Purchase.create!(buyerId: @user.id, gameId: @game.id)
    duplicate = Purchase.new(buyerId: @user.id, gameId: @game.id)
    assert_not duplicate.valid?
  end
end
