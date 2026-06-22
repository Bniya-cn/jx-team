require 'test_helper'

class Api::NewsItemsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @game = Game.create!(
      title: 'News Game',
      developer: 'Studio',
      publisher: 'Studio',
      price: 2500,
      release_date: Date.new(2024, 1, 1),
      genre: 'action'
    )
    NewsItem.create!(
      title: 'First news',
      summary: 'Summary body',
      game: @game,
      published_on: Date.new(2026, 1, 1)
    )
  end

  test '公开新闻接口返回数据' do
    get api_news_items_url, as: :json
    assert_response :success

    body = JSON.parse(response.body)
    assert_equal 1, body.length
    assert_equal 'First news', body.first['title']
    assert_equal @game.id, body.first['game_id']
  end
end
