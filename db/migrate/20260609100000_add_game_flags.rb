class AddGameFlags < ActiveRecord::Migration[5.2]
  def change
    add_column :games, :controller_support, :boolean, default: false
    add_column :games, :sale_price, :integer
    add_index :games, :controller_support
  end
end
