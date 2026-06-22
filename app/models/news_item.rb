class NewsItem < ApplicationRecord
  validates :title, :summary, :published_on, presence: true

  belongs_to :game

  scope :ordered, -> { order(published_on: :desc, position: :asc, created_at: :desc) }
end
