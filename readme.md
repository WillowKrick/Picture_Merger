# **图片拼接网页版**

## 简介:

1.此程序实现了图片的拼接功能;

2.只需多选并拖入你需要合并的文件夹即可合并,将以文件夹名称的方式命名;

3.暂不支持"点击->弹窗选择文件"功能.

4.此功能主要是为哔哩哔哩漫画下载的分割图设计, 人物一分为二影响观感.

你可以在这里找到下载器:https://github.com/Zeal-L/BiliBili-Manga-Downloader

## 实现方法

1.使用了 Promise,Promise.all,async,await 方法实现异步读取文件功能;

2.使用 createReader 和 readEntries 递归读取文件和文件夹;

3.使用 canvas 将拼接的图片隐式渲染,并转换为 png 下载.

## 部署

### 方法一

 1.安装 node.js

 https://nodejs.org/dist/v16.20.0/

2.双击 start.bat, 根据窗口提示操作

### 方法二

直接打开 index.html