class CuratorPick < ApplicationRecord
  validates :curator_name, :note, presence: true

  belongs_to :game

  scope :ordered, -> { order(position: :asc, created_at: :desc) }
end
