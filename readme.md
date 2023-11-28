# 脑电电极在哪里

本文将三个东西画在一起，它们分别是果冻形式的大脑、脑内功能区的代表性节点和标准配列的脑电电极。它展示了脑电电极如何将大脑包裹起来。代码托管在了 Github 的代码仓库。

[https://github.com/listenzcc/where-are-the-eeg-sensors](https://github.com/listenzcc/where-are-the-eeg-sensors)

---
[toc]

## 标准 10-20 配列的电极位置

下图是标准 10-20 配列的电极位置，它说明脑电电极并不是想摊煎饼一样平铺在头顶，而是像一个网兜一样将大脑“包裹”起来。可交互的网页如下

[](https://listenzcc.github.io/where-are-the-eeg-sensors/)

![Untitled](%E8%84%91%E7%94%B5%E7%94%B5%E6%9E%81%E5%9C%A8%E5%93%AA%E9%87%8C%20924fa1aa989c4d5b95c2f348035fbe6a/Untitled.png)

![20231128-191058.gif](%E8%84%91%E7%94%B5%E7%94%B5%E6%9E%81%E5%9C%A8%E5%93%AA%E9%87%8C%20924fa1aa989c4d5b95c2f348035fbe6a/20231128-191058.gif)

## 始终面向你的文字

本文涉及两个技术问题，首先是 three.js 如何渲染文字；其次是 javascript 如何通过 module 解决模块间的链式依赖关系。

three.js 渲染文字的原理是将文字当作三维对象加入场景。这个过程分四步

1. 加载字体资源，这是一种字体的渲染规则
2. 将字体资源转换成 geometry
3. 为 geometry 绑定材质（material），生成网格框架（mesh）
4. 将网格框架加入场景（scene）

接下来，由于文字是文字而不是普通的三维物体，这就要求文字始终面对着观察者的眼睛。为了达到目的，需要在观察者改变视角时“立即”对文字三维对象的 z 轴指向进行更新，更新的目的是让它指向观察者。

## Module 依赖与引用

JavaScript 通过 module 解决模块间的链式依赖关系。在JavaScript中，模块系统是一种组织和封装代码的方式，使得代码可以在不同文件中组织，并且可以通过导入和导出语法进行模块之间的通信。在 ES6 之后，JavaScript 引入了原生的模块系统，使得模块的导入和导出变得更加方便和标准化。

通过使用模块系统来解决模块间的链式依赖关系是一种常见的做法。在现代 JavaScript 中，通常使用 ES6 的模块系统来管理模块之间的依赖关系。简单来说，通过这种方式 JavaScript 可以自主寻找需要下载的依赖包，并自动使用它们。当然，如下图右侧所示。在这之前，需要使用 importmap 对包位置的变量进行声明，如下图左侧所示。

![Untitled](%E8%84%91%E7%94%B5%E7%94%B5%E6%9E%81%E5%9C%A8%E5%93%AA%E9%87%8C%20924fa1aa989c4d5b95c2f348035fbe6a/Untitled%201.png)

**`importmap`** 是一个与 JavaScript 模块化相关的提案，它的目标是提供一种方式来配置模块的导入映射关系，从而更灵活地管理模块的依赖关系。与 ES6 模块系统解决模块链式依赖关系的方式不同，**`importmap`** 更侧重于动态配置模块之间的映射关系。

从网络请求页面可以，在这种情况下，它能够动态加载 d3.js 需要的 ES 包，如下左图所示。另外，它还支持依赖包的动态加载，如下右图所示，它是 FontLoader.js 需要加载的头部信息。

![Untitled](%E8%84%91%E7%94%B5%E7%94%B5%E6%9E%81%E5%9C%A8%E5%93%AA%E9%87%8C%20924fa1aa989c4d5b95c2f348035fbe6a/Untitled%202.png)

![Untitled](%E8%84%91%E7%94%B5%E7%94%B5%E6%9E%81%E5%9C%A8%E5%93%AA%E9%87%8C%20924fa1aa989c4d5b95c2f348035fbe6a/Untitled%203.png)

[JavaScript modules - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

[ES6 In Depth: Modules – Mozilla Hacks - the Web developer blog](https://hacks.mozilla.org/2015/08/es6-in-depth-modules/)

[Everything You Need to Know About JavaScript Import Maps](https://www.honeybadger.io/blog/import-maps/)

[<script type="importmap"> - HTML: HyperText Markup Language | MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap)