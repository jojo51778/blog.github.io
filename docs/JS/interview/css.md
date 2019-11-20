
# CSS

## CSS选择器的优先级是怎样的？
CSS选择器的优先级是：内联 > ID选择器 > 类选择器(伪类) > 标签选择器(伪元素)
## 伪类伪元素？
![伪类](http://www.alloyteam.com/wp-content/uploads/2016/05/%E4%BC%AA%E7%B1%BB.png)
![伪元素](http://www.alloyteam.com/wp-content/uploads/2016/05/%E4%BC%AA%E5%85%83%E7%B4%A0.png)

## link和@import的区别？

- link属于XHTML标签，而@import是CSS提供的。
- 页面被加载时，link会同时被加载，而@import引用的CSS会等到页面被加载完再加载。
- @import只在IE 5以上才能识别，而link是XHTML标签，无兼容问题。
- link方式的样式权重高于@import的权重。
- 使用dom控制样式时的差别。当使用javascript控制dom去改变样式的时候，只能使用link标签，因为@import不是dom可以控制的

## 有哪些方式（CSS）可以隐藏页面元素？
- `opacity:0`：本质上是将元素的透明度将为0，就看起来隐藏了，但是依然占据空间且可以交互
- `visibility:hidden`: 与上一个方法类似的效果，占据空间，但是不可以交互了
- `overflow:hidden`: 这个只隐藏元素溢出的部分，但是占据空间且不可交互
- `display:none`: 这个是彻底隐藏了元素，元素从文档流中消失，既不占据空间也不交互，也不影响布局
- `z-index:-9999`: 原理是将层级放到底部，这样就被覆盖了，看起来隐藏了
- `transform: scale(0,0)`: 平面变换，将元素缩放为0，但是依然占据空间，但不可交互

## em\px\rem区别？
- px：绝对单位，页面按精确像素展示。
- em：相对单位，基准点为父节点字体的大小，如果自身定义了font-size按自身来计算（浏览器默认字体是16px），整个页面内1em不是一个固定的值。
- rem：相对单位，可理解为”root em”, 相对根节点html的字体大小来计算，CSS3新加属性，chrome/firefox/IE9+支持

## 如何理解层叠上下文？
层叠上下文是HTML元素的三维概念，这些HTML元素在一条假想的相对于面向（电脑屏幕的）视窗或者网页的用户的z轴上延伸，HTML元素依据其自身属性按照优先级顺序占用层叠上下文的空间。`很高大上，其实就是叠罗汉`。
触发条件:
- `z-index`值不为`auto`的`flex`项(父元素`display:flex|inline-flex`).
- 元素的`opacity`值不是`1`.
- 元素的`transform`值不是`none`.
- 元素`mix-blend-mode`值不是`normal`.
- 元素的`filter`值不是`none`.
- 元素的`isolation`值是`isolate`.(隔离)
- `will-change`指定的属性值为上面任意一个。
- 元素的`-webkit-overflow-scrolling`设为`touch`

## 清除浮动有哪些方法？
- 空div方法：<div style="clear:both;"></div>
- Clearfix 方法
```css
.clearfix::after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}
```
- 父容器overflow: auto或overflow: hidden方法，使用BFC

## 媒体查询
媒体查询就是在规定尺寸内做一些改变的响应适配
```html
<!-- link元素中的CSS媒体查询 -->
<link rel="stylesheet" media="(max-width: 800px)" href="example.css" />

<!-- 样式表中的CSS媒体查询 -->
<style>
@media (max-width: 600px) {
  .facet_sidebar {
    display: none;
  }
}
</style>
```

## 盒模型
从`box-sizing`看就好，`content-box`是 标准盒模型，`border-box`是怪异盒模型，

`content-box`: 元素宽度为`content`

`border-box`: 元素宽度为`content` + `padding` + `border`

有些时候而怪异盒模型其实利于日常开发，便于宽高控制

## BFC
块级格式上下文

形成条件:

- `position: fixed/absolute`
- `float` `不为none`
- `overflow`不为`visible`
- `display`的值为`inline-block`、`table-cell`、`table-caption`

作用是什么？

防止margin发生重叠,参考[mdn](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing)

两栏布局，防止文字环绕等
```html
<style>
.div1 {
  float: left;
  width: 300px;
  background-color: pink;
  height: calc(100vh - 100px);
}

.div2 {
  background-color: black;
  height: 100vh;
  overflow: hidden; // 如果删除则两栏布局失败
}
</style>
<div class="div1"></div>
<div class="div2"></div>
```

## 为什么有时候人们用translate来改变位置而不是定位？
`translate()`是`transform`的一个值。改变`transform`或`opacity`不会触发浏览器重新布局（`reflow`）或重绘（`repaint`），只会触发复合（`compositions`）。而改变`绝对定位`会触发重新布局，进而触发重绘和复合。transform使浏览器为元素创建一个`GPU` 图层，但改变绝对定位会使用到 `CPU`。 因此`translate()`更高效，可以缩短平滑动画的绘制时间。
而`translate`改变位置时，元素依然会占据其原始空间，`绝对定位`就不会发生这种情况。

## flex布局

参考阮一峰[Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)
[Flex 布局教程：实例篇](http://www.ruanyifeng.com/blog/2015/07/flex-examples.html)
