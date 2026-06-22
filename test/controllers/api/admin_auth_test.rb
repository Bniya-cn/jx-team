require 'test_helper'

class Api::AdminAuthTest < ActionDispatch::IntegrationTest
  def setup
    @game = Game.create!(
      title: 'Admin Game',
      developer: 'Studio',
      publisher: 'Studio',
      price: 2500,
      release_date: Date.new(2024, 1, 1),
      genre: 'action'
    )
    @user = User.create!(username: 'NormalUser', email: 'normal@example.com', password: 'password')
    @admin = User.create!(username: 'AdminUser', email: 'admin@example.com', password: 'password', admin: true)
  end

  test '未登录访问后台接口返回 401' do
    get api_admin_dashboard_url, as: :json
    assert_response 401
  end

  test '非管理员访问后台接口返回 403' do
    post api_session_url, params: { user: { username: @user.username, password: 'password' } }, as: :json
    assert_response :success

    get api_admin_dashboard_url, as: :json
    assert_response 403
  end

  test '管理员可访问后台接口并更新游戏' do
    genre = Genre.create!(name: '动作', slug: 'action')
    post api_session_url, params: { user: { username: @admin.username, password: 'password' } }, as: :json
    assert_response :success

    get api_admin_dashboard_url, as: :json
    assert_response :success

    patch api_admin_game_url(@game),
          params: { game: { featured: true, genre_ids: [genre.id] } },
          as: :json
    assert_response :success

    @game.reload
    assert @game.featured
    assert_equal ['action'], @game.genres.pluck(:slug)
  end
end
