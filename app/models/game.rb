class Game < ApplicationRecord

    validates :title, :price, :publisher, :developer, :release_date, presence: true;

    has_many :game_images

    has_many :purchases,
    foreign_key: :gameId,
    class_name: :Purchase

    has_many :buyers,
    through: :purchases,
    source: :buyer

    has_many :reviews,
    foreign_key: :game_id, 
    class_name: :Review

    has_many :reviewers,
    through: :reviews, 
    source: :author

    has_many :game_tags, dependent: :destroy
    has_many :tags, through: :game_tags
    has_many :game_genres, dependent: :destroy
    has_many :genres, through: :game_genres
    has_many :news_items, dependent: :destroy
    has_many :curator_picks, dependent: :destroy
end
