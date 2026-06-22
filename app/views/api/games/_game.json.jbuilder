json.extract! game, :id, :title, :description, :developer, :publisher, :price, :release_date, :featured, :genre, :controller_support, :sale_price
json.genres game.genres.order(:name).pluck(:slug)
json.tags game.tags.pluck(:slug)
json.gameImages game.game_images.each_with_object({}) { |image, images| images[image.id] = { id: image.id, img_type: image.img_type, img_url: image.img_url } }
