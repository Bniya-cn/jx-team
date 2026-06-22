class CreateTags < ActiveRecord::Migration[5.2]
  def change
    create_table :tags do |t|
      t.string :name, null: false
      t.string :slug, null: false
      t.timestamps
    end
    add_index :tags, :slug, unique: true

    create_table :game_tags do |t|
      t.integer :game_id, null: false
      t.integer :tag_id, null: false
      t.timestamps
    end
    add_index :game_tags, [:game_id, :tag_id], unique: true
  end
end
