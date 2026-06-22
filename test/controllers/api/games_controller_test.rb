require 'test_helper'

class Api::GamesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @rpg = Genre.create!(name: '角色扮演', slug: 'rpg')
    @adventure = Genre.create!(name: '冒险', slug: 'adventure')
    @racing = Genre.create!(name: '竞速', slug: 'racing')
    @strategy = Genre.create!(name: '策略', slug: 'strategy')
    @vr = Genre.create!(name: '虚拟现实', slug: 'vr')

    @featured = Game.create!(
      title: 'Sale RPG',
      developer: 'Supergiant Games',
      publisher: 'Supergiant Games',
      price: 4000,
      sale_price: 2000,
      release_date: Date.new(2024, 1, 1),
      featured: true,
      genre: 'rpg'
    )
    @featured.genres << @rpg
    @featured.game_images.create!(img_type: 'title-card', img_url: 'https://example.com/featured.jpg')
    @featured.tags.create!(name: 'Roguelike', slug: 'roguelike')

    @puzzle = Game.create!(
      title: 'Puzzle Adventure',
      developer: 'Valve',
      publisher: 'Valve',
      price: 2000,
      release_date: Date.new(2023, 1, 1),
      genre: 'adventure'
    )
    @puzzle.genres << @adventure
    @puzzle.tags.create!(name: '解谜', slug: 'puzzle')

    @story = Game.create!(
      title: 'Story RPG',
      developer: 'Larian Studios',
      publisher: 'Larian Studios',
      price: 6000,
      release_date: Date.new(2025, 1, 1),
      genre: 'rpg'
    )
    @story.genres << @rpg
    @story.tags.create!(name: '剧情丰富', slug: 'story-rich')

    @upcoming = Game.create!(
      title: 'Future Racer',
      developer: 'Playground Games',
      publisher: 'Xbox Game Studios',
      price: 5000,
      release_date: Date.current + 30,
      genre: 'racing',
      controller_support: true
    )
    @upcoming.genres << @racing
    @upcoming.tags.create!(name: '开放世界', slug: 'open-world')

    @vr_game = Game.create!(
      title: 'VR Escape',
      developer: 'VR Studio',
      publisher: 'VR Studio',
      price: 3500,
      release_date: Date.new(2024, 5, 1),
      genre: 'adventure'
    )
    @vr_game.genres << [@adventure, @vr]
  end

  test '详情接口返回统一游戏结构' do
    get api_game_url(@featured), as: :json
    assert_response :success

    body = JSON.parse(response.body)
    assert_equal @featured.title, body['title']
    assert_equal ['roguelike'], body['tags']
    assert_equal ['rpg'], body['genres']
    assert body['gameImages'].is_a?(Hash)
    assert body['gameImages'].values.any? { |image| image['img_type'] == 'title-card' }
  end

  test '列表接口支持 featured 和 genre' do
    get api_games_url, params: { featured: 'true' }, as: :json
    assert_response :success
    body = JSON.parse(response.body)
    assert_equal [@featured.id.to_s], body.keys

    get api_games_url, params: { genre: 'rpg' }, as: :json
    assert_response :success
    body = JSON.parse(response.body)
    assert_equal [@story.id, @featured.id].sort, body.keys.map(&:to_i).sort
  end

  test '列表接口支持 developer 和 publisher' do
    get api_games_url, params: { developer: 'Valve' }, as: :json
    assert_response :success
    body = JSON.parse(response.body)
    assert_equal [@puzzle.id], body.keys.map(&:to_i)

    get api_games_url, params: { publisher: 'Xbox Game Studios' }, as: :json
    assert_response :success
    body = JSON.parse(response.body)
    assert_equal [@upcoming.id], body.keys.map(&:to_i)
  end

  test '列表接口支持 tag 和按新品排序' do
    get api_games_url, params: { tag: 'roguelike' }, as: :json
    assert_response :success
    body = JSON.parse(response.body)
    assert_equal [@featured.id], body.keys.map(&:to_i)

    get api_games_url, params: { sort: 'new' }, as: :json
    assert_response :success
    body = JSON.parse(response.body)
    ordered_ids = body.keys.map(&:to_i)
    assert_equal @upcoming.id, ordered_ids.first
  end

  test '列表接口支持 specials controller 和 upcoming' do
    get api_games_url, params: { filter: 'specials' }, as: :json
    assert_response :success
    body = JSON.parse(response.body)
    assert_includes body.keys.map(&:to_i), @featured.id

    get api_games_url, params: { filter: 'controller' }, as: :json
    assert_response :success
    body = JSON.parse(response.body)
    assert_equal [@upcoming.id], body.keys.map(&:to_i)

    get api_games_url, params: { filter: 'upcoming' }, as: :json
    assert_response :success
    body = JSON.parse(response.body)
    assert_equal [@upcoming.id], body.keys.map(&:to_i)
  end

  test '列表接口支持 vr 分类' do
    get api_games_url, params: { filter: 'vr' }, as: :json
    assert_response :success
    body = JSON.parse(response.body)
    assert_equal [@vr_game.id], body.keys.map(&:to_i)
  end
end
