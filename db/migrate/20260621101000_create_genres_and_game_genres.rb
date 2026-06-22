class CreateGenresAndGameGenres < ActiveRecord::Migration[5.2]
  def change
    create_table :genres do |t|
      t.string :name, null: false
      t.string :slug, null: false

      t.timestamps
    end
    add_index :genres, :slug, unique: true

    create_table :game_genres do |t|
      t.references :game, null: false, foreign_key: true
      t.references :genre, null: false, foreign_key: true

      t.timestamps
    end
    add_index :game_genres, [:game_id, :genre_id], unique: true
  end
end
