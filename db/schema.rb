# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2026_06_21_103000) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "curator_picks", force: :cascade do |t|
    t.string "curator_name", null: false
    t.text "note", null: false
    t.bigint "game_id", null: false
    t.integer "position", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["game_id"], name: "index_curator_picks_on_game_id"
    t.index ["position"], name: "index_curator_picks_on_position"
  end

  create_table "game_genres", force: :cascade do |t|
    t.bigint "game_id", null: false
    t.bigint "genre_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["game_id", "genre_id"], name: "index_game_genres_on_game_id_and_genre_id", unique: true
    t.index ["game_id"], name: "index_game_genres_on_game_id"
    t.index ["genre_id"], name: "index_game_genres_on_genre_id"
  end

  create_table "game_images", force: :cascade do |t|
    t.integer "game_id", null: false
    t.string "img_url", null: false
    t.string "img_type", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["game_id"], name: "index_game_images_on_game_id"
  end

  create_table "game_tags", force: :cascade do |t|
    t.integer "game_id", null: false
    t.integer "tag_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["game_id", "tag_id"], name: "index_game_tags_on_game_id_and_tag_id", unique: true
  end

  create_table "games", force: :cascade do |t|
    t.string "title", null: false
    t.text "description"
    t.string "developer", null: false
    t.string "publisher", null: false
    t.integer "price", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.date "release_date", null: false
    t.boolean "featured", default: false
    t.string "genre"
    t.boolean "controller_support", default: false
    t.integer "sale_price"
    t.index ["controller_support"], name: "index_games_on_controller_support"
    t.index ["featured"], name: "index_games_on_featured"
    t.index ["genre"], name: "index_games_on_genre"
  end

  create_table "genres", force: :cascade do |t|
    t.string "name", null: false
    t.string "slug", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["slug"], name: "index_genres_on_slug", unique: true
  end

  create_table "news_items", force: :cascade do |t|
    t.string "title", null: false
    t.text "summary", null: false
    t.bigint "game_id", null: false
    t.date "published_on", null: false
    t.integer "position", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["game_id"], name: "index_news_items_on_game_id"
    t.index ["published_on", "position"], name: "index_news_items_on_published_on_and_position"
  end

  create_table "purchases", force: :cascade do |t|
    t.integer "gameId", null: false
    t.integer "buyerId", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["buyerId", "gameId"], name: "index_purchases_on_buyerId_and_gameId", unique: true
    t.index ["buyerId"], name: "index_purchases_on_buyerId"
    t.index ["gameId"], name: "index_purchases_on_gameId"
  end

  create_table "reviews", force: :cascade do |t|
    t.integer "author_id", null: false
    t.integer "game_id", null: false
    t.text "body"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "recommended", default: true
    t.index ["author_id", "game_id"], name: "index_reviews_on_author_id_and_game_id", unique: true
    t.index ["author_id"], name: "index_reviews_on_author_id"
    t.index ["game_id"], name: "index_reviews_on_game_id"
  end

  create_table "tags", force: :cascade do |t|
    t.string "name", null: false
    t.string "slug", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["slug"], name: "index_tags_on_slug", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "username", null: false
    t.string "email", null: false
    t.string "password_digest", null: false
    t.string "session_token", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "admin", default: false, null: false
    t.index ["admin"], name: "index_users_on_admin"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["session_token"], name: "index_users_on_session_token", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  add_foreign_key "curator_picks", "games"
  add_foreign_key "game_genres", "games"
  add_foreign_key "game_genres", "genres"
  add_foreign_key "news_items", "games"
end
