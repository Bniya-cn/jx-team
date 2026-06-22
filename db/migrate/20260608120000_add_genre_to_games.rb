class AddGenreToGames < ActiveRecord::Migration[5.2]
  def change
    add_column :games, :genre, :string
    add_index :games, :genre
  end
end
