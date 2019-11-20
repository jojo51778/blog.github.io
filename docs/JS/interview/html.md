# HTML
## DOCTYPE（文档类型）的作用是什么？

DOCTYPE是HTML5标准网页声明，且必须声明在HTML文档的第一行。来告知浏览器的解析器用什么文档标准解析这个文档，不同的渲染模式会影响到浏览器对于 CSS 代码甚至 JavaScript 脚本的解析

## 浏览器模式

- quirks mode：怪异模式，浏览器使用自己的怪异模式解析渲染页面，会模拟更旧的浏览器的行为。（如果没有声明DOCTYPE，默认就是这个模式）
- standards mode：标准模式，浏览器使用W3C的标准解析渲染页面。
- almost standards mode: 介乎于上述两者之间的近乎标准的模式，会实施了一种表单元格尺寸的怪异行为，但是基本淘汰了。

## 使用 data- 属性的好处是什么？

HTML的数据属性，用于将数据储存于标准的HTML元素中作为额外信息,我们可以通过js访问并操作它，来达到操作数据的目的。
小程序无法在`方法`里面直接`传递参数`，可以通过这个实现，非常方便
```js
<view data-index="1" bindtap="test">
// 一般在方法里这样使用就ok
test (e) {
    var index = parseInt(e.target.dataset.index);
    console.log("index" + index);
}
```
## 你对HTML语义化的理解？

语义化是指使用恰当语义的html标签，让页面具有良好的结构与含义，比如`<p>`标签就代表段落，`<article>`代表正文内容等等。
语义化的好处主要有两点：

- 开发者友好：使用语义类标签增强了可读性，开发者也能够清晰地看出网页的结构，也更为便于团队的开发和维护
- 机器友好：带有语义的文字表现力丰富，更适合搜索引擎的爬虫爬取有效信息，语义类还可以支持读屏软件，根据文章可以自动生成目录
这对于简书、知乎这种富文本类的应用很重要，语义化对于其网站的内容传播有很大的帮助，但是对于功能性的web软件重要性大打折扣，比如一个按钮、Skeleton这种组件根本没有对应的语义，也不需要什么SEO。

## HTML5与HTML4的不同之处

- 文件类型声明（<!DOCTYPE>）仅有一型：<!DOCTYPE HTML>。
- 新的解析顺序：不再基于SGML。
- 新的元素：section, video, progress, nav, meter, time, aside, canvas, command, datalist, details, embed, figcaption, figure, footer, header, hgroup, keygen, mark, output, rp, rt, ruby, source, summary, wbr。
- input元素的新类型：date, email, url等等。
- 新的属性：ping（用于a与area）, charset（用于meta）, async（用于script）。
- 全域属性：id, tabindex, repeat。
- 新的全域属性：contenteditable, contextmenu, draggable, dropzone, hidden, spellcheck。
- 移除元素：acronym, applet, basefont, big, center, dir, font, frame, frameset, isindex, noframes, strike, tt

## 有哪些常用的meta标签？

meta标签由name和content两个属性来定义，来描述一个HTML网页文档的`元信息`，例如作者、日期和时间、网页描述、关键词、页面刷新等，除了一些http标准规定了一些name作为大家使用的共识，开发者也可以自定义name。

- charset，用于描述HTML文档的编码形式
```html
<meta charset="UTF-8" >
```
http-equiv，顾名思义，相当于http的文件头作用,比如下面的代码就可以设置http的缓存过期日期
```html
<meta http-equiv="expires" content="Wed, 20 Nov 2019 22:33:00 GMT">
```
viewport，移动端最熟悉不过，Web开发人员可以控制视口的大小和比例
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
```
apple-mobile-web-app-status-bar-style,PWA应用，自定义苹果工具栏的颜色。
```html
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```

## 请解释 `<script>`、`<script async>` 和 `<script defer>` 的区别。
- defer：浏览器指示脚本在文档被解析后执行，script被异步加载后并不会立刻执行，而是等待文档被解析完毕后执行。
- async：同样是异步加载脚本，区别是脚本加载完毕后立即执行，这导致async属性下的脚本是乱序的，对于script有先后依赖关系的情况，并不适用。
- async在IE<=9时不支持；defer在IE<=9时支持但会有bug；还是放在底部安逸

## 有几种前端储存的方式？区别？

- cookies： 在HTML5标准前本地储存的主要方式，优点是兼容性好，请求头自带cookie方便，缺点是大小只有4k，自动请求头加入cookie浪费流量，每个domain限制20个cookie，使用起来麻烦需要自行封装
```js
function setCookie(name, val, day) {
  let expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + day);
  document.cookie = `${name}=${val};expires=${expireDate.toGMTString()}`;
}
function getCookies() {
  let cookies = [];
  if(document.cookie) {
    let cookieArr = document.cookie.split(';');
    for (let i = 0;i<cookieArr.length;i++) {
      let keyArr = cookieArr[i].split("=");
      let name = keyArr[0];
      let val = keyArr[1];
      cookies.push({name: val});
    }
  } else {
    return false;
  }
  return cookies;
}
function removeCookie(name) {
  let cookies = getCookies();
  if (cookies) {
    for(let cookie of cookies) {
     if(cookie.name === name) {
        setCookie(name, null, -99);
        break;
      }
    }
  } else {
    return false;
  }
}
```

- localStorage：HTML5加入的以键值对(Key-Value)为标准的方式，优点是操作方便，永久性储存（除非手动删除），大小为5M，兼容IE8+,getItem(), setItem(),removeItem(),clear()是常见方法

- sessionStorage：与localStorage基本类似，区别是sessionStorage当页面关闭后会被清理，而且与cookie、localStorage不同，他不能在所有同源窗口中共享，是会话级别的储存方式

- IndexedDB： 是被正式纳入HTML5标准的数据库储存方案，它是NoSQL数据库，用键值对进行储存，可以进行快速读取操作，非常适合web场景，同时用JavaScript进行操作会非常方便。