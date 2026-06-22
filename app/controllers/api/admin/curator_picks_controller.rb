class Api::Admin::CuratorPicksController < Api::Admin::BaseController
  before_action :set_curator_pick, only: [:update, :destroy]

  def index
    render json: CuratorPick.includes(:game).ordered.map { |pick| pick_payload(pick) }
  end

  def create
    pick = CuratorPick.create!(curator_pick_params)
    render json: pick_payload(pick), status: :created
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: 422
  end

  def update
    @curator_pick.update!(curator_pick_params)
    render json: pick_payload(@curator_pick)
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: 422
  end

  def destroy
    @curator_pick.destroy!
    head :no_content
  end

  private

  def set_curator_pick
    @curator_pick = CuratorPick.find(params[:id])
  end

  def curator_pick_params
    params.require(:curator_pick).permit(:curator_name, :note, :game_id, :position)
  end

  def pick_payload(pick)
    {
      id: pick.id,
      curator_name: pick.curator_name,
      note: pick.note,
      game_id: pick.game_id,
      game_title: pick.game.title,
      position: pick.position
    }
  end
end
