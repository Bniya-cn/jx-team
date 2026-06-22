class Api::GamesController < ApplicationController 

    def show
        @game = Game.includes(:game_images, :tags, :genres).find_by_id(params[:id])
        if @game
            render :show
        else
            render json: ["抱歉，找不到您要查看的游戏"], status: 404
        end
    end

    def index
        @games = Game.includes(:game_images, :tags, :genres).order(release_date: :desc)
        @games = @games.where(featured: true) if params[:featured] == 'true'
        if params[:genre].present?
            @games = @games.joins(:genres).where(genres: { slug: params[:genre] }).distinct
        end
        @games = @games.where(developer: params[:developer]) if params[:developer].present?
        @games = @games.where(publisher: params[:publisher]) if params[:publisher].present?
        @games = @games.where(controller_support: true) if params[:filter] == 'controller'
        @games = @games.where('release_date > ?', Date.current) if params[:filter] == 'upcoming'
        if params[:filter] == 'vr'
            @games = @games.joins(:genres).where(genres: { slug: 'vr' }).distinct
        end
        if params[:filter] == 'specials'
            @games = @games.where('sale_price IS NOT NULL OR featured = ?', true)
        end
        if params[:tag].present?
            @games = @games.joins(:tags).where(tags: { slug: params[:tag] })
        end
        @games = @games.reorder(release_date: :desc) if params[:sort] == 'new'
        render :index
    end

    def featured
        @games = Game.includes(:game_images, :tags, :genres).where(featured: true).order(release_date: :desc)
        render :index
    end


end
