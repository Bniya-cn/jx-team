class CreateNewsItems < ActiveRecord::Migration[5.2]
  def change
    create_table :news_items do |t|
      t.string :title, null: false
      t.text :summary, null: false
      t.references :game, null: false, foreign_key: true
      t.date :published_on, null: false
      t.integer :position, null: false, default: 0

      t.timestamps
    end

    add_index :news_items, [:published_on, :position]
  end
end
