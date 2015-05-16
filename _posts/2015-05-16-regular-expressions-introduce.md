---
layout: post
title: Javascript 正则表达式简述
description: <strong>摘要:</strong><br />本文主要介绍了 Javascript 正则表达式的各种声明和用法，可以当做文档，以后需要的时候自己可以进行查阅。<a href="/regular-expressions-introduce" title="阅读全文">阅读全文</a>
tags: 前端开发
excerpt: Javascript,Regular Expressions
---

**本文地址: [http://forkme.info/regular-expressions-introduce/](http://forkme.info/regular-expressions-introduce/)或者[http://www.cnblogs.com/blackmanba/p/regular-expressions-introduce.html](http://www.cnblogs.com/blackmanba/p/regular-expressions-introduce.html), 转载请注明源地址。**

## 基本字符

Javascript 正则表达式的基本字符如下：**( [ ] { } \ ^ $ | ) . -**，原则上来说，简单字符表示的是一个字符对应一个字符，当然，我们可以通过指定 [] 来使用多个字符对应一个字符。如下：

### 简单类

```
alert(/hehe/.test('hehe'));                   // true
alert(/[abc]/.test('a'));                     // true
alert(/[abc]/.test('b'));                     // true
alert(/[abc]/.test('c'));                    // true
alert('hello, world'.match(/[eo]/gi));        // ['e', 'o', 'o']
```

### 取反类

```
alert(/[^abc]/.test('a'));                    // false
alert(/[^abc]/.test('b'));                    // false
alert(/[^abc]/.test('c'));                    // false
alert(/[^abc].test('hehe')/);                // true
```

### 范围类

**范围类**主要的操作符是 **-** (下划线)，表示选择某一个范围的值 (ps: 一般被中括号 [] 包裹)，例如：

```
alert(/[a-z]/.test('b'));                    // true
alert(/[a-z]/.test('c'));                    // true
```

### 组合

注意：以上类型可以任意组合 (ps: | 表示或者，放在 [] 里面，表示的就是普通的字符 | )，例如：

```
alert(/[^a-z]/.test('b'));                    // false
alert(/[^a-z]/.test(1));                      // true
alert(/[^a-z0-9]/).test(1);                   // true
[0-9|a-z]                                     // 表示 0-9 | a-z 任意选择一个
```

### 预定义字符

为了减少输入字符的长度，正则表达式规定了一些字符表示特殊的含义。如下：

字符         | 等同于                   | 描述
:----------- | :-----------           | :-----------
.            | [^\n\r]                | 除了回车和换行符之外的所有字符
\d           | [0-9]                  | 数字字符
\D           | [^0-9]                 | 非数字字符
\s           | [ \t\n\x0B\f\r]        | 空白字符
\S           | [^ \t\n\x0B\f\r]       | 非空白字符
\w           | [a-zA-Z_0-9]           | 所有英文字符和数字字符
\W           | [^a-zA-Z_0-9]          | 所有非英文字符和数字字符

```
alert(/./.test('a'));                         // true
alert(/\d/.test(1));                          // true
alert(/\D/.test(1));                          // true
alert(/\s/.test(' '));                        // true
alert(/\S/.test('s'));                        // true
alert(/\w/.test('1'));                        // true
alert(/\W/.test('1'));                        // true
```

## 量词

**量词** 基本字符都是和单词的组合 (中括号 []) 或者字符本身进行一对一的匹配。我们匹配类似 aaabbb.... 很长的字符串时，如果使用基本字符直接匹配，那每次都要输入很长的正则表达式 ( 估计没人能做到吧 )。量词的出现就是用来处理重复字符匹配的利器。

代码         | 类型                        | 描述
:----------- | :-----------           | :-----------
?            | 软性量词                | 出现 0 次或者是 1 次
*            | 软性量词                | 出现 0 次或者是多次
+            | 软性量词                | 至少出现一次 ( 可出现多次 )
{n}          | 硬性量词                | 对应 0 次或者是 n 次
{n,m}        | 软性量词                | 至少出现 n 次但是不能超过 m 次
{n,}         | 软性量词                | 至少出现 n 次

```
alert(/[a-z]?/.test(''));                       // true
alert(/[a-z]*/.test('aaaa'));                    // true
alert(/[a-z]+/.test('aaa'));                    // true
alert(/[a-z]{2}/.test('aa'));                   // true
alert(/[a-z]{2,3}/.test('aaaa'));               // false
alert(/[a-z]{2,}/.test('aaa'));                 // true
```

    ps: /[\u4e00-\u9fa5]/用于匹配单个汉字
    
## 贪婪量词和惰性量词

**贪婪量词**：上面提到的所有基本字符和除了 ? 外的量词，贪婪量词先是从字符串的末尾开始遍历，如果不能匹配，就去掉结尾的字符继续进行匹配。 ( 不断重复直到长度为0 )

**惰性量词**：在简单量词后面加上 ?，惰性量词采用顺序遍历的方式，也就是先获取第一个字符进行匹配，如果不饱和就继续获取下一个字符 ( 发现字符不匹配就舍弃读取下一个字符进行匹配...... )。工作方式与贪婪量词相反。

```
var reg1 = /.*bbb/,                             // 贪婪量词
     reg2 = /.*?bbb/;                           // 惰性量词

alert(reg1.test('aaaaabbbbbbaabbbbaabbbwww'));  // true
alert('aaaaabbbbbbaabbbbaabbbwww'.match(reg1)); // aaaaabbbbbbaabbbbaabbb

alert('aaaaabbbbbbaabbbbaabbbwww'.match(reg2)); // aaaaabbb
```

## 分组

简单字符能够进行单词一对一的匹配，量词能够处理一排紧密相连的同类型字符，但这是不够的。中括号表示范围内选择，大括号表示重复次数，小括号允许我们重复多个字符。

```
alert(/(dog){2}/.test('dogdog'));                 // true
alert('baddad'.match(/([bd]ad?)*/));             // baddad, dad
alert('mon and dad'.match(/(mon ( and dad))/));   // mon and dad, mon and dad, and dad
```

## 反向引用

反向引用是由正则表达式匹配分组捕获的子字符串，每个反向引用都由一个数字编号来标识。如下：

```
var color = '#90000';
/(\d)+/.test('color');
alert(RegExp.$1);                                 // 90000

alert(/(dog)\1.test('dogdog')/);                   // true
var num = '1234 5678';
var newNum = num.replace(/(\d){4} (\d){4}/, '$2 $1');
```

## 候选

在分组时使用，通过插入管道符 | ，划分为两个或多个候选项。

```
var reg = /(red|black|yellow)!!/;
alert(reg.test('red!!'));                         // true
alert(reg.test('black!!'));                        // black
```

## 非捕获性分组

并不是所有的分组都需要建立反向引用，非捕获性分组表示不会创建反向引用的分组。反之，普通的分组就是捕获性分组，如下：

```
var color = '#90000';
/#(?:\d)+/.test(color);
alert(RegExp.$1);                                   // ''
```

example: 移除所有的标签，只剩下 innerHTML

```
var html = '<p><a href="http://www.baidu.com">www.baidu.com</p>';
var text = html.replace(/<(?:.|\s)*>/g, '');
alert(text);
```

## 边界

一个与字符串合用的东西。

正则         | 名称                        | 描述
:----------- | :-----------           | :-----------
^            | 开头                    | 注意不能出现在左中括号的位置
$            | 结尾                    |
\b           | 单词边界                | 指 [a-zA-Z0-9] 之外的字符
\B           | 非单词边界               |


实例属性                  | 描述
|:-----------          | :-----------
global                 | 是当前表达式模式首次匹配内容的开始位置，从0开始计数。其初始值为-1，每次成功匹配时，index属性都会随之改变。
ignore case            | 返回创建RegExp对象实例时指定的ignoreCase标志（i）的状态。如果创建RegExp对象实例时设置了i标志，该属性返回True，否则返回False，默认值为False。
lastIndex              | 是当前表达式模式首次匹配内容中最后一个字符的下一个位置，从0开始计数，常被作为继续搜索时的起始位置，初始值为-1， 表示从起始位置开始搜索，每次成功匹配时，lastIndex属性值都会随之改变。(只有使用exec()或test()方法才会填入，否则为0)
multiLine              | 返回创建RegExp对象实例时指定的multiLine标志（m）的状态。如果创建RegExp对象实例时设置了m标志，该属性返回True，否则返回False，默认值为False。
source                 | 返回创建RegExp对象实例时指定的表达式文本字符串。


```
var str = "JS's Louvre";
var reg = /\w/g;
alert(reg.exec(str));//J
alert(reg.lastIndex);//1
alert(reg.exec(str));//S
alert(reg.lastIndex);//2
alert(reg.exec(str));//s
alert(reg.lastIndex);//4
alert(reg.exec(str));//L
alert(reg.lastIndex);//6
```

## 总结

**正则表达式** 是每一个开发人员必学知识，本文基本是参考 **司徒正美** 大神的 [这篇文章](http://www.cnblogs.com/rubylouvre/archive/2010/03/09/1681222.html) 而写，只是自己搬运过来做一个笔记，可以在开发的过程中随时查阅，感谢 **司徒正美** 的这篇文章，作为文档基本记录了正则表达式的所有用法!