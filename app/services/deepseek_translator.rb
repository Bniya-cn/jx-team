require 'net/http'
require 'json'

# DeepSeek 翻译服务：API Key 仅存于服务端环境变量
class DeepseekTranslator
  API_URL = URI('https://api.deepseek.com/chat/completions')
  MAX_TEXTS = 50
  MAX_CHARS = 8000

  class << self
    def translate(texts:, source_lang:, target_lang:)
      cleaned = Array(texts).map(&:to_s).reject(&:blank?)
      return { translations: [], error: '没有可翻译的文本' } if cleaned.empty?

      if cleaned.join.length > MAX_CHARS || cleaned.length > MAX_TEXTS
        return { translations: [], error: "单次最多 #{MAX_TEXTS} 条或 #{MAX_CHARS} 字符" }
      end

      api_key = ENV['DEEPSEEK_API_KEY']
      if api_key.blank?
        return {
          translations: placeholder_translations(cleaned, target_lang),
          placeholder: true,
          message: '未配置 DEEPSEEK_API_KEY，返回占位译文。请在 .env 中设置密钥后重启服务。',
        }
      end

      prompt = build_prompt(cleaned, source_lang, target_lang)
      response_body = call_api(api_key, prompt)
      parsed = JSON.parse(response_body)
      content = parsed.dig('choices', 0, 'message', 'content')
      translations = JSON.parse(content)
      { translations: translations }
    rescue JSON::ParserError
      { translations: [], error: '翻译结果解析失败' }
    rescue StandardError => e
      { translations: [], error: "翻译服务异常：#{e.message}" }
    end

    private

    def build_prompt(texts, source_lang, target_lang)
      from = lang_label(source_lang)
      to = lang_label(target_lang)
      <<~PROMPT
        将以下 JSON 数组中的每条文本从#{from}翻译为#{to}。
        只返回 JSON 数组，顺序与输入一致，不要 markdown 代码块。
        输入：#{texts.to_json}
      PROMPT
    end

    LANG_LABELS = {
      'zh' => '中文',
      'en' => '英文',
      'ja' => '日文',
      'ko' => '韩文',
    }.freeze

    def lang_label(code)
      LANG_LABELS[code.to_s] || code.to_s
    end

    def call_api(api_key, prompt)
      http = Net::HTTP.new(API_URL.host, API_URL.port)
      http.use_ssl = true
      http.read_timeout = 60
      req = Net::HTTP::Post.new(API_URL)
      req['Authorization'] = "Bearer #{api_key}"
      req['Content-Type'] = 'application/json'
      req.body = {
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
      }.to_json
      res = http.request(req)
      raise "DeepSeek HTTP #{res.code}" unless res.is_a?(Net::HTTPSuccess)
      res.body
    end

    # 未配置 API Key 时的占位译文，便于本地演示 UI
    def placeholder_translations(texts, target_lang)
      prefix = { 'en' => '[EN]', 'zh' => '[中文]', 'ja' => '[JA]', 'ko' => '[KO]' }[target_lang] || "[#{target_lang}]"
      texts.map { |t| "#{prefix} #{t}" }
    end
  end
end
