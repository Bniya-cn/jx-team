class Genre < ApplicationRecord
  validates :name, :slug, presence: true
  validates :slug, uniqueness: true

  has_many :game_genres, dependent: :destroy
  has_many :games, through: :game_genres
end
