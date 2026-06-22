# frozen_string_literal: true

require 'json'

GENRE_SLUG_MAP = {
  'action' => 'action',
  'indie' => 'indie',
  'rpg' => 'rpg',
  'action rpg' => 'rpg',
  'jrpg' => 'rpg',
  'strategy' => 'strategy',
  'grand strategy' => 'strategy',
  'adventure' => 'adventure',
  'casual' => 'casual',
  'massively multiplayer' => 'mmo',
  'massively multiplayer online' => 'mmo',
  'racing' => 'racing',
  'simulation' => 'simulation',
  'sports' => 'sports',
  'free to play' => 'free-to-play',
  'early access' => 'early-access',
  'vr' => 'vr'
}.freeze

GENRE_NAMES = {
  'action' => '动作',
  'adventure' => '冒险',
  'casual' => '休闲',
  'early-access' => '抢先体验',
  'free-to-play' => '免费开玩',
  'indie' => '独立',
  'mmo' => '大型多人在线',
  'racing' => '竞速',
  'rpg' => '角色扮演',
  'simulation' => '模拟',
  'sports' => '体育',
  'strategy' => '策略',
  'vr' => '虚拟现实'
}.freeze

PRIMARY_GENRE_ORDER = %w[action adventure rpg strategy simulation sports racing indie casual mmo vr free-to-play early-access].freeze

TAG_RULES = {
  'roguelike' => /roguelike|rogue-like|roguelite/i,
  'puzzle' => /puzzle/i,
  'story-rich' => /story|narrative|choices/i,
  'open-world' => /open world/i
}.freeze

TAG_NAMES = {
  'roguelike' => 'Roguelike',
  'puzzle' => '解谜',
  'story-rich' => '剧情丰富',
  'open-world' => '开放世界'
}.freeze

CATALOG_PATH = Rails.root.join('src/mock/games.json')

def normalize_genres(genres)
  Array(genres).map { |genre| GENRE_SLUG_MAP[genre.to_s.downcase.strip] }.compact.uniq
end

def release_date_for(raw_game)
  return Date.iso8601(raw_game['releaseDateISO']) if raw_game['releaseDateISO'].present?
  return Date.parse(raw_game['releaseDate']) if raw_game['releaseDate'].present?

  Date.current
rescue ArgumentError
  Date.current
end

def primary_genre_for(slugs)
  return 'indie' if slugs.empty?

  PRIMARY_GENRE_ORDER.find { |slug| slugs.include?(slug) } || slugs.first
end

def sale_prices_for(raw_game)
  current_price = raw_game['price'].to_i
  original_price = raw_game['originalPrice'].to_i
  discounted = original_price.positive? && original_price > current_price

  if discounted
    [original_price, current_price]
  else
    [current_price, nil]
  end
end

def featured_flag(raw_game, index)
  return raw_game['featured'] unless raw_game['featured'].nil?

  index < 8
end

def tag_slugs_for(raw_game)
  text = [raw_game['name'], raw_game['shortDescription'], Array(raw_game['categories']).join(' ')].compact.join(' ')

  TAG_RULES.each_with_object([]) do |(slug, pattern), slugs|
    slugs << slug if pattern.match?(text)
  end
end

