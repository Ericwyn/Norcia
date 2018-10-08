## 前言
最近接触到了 Spring Cloud ，虽然还没有正式的在生产环境当中使用，但是那种尽量将一个大的整体才分成小的模块的这种想法，让我不明觉历。恰好最近实训当中写的项目是基于 Spring Boot 的，于是打算魔改成一个简单的 Spring Cloud 项目。也天生 Spring Boot 就和 Spring Cloud 无痛融合。

## 基本的想法
 - 将我们的 Spring Boot 项目进行拆分
 - 将拆分的各个模块变成 Spring Cloud 的一个服务
 - 创建 Spring Cloud 里面的服务器发现，来组合和管理各个服务