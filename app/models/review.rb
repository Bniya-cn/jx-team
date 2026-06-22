class Review < ApplicationRecord
    validates :author_id, :game_id, presence: true
    validates :author_id, uniqueness: {scope: :game_id}
    validate :does_author_own_game?

     belongs_to :game,
     foreign_key: :game_id,
     class_name: :Game

     belongs_to :author,
     foreign_key: :author_id,
     class_name: :User
     
    
     def does_author_own_game?
        if !self.author.games.include?(self.game)
            errors.add(:game_id, :must_own)
        end

     end

end
