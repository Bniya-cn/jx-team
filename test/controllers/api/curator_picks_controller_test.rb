require 'test_helper'

class Api::CuratorPicksControllerTest < ActionDispatch::IntegrationTest
  def setup
    @game = Game.create!(
      title: 'Curator Game',
      developer: 'Studio',
      publisher: 'Studio',
      price: 2600,
      release_date: Date.new(2024, 1, 1),
      genre: 'action'
    )
    CuratorPick.create!(
      curator_name: 'Alpha',
      note: 'Great pick',
      game: @game,
      position: 1
    )
  end

  test '公开鉴赏家接口返回数据' do
    get api_curator_picks_url, as: :json
    assert_response :success

    body = JSON.parse(response.body)
    assert_equal 1, body.length
    assert_equal 'Alpha', body.first['curator_name']
    assert_equal @game.id, body.first['game_id']
  end
end
