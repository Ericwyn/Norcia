# Norcia 魔改版
一个简单的静态博客框架

Norcia 原项目是纯 js 渲染，魔改版将使用 go 直接渲染出 html 静态文件

渲染之后的项目见 [ericwyn.github.io](https://github.com/Ericwyn/ericwyn.github.io)

## 项目结构
 - `document` 文件夹用来存放博文 markdown 文件
 - `config.json` 作为静态博客的配置文件以及博客文章索引,该文件在初次设定好个人信息后可由 Norcia 程序自动更新与维护, 详情请看下文介绍
