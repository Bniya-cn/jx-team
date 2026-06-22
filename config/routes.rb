Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root to: 'root#root'

  namespace :api, defaults:  {format: :json} do 
    resources :users, only: [:create, :show]
    resource :session, only: [:create, :destroy]
    get "/games/featured", to: 'games#featured'
    get 'news_items', to: 'news#index', as: :news_items
    get 'curator_picks', to: 'curators#index', as: :curator_picks
    resources :games, only: [:show, :index] do
      get "reviews", to: 'reviews#game_reviews'
      post "reviews", to: 'reviews#new_game_review'
    end
    resources :reviews, only: [:destroy, :update]
    resources :purchases, only:[:create]
    get 'stats', to: 'stats#show'
    get 'activities', to: 'activities#index'
    get 'recommendations', to: 'recommendations#index'
    post 'translate', to: 'translations#create'

    namespace :admin do
      resource :dashboard, only: [:show], controller: :dashboard
      resources :games, only: [:index, :show, :update]
      resources :genres, only: [:index, :create, :update, :destroy]
      resources :tags, only: [:index, :create, :update, :destroy]
      resources :news_items, only: [:index, :create, :update, :destroy]
      resources :curator_picks, only: [:index, :create, :update, :destroy]
      resources :users, only: [:index, :update]
      resources :purchases, only: [:index]
      resources :reviews, only: [:index, :destroy]
    end
  end
end