def game_id_by_title!(catalog_by_title, title)
  game = catalog_by_title[title]
  if !game
    normalized_title = title.to_s.downcase.gsub(/[®™’'′`\u2019]/, '').gsub(/\s+/, ' ').strip
    game = catalog_by_title.values.find do |g|
      g['name'].to_s.downcase.gsub(/[®™’'′`\u2019]/, '').gsub(/\s+/, ' ').strip == normalized_title
    end
  end
  raise "Missing catalog game for title: #{title}" unless game

  game['id'] || game['appid']
end

GameGenre.delete_all
Genre.delete_all
GameTag.delete_all
Tag.delete_all
Review.delete_all
Purchase.delete_all
GameImage.delete_all
CuratorPick.delete_all
NewsItem.delete_all
Game.delete_all
User.delete_all

%w[users games game_images purchases reviews tags game_tags genres game_genres news_items curator_picks].each do |table_name|
  ActiveRecord::Base.connection.reset_pk_sequence!(table_name)
end

catalog = JSON.parse(File.read(CATALOG_PATH))
catalog_by_title = catalog.index_by { |game| game['name'] }
tags_by_slug = {}
genres_by_slug = {}

guest = User.create!(username: 'Guest', email: 'guest@guest.com', password: 'password')
woofs = User.create!(username: 'Woofs', email: 'woofs@woofs.com', password: 'password')
brian = User.create!(username: 'Brian', email: 'brian@brian.com', password: 'password')
admin = User.create!(username: 'Admin', email: 'admin@jx-team.com', password: 'password', admin: true)

catalog.each_with_index do |raw_game, index|
  game_id = raw_game['id'] || raw_game['appid']
  base_price, sale_price = sale_prices_for(raw_game)
  genre_slugs = normalize_genres(raw_game['genres'])
  genre = primary_genre_for(genre_slugs)

  game = Game.create!(
    id: game_id,
    title: raw_game['name'],
    description: raw_game['shortDescription'].presence || raw_game['name'],
    developer: Array(raw_game['developers']).first.presence || 'Unknown Developer',
    publisher: Array(raw_game['publishers']).first.presence || 'Unknown Publisher',
    price: base_price,
    release_date: release_date_for(raw_game),
    featured: featured_flag(raw_game, index),
    genre: genre,
    controller_support: raw_game['controllerSupport'] == true,
    sale_price: sale_price
  )

  genre_slugs.each do |slug|
    genre_record = genres_by_slug[slug] ||= Genre.create!(slug: slug, name: GENRE_NAMES.fetch(slug, slug.titleize))
    GameGenre.create!(game: game, genre: genre_record)
  end

  title_card_url = raw_game['capsuleImage'].presence || raw_game['headerImage'].presence
  if title_card_url
    GameImage.create!(game: game, img_type: 'title-card', img_url: title_card_url)
  end

  screenshots = Array(raw_game['screenshots'])
  if screenshots.empty? && raw_game['headerImage'].present?
    screenshots = [raw_game['headerImage']]
  end

  screenshots.each do |img_url|
    GameImage.create!(game: game, img_type: 'screenshot', img_url: img_url)
  end

  tag_slugs_for(raw_game).each do |slug|
    tag = tags_by_slug[slug] ||= Tag.create!(slug: slug, name: TAG_NAMES.fetch(slug))
    GameTag.create!(game: game, tag: tag)
  end
end

demo_purchases = [
  [guest, 'Stardew Valley'],
  [guest, 'Hades'],
  [guest, 'Hollow Knight'],
  [woofs, 'Subnautica'],
  [woofs, 'Portal 2'],
  [woofs, 'Forza Horizon 5'],
  [brian, 'Sid Meier’s Civilization® VI'],
  [brian, 'Baldur\'s Gate 3'],
  [brian, 'Black Myth: Wukong']
]

demo_purchases.each do |user, title|
  Purchase.create!(
    buyerId: user.id,
    gameId: game_id_by_title!(catalog_by_title, title)
  )
end

demo_reviews = [
  [guest, 'Stardew Valley', '种田和探索节奏很舒服，适合长时间慢慢玩。', true],
  [guest, 'Hades', '战斗手感扎实，死亡后的成长反馈也很上瘾。', true],
  [woofs, 'Subnautica', '海底氛围非常强，但资源收集前期稍微有点拖。', true],
  [brian, 'Sid Meier’s Civilization® VI', '一局下来很容易忘记时间，策略选择很多。', true]
]

demo_reviews.each do |user, title, body, recommended|
  Review.create!(
    author_id: user.id,
    game_id: game_id_by_title!(catalog_by_title, title),
    body: body,
    recommended: recommended
  )
end

news_items = [
  ['《星露谷物语》春季更新现已上线', '新增作物、节日活动与多人联机优化，欢迎回到星露谷。', 'Stardew Valley', Date.new(2026, 3, 15), 1],
  ['《哈迪斯》斩获年度最佳独立游戏', 'Supergiant Games 力作持续热销，地牢冒险再掀热潮。', 'Hades', Date.new(2026, 2, 20), 2],
  ['《深海迷航》探索模式限时免费体验', '潜入外星海底世界，制作装备、驾驶潜艇、智取野生动物。', 'Subnautica', Date.new(2026, 1, 8), 3],
  ['《文明 VI》新 DLC 预告公布', '扩展包将带来新文明、新领袖与全新胜利路线。', 'Sid Meier’s Civilization® VI', Date.new(2025, 12, 1), 4]
]

news_items.each do |title, summary, game_title, published_on, position|
  NewsItem.create!(
    title: title,
    summary: summary,
    game_id: game_id_by_title!(catalog_by_title, game_title),
    published_on: published_on,
    position: position
  )
end

curator_picks = [
  ['鉴赏家 Alpha', 'Roguelike 动作佳作，节奏紧凑，重开价值很高。', 'Hades', 1],
  ['鉴赏家 Beta', '沉浸式探索体验，适合喜欢未知环境与生存设计的玩家。', 'Subnautica', 2],
  ['鉴赏家 Gamma', '独立游戏经典，地图、战斗和氛围都非常完整。', 'Hollow Knight', 3]
]

curator_picks.each do |curator_name, note, game_title, position|
  CuratorPick.create!(
    curator_name: curator_name,
    note: note,
    game_id: game_id_by_title!(catalog_by_title, game_title),
    position: position
  )
end

%w[games game_images tags game_tags genres game_genres purchases reviews news_items curator_picks users].each do |table_name|
  ActiveRecord::Base.connection.reset_pk_sequence!(table_name)
end
