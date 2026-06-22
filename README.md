# JX-Team

JX-Team 是一个面向期末演示的校园主题游戏商店项目，整体体验参考 Steam，但现在已经把主链路统一到 Rails 数据库，不再依赖前端运行时直读本地游戏 JSON。

当前可演示的能力包括：

- 注册、登录、退出
- 首页浏览、分类浏览、游戏详情
- 加入购物车、购买入库、愿望单
- 用户评测、探索队列、推荐页、动态页
- 统计、新闻、标签、鉴赏家、帮助、关于等演示页面
- 顶栏多语言切换与划词翻译
- 简易后台管理

## 技术栈

- 后端：Ruby 2.5.1、Rails 5.2、PostgreSQL
- 前端：React 17、Redux、React Router、Webpack 5、SCSS
- 工具脚本：Node.js、Steam 数据抓取脚本、语言文案测试脚本
- 翻译：Rails 代理 DeepSeek 翻译接口，未配置 Key 时返回占位译文

## 快速启动

```bash
bundle install
npm install
bundle exec rails db:setup
npm run build
bundle exec rails server
```

浏览器打开 `http://localhost:3000`，演示账号为 `Guest / password`。

## 重要说明

1. 当前商品主链路已经统一走 Rails 数据库，前端通过 API 读取。
2. 游戏 catalog 仍然来自 `src/mock/games.json` 的导入结果，但运行时不再直接读 JSON。
3. 如果未配置 `DEEPSEEK_API_KEY`，翻译 UI 仍可使用，只是译文为占位内容。
4. 本地愿望单、购物车、部分设置项仍然存储在浏览器本地。

## 文档入口

- [部署教程.md](部署教程.md)
- [使用技术栈.md](使用技术栈.md)
- [已实现的功能.md](已实现的功能.md)
- [当前完成内容文案.md](当前完成内容文案.md)
- [交接计划与未完成事项.md](交接计划与未完成事项.md)

