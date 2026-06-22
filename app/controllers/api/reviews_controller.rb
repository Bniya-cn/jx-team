class Api::ReviewsController < ApplicationController 

    before_action :require_logged_in, only:[:new_game_review, :destroy]
    
    def game_reviews
        @reviews = Review.where(game_id: params[:game_id])
        render :index
    end

    def new_game_review
        @review = Review.new(review_params)
     
        if  @review.save
            render :show
        else
            render json: @review.errors.full_messages, status: 400
        end
    end

    def destroy
        @review = Review.find(params[:id])
        if @review 
            @review.destroy
            render json: @review
        else
            render json: ["找不到该评论"], status: 404
        end

    end

    def update
        @review = Review.find(params[:id])
        if @review && @review.update(review_params)
            
            render json: @review
        else
            render json: @review.errors.full_messages, status: 400
        end
    end

    private 

    def review_params 
        params.require(:review).permit(:game_id, :author_id, :recommended, :body)
    end
end