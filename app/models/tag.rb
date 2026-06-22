class Tag < ApplicationRecord
  validates :name, :slug, presence: true
  validates :slug, uniqueness: true

  has_many :game_tags, dependent: :destroy
  has_many :games, through: :game_tags
end
