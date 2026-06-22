class Api::PurchasesController < ApplicationController 

    before_action :require_logged_in, only: [:create]
    
    def create
        @purchase = Purchase.new(purchase_params)
       
        if @purchase.save
            render json: ["购买成功！"]
        else
            render json: @purchase.errors.full_messages, status: 400
        end

    end

    private

    def purchase_params
        params.require(:purchase).permit(:gameId, :buyerId)
    end
end