class Api::TranslationsController < ApplicationController
  def create
    texts = params[:texts]
    langs = %w[zh en ja ko]
    source_lang = params[:source_lang].presence_in(langs) || 'zh'
    target_lang = params[:target_lang].presence_in(langs) || 'en'

    result = DeepseekTranslator.translate(
      texts: texts,
      source_lang: source_lang,
      target_lang: target_lang
    )

    if result[:error]
      render json: { error: result[:error] }, status: 422
    else
      render json: result
    end
  end
end
