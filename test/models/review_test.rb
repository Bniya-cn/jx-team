require 'test_helper'

class ReviewTest < ActiveSupport::TestCase
  def setup
    @user = User.create!(username: 'reviewer', email: 'rev@example.com', password: 'secret12')
    @game = Game.create!(
      title: 'Test Game',
      developer: 'Dev',
      publisher: 'Pub',
      price: 1000,
      release_date: Date.today,
      genre: 'indie'
    )
  end

  test '未拥有游戏时不能评论' do
    review = Review.new(author_id: @user.id, game_id: @game.id, body: '好玩', recommended: true)
    assert_not review.valid?
    assert review.errors[:game_id].present?
  end

  test '拥有游戏后可以评论' do
    Purchase.create!(buyerId: @user.id, gameId: @game.id)
    review = Review.create!(author_id: @user.id, game_id: @game.id, body: '好玩', recommended: true)
    assert review.persisted?
  end

  test '同一用户对同一游戏只能评论一次' do
    Purchase.create!(buyerId: @user.id, gameId: @game.id)
    Review.create!(author_id: @user.id, game_id: @game.id, body: '第一条', recommended: true)
    duplicate = Review.new(author_id: @user.id, game_id: @game.id, body: '第二条', recommended: false)
    assert_not duplicate.valid?
  end
end
