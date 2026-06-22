require 'test_helper'

class Api::TranslationsControllerTest < ActionDispatch::IntegrationTest
  test '翻译接口返回译文数组' do
    post api_translate_url,
         params: { texts: ['你好'], source_lang: 'zh', target_lang: 'en' },
         as: :json
    assert_response :success
    body = JSON.parse(response.body)
    assert body['translations'].is_a?(Array)
    assert_equal 1, body['translations'].length
  end

  test '空文本返回错误' do
    post api_translate_url, params: { texts: [], target_lang: 'en' }, as: :json
    assert_response :unprocessable_entity
  end

  test '支持日文韩文参数' do
    post api_translate_url,
         params: { texts: ['你好'], source_lang: 'zh', target_lang: 'ja' },
         as: :json
    assert_response :success
    body = JSON.parse(response.body)
    assert_equal 1, body['translations'].length
  end
end
