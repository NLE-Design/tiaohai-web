# 跳海AI App

这是一个为跳海酒馆开发的iOS应用，提供AI酒品推荐、酒单浏览、社区互动等功能。

## 功能特点

1. AI酒品推荐
   - 基于Dify API的智能对话系统
   - 根据用户喜好推荐合适的酒品
   - 实时对话交互

2. 酒单浏览
   - 展示所有精酿啤酒
   - 详细的酒品信息（酒精度、风格、价格等）
   - 分类展示

3. 社区互动
   - 用户发帖功能
   - 点赞和评论功能
   - 实时更新

4. 个人中心
   - 用户信息管理
   - 设置选项
   - 通知管理

## 技术栈

- SwiftUI
- Swift
- Dify API
- MVVM架构

## 系统要求

- iOS 15.0+
- Xcode 13.0+
- Swift 5.5+

## 安装说明

1. 克隆项目
```bash
git clone [项目地址]
```

2. 安装依赖
```bash
pod install
```

3. 打开项目
```bash
open TiaoHai.xcworkspace
```

4. 运行项目
- 选择目标设备
- 点击运行按钮或按Command+R

## 配置说明

1. Dify API配置
- 在`DifyService.swift`中配置API密钥
- 确保网络连接正常

2. 其他配置
- 根据需要修改`Info.plist`中的配置
- 调整UI主题和样式

## 贡献指南

1. Fork项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 许可证

MIT License 