---
layout: post
title: 【译文】采用chrome的DevTool中TimeLine和profile工具提升Web app性能
description:	<img src="/images/ChromeDevTools/webapp1.jpg" alt="webapp1" /><br />我们都希望能建立高性能的Web应用。尤其是随着应用复杂度的不断提升，我们可能需要在浏览器每秒60帧的情况下支持丰富的动画效果，并保持网站的响应性和敏捷性。所以，如何测量和提升网站性能是一门很有用的技巧，在这篇短文中，我将告诉你们如何使用Chrome Devtools中的Timeline和profile面板来测试网站性能......<a href="/web-perfomance-with-Chrome-DevTools" title="阅读全文">阅读全文</a>
tags:	前端开发,美文分享
excerpt:	Web Performance,Chrome DevTools
---

->译文，原文在[这里][]<-

![Git Bash](/images/ChromeDevTools/webapp1.jpg)

我们都希望能建立高性能的Web应用。尤其是随着应用复杂度的不断提升，我们可能需要在浏览器每秒60帧的情况下支持丰富的动画效果，并保持网站的响应性和敏捷性。
所以，如何测量和提升网站性能是一门很有用的技巧，在这篇短文中，我将告诉你们如何使用Chrome Devtools中的Timeline和profile面板来测试网站性能。

<div style="text-align: center;">看，这是一个很漂亮的GIF动画。本文正是从这里入手开始分析的:)</div><br />

![Git Bash](/images/ChromeDevTools/zR2f1.gif)

## 记录
Timeline面板提供了一个Web应用时间加载概貌图，包括DOM事件，页面布局和浏览器绘制元素等的执行时间。

![Git Bash](/images/ChromeDevTools/Screen-Shot-2012-12-10-at-10.15.47.png)

Timeline面板允许你通过<strong>事件（Events）</strong>，<strong>帧（Frames）</strong>和<strong>真实内存使用率（actual Memory usage）</strong>这三个主要参数帮助发现Web应用中的性能问题。通过打开DevTools并切换到Timeline面板来开始分析。

![Git Bash](/images/ChromeDevTools/Screen-Shot-2012-12-10-at-00.19.49.png)

Timeline面板默认是不会显示数据的，通过打开Web应用并点击灰色原型按钮☻（在面板的下方）来开始记录，使用Cmd/Crtl+E可以进行快速切换。

![Git Bash](/images/ChromeDevTools/Screen-Shot-2012-12-10-at-00.37.24.png)

在开始记录应用的Timeline信息时，记录按钮就会由灰转红。当使用应用一段时间后，就可以再次点击按钮停止记录。     
注：![Git Bash](/images/ChromeDevTools/Screen-Shot-2012-12-10-at-15.08.47.png)将会清除当前会话记录，可以开始新的记录。![Git Bash](/images/ChromeDevTools/Screen-Shot-2012-12-10-at-15.08.54.png)会强制V8引擎完成一次垃圾回收，这在调试期间很有用。![Git Bash](/images/ChromeDevTools/Screen-Shot-2012-12-10-at-15.12.31.png)会过滤出那些完成时间长于15ms的详细视图。

##检查
下一步，就是查看数据记录了。先考虑的性能损耗在哪里，Javascript或者是节点呈现？我们将要查看Timeline事件（Events）模型来回答以上问题。

![Git Bash](/images/ChromeDevTools/Screen-Shot-2012-12-08-at-21.42.26.png)

在这个模式下，总结视图（在Timeline面板的最上方）上的水平栏代表应用的网络请求和HTML解析（蓝色），Javascript执行（黄色），样式计算和布局（紫色）以及绘制和计算（绿色）行为。通过视觉改变例如调整窗口大小或者滚动可以触发重绘这个浏览器行为。      
重新计算会在修改css属性导致元素的位置发生改变时被触发。不用担心记不住这些行为因为在Timeline面板下方已经说明。

![Git Bash](/images/ChromeDevTools/Screen-Shot-2012-12-08-at-21.44.30.png)

在总结视图下方的是详细视图，里面包括在会话开始后的详细分类记录。

![Git Bash](/images/ChromeDevTools/Screen-Shot-2012-12-10-at-00.24.33.png)

每条记录左方是一个描述性标题，右方是时间栏。当鼠标覆盖在记录上方时会显示时间耗费情况的提示信息——这是非常有用的信息，应该重点关注这个信息，尤其是Call Stack栏。

![Git Bash](/images/ChromeDevTools/Screen-Shot-2012-12-08-at-21.47.05.png)

在Call Stack栏上点击或导航栏输入提示的超链接能够跳转到动作发生时Javascript的执行位置。如果发现一个浏览器行为花费了很多时间来执行（通过观察提示信息上的"Duration"可以得出），你可能需要进一步观察出现这种情况的原因。

![Git Bash](/images/ChromeDevTools/Screen-Shot-2012-12-10-at-00.27.29.png)

回到记录本身，当点击一条记录展开时，提供组成记录的子行为的详细记录信息。

![Git Bash](/images/ChromeDevTools/Screen-Shot-2012-12-10-at-10.48.55.png)

如果你仅仅对某段数据感兴趣，可以在总结视图中点击并拖拽，以此来选择某个区间并进行缩放。

![Git Bash](/images/ChromeDevTools/Screen-Shot-2012-12-10-at-10.51.34.png)

## 提高帧速率，动画和响应
帧模式（[Frames mode][]）让你能窥探到Chrome浏览器如何通过生成（更新）一个帧来将应用显示到屏幕上的过程。

![Git Bash](/images/ChromeDevTools/Screen-Shot-2012-12-10-at-00.30.30.png)

对于一个平滑的应用，需要一些持续的帧速率来保证——最理想的帧速率是20-60fps并且如果帧速率远低于这个的话那应用将会出现 janky 或者 jittery（不知道如何翻译比较好）这些情况，因为一些帧丢失了。      
在帧模式下，阴影竖条对应样式重新计算，合成等信息。每个竖直条的透明区域对应空闲时间，起码是应用可见部分当前空闲时间。例如，执行应用第一帧耗费15ms接下来消耗了30ms。在这种情况下，帧的的刷新率是同步的，第二帧多耗费了15ms来进行渲染。在这里，第三帧错失了正确的执行时间并推迟到下一帧时间进行渲染，因此，第二帧的执行代价是双倍的。

![Git Bash](/images/ChromeDevTools/Screen-Shot-2012-12-10-at-18.23.46.png)

如同Andrey Kosyakov在[Chromium blog][]中提到的一样，即使你的应用没有大量的动画效果，帧的概念也是十分有用的，因为在处理用户输入事件时浏览器必须必须必须执行各个动作的重复序列。当你在每帧中留下足够的时间来处理类似的动作，应用的响应性将会更好，同时意味着用户体验更好。

![Git Bash](/images/ChromeDevTools/Screen-Shot-2012-12-10-at-00.34.52.png)

当目标是60fps时，最多有16.66ms的时间来完成这一切。这段时间不是很长所以最好挤压尽可能多的时间来展现动画效果。    
另外，在总结视图中缩放帧这个行为并不是代表真实的帧速率，只是可以发现浏览器（和应用行为）在哪个方面最占用资源。

![Git Bash](/images/ChromeDevTools/Screen-Shot-2012-12-10-at-00.35.58.png)

例如，我们经常使用帧（和事件）视图来确认在应用中有多少数量的图片会引起解码操作，因为浏览器一直在对应用图片进行重新缩放。

![Git Bash](/images/ChromeDevTools/Screen-Shot-2012-12-10-at-11.38.03.png)

在这种情况下使用预先缩放尺寸的图片是很重要的，应用应该避免这种开销并且帧速率控制在60fps，这样对终端用户来说效果就会更加平滑。    
相关提示：你可以在DevTools下使用实时FPS计数器，具体到Settings菜单并且激活* Show FPS meter *即可。

![Git Bash](/images/ChromeDevTools/Screen-Shot-2012-12-10-at-15.39.14.png)

这样做将会在应用右上角显示一个计数器，意味着可以当帧速率下将到期望的速率时可以通过回馈信息发现。

![Git Bash](/images/ChromeDevTools/Screen-Shot-2012-12-10-at-15.39.33.png)

## 移动端
注意在移动端下，像Pual在Breakpoint Ep 4[展示][]的那样，动画和帧速率相比起桌面版要相差好几个数量级。在上面实现高帧速率是很困难的，像一些工具类似于Timeline Frame模式（再加上[远程调用][]）能够帮助诊断应用的瓶颈在哪里。

## Long-Paints是很困难的
诊断绘制所需时间将会是一个挑战性工作。如果想要知道为什么绘制这个元素会比较慢，将部分DOM元素设置为* display:none *在布局/排版中移除，并且设置* visibility:hidden *在浏览器绘制中移除。这样做可以通过Timeline记录并注意绘制时间来测量，然后在强制浏览器重绘时观察绘制率（paint rate）。（感谢Paul提出这个tip！）

## 减少内存使用和避免锯齿形曲线
内存模式（Memory mode）在诊断应用可能出现内存溢出的症状方面非常有用。

![Git Bash](/images/ChromeDevTools/Screen-Shot-2012-12-10-at-00.39.47.png)

要使用它，必须在几分钟内记录和应用的交互操作，然后关闭并进行测试。应该关注总结视图中的操作应用不同部分所产生的内存使用信息。随着垃圾回收机制的触发，，内存使用率会上升。    
图中蓝色的区域表示应用在特定时间内内存的使用情况，白色区域表示浏览器分配给应用的内存。     
如果你在总结视图上发现[锯齿形曲线][]，这表示任务对内存消耗很大。例如，可以空的[requestAnimationFrame][]将会触发垃圾回收，然而锯齿的陡峭程度是你应该重点关注的。如果很尖锐的话，就表示此时产生了大量的垃圾。

![Git Bash](/images/ChromeDevTools/Screen-Shot-2012-12-08-at-21.51.32.png)

你可以通过重新建立新的会话并与应用进行交互来进一步测试，空闲一段时间后停止并重新进行测试。当应用空闲的时候，V8会运行一系列的垃圾回收机制（或者当应用产生了大量的垃圾）。如果看起来在空闲时间时内存不会大幅度减少，那就表示应用产生了大量的垃圾。     
通过几个周期的垃圾回收，应用的内存应该会变得比较平整（flat）。如果在GC周期内内存一直增长（看起来类似一个阶梯型函数），意味着应用可能出现了内存溢出。

![Git Bash](/images/ChromeDevTools/Screen-Shot-2012-12-10-at-00.32.29.png)

在内存模式详细视图的左方，能够看到三个选项：Document count, DOM node count 和 Event listener count。

![Git Bash](/images/ChromeDevTools/Screen-Shot-2012-12-10-at-11.00.29.png)

** DOM node count **视图展示了内存中创建的所有DOM节点（这些是将要被垃圾回收的），另外两个同样表示的是** 事件监听数量 **和** documents/iframe **数量实例。假设你希望某一种类型的计数视图，可以在详细面板上通过取消来隐藏。    
现在已经知道可能发生了内存泄露，但我们需要知道内存泄露发生的位置。我们可以通过使用另一个特性Heap Profiler来实现，在profile面板中可以看到。

## 确定
在决定使用profile面板之前需要确保到底是什么原因导致性能出现瓶颈——比如，如果在Timeline面板上你看到大量黄色，可能就是脚本导致的问题所以需要使用在profile面板下的 JavaScript CPU Profile。如果是CSS 选择器，就要使用CSS Selector profile。

![Git Bash](/images/ChromeDevTools/Screen-Shot-2012-12-10-at-11.03.21.png)

在这种情况下因为我们关注[堆][]信息所以要使用Heap Profiler，但下面的建议同样适合其他的profiles。

![Git Bash](/images/ChromeDevTools/Screen-Shot-2012-12-10-at-00.14.32.png)

Profile’s * Take Heap Snapshot *选项允许采集应用运行时内存创建的javascript对象（以及DOM节点）。     
要使用它，点击start按钮并且重复上个步骤中疑似出现问题的操作（通过你发现的信息操作）来创建第一个快照。然后点击记录按钮☻来记录第二个快照，这个时候不要和应用进行任何交互。

![Git Bash](/images/ChromeDevTools/Screen-Shot-2012-12-10-at-11.10.57.png)

现在在‘Heap Snapshots’分类下你可以看到至少两个快照。让我们比较一下他们。

![Git Bash](/images/ChromeDevTools/Screen-Shot-2012-12-10-at-11.14.38.png)

在DevTools窗口的下方你可以看到箭头，上面是'总结'标签。它允许你切换不同的快照视图。总结视图（Summary view）能很好的检测DOM溢出，另外比较视图（Comparison view）在检测内存溢出上很有用。选择比较（Comparison ）然后点击快照2（Snapshot 2）。

![Git Bash](/images/ChromeDevTools/Screen-Shot-2012-12-10-at-11.13.09.png)

你看到的信息是profiles之间创建的对象。通过这个可以检测垃圾回收进程回收的对象是否和创建的对象相符。点击构造方法可以展现出面板下方更多关于对象树视图（Object's remaining tree view ）的详细信息。     
我知道这可能看起来有点吓人，请原谅我。这是一个典型场景，说明这个视图能有效地发现是否存在已经从DOM中删除但实际还有其他引用的对象。一旦你确认代码存在溢出现象，就可以添加不要的代码来清除被引用但实际上已经不再需要的对象。     
例如，在应用中发现依然存在HTMLImageElement 对象的引用，通过点击构造函数并点击下拉按钮，可以发现Window对象（高亮处）还存在对image对象的引用信息，所以我们可以通过这个搜索所有事件监听并解除window对象的引用。

![Git Bash](/images/ChromeDevTools/Screen-Shot-2012-12-10-at-11.13.30.png)

## 总结
测量和提升你的应用性能可能会比较耗费时间，不幸的是对于这个问题现在还没有什么好的解决方法，但Timeline和profile面板能够帮助发现应用所存在的主要问题。 尝试使用这些工具来看看是否对于你的性能优化工作有帮助。

## 深入了解

* We just covered some of this topic in the last episode of the Breakpoint  - [The Tour De Timeline][].
* Patrick Dubroy’s talk from [OreDev][] discusses Timeline and Heap profiler and provides an excellent live walkthrough of how to use these features.
* Brandon Jones has written about using Timeline for [JavaScript memory optimization][]
* Colin Snover wrote about the Timeline and Profiler in [great depth][] last year (note there have been quite a few UI changes since)
* Loreena Lee gave a great [presentation][] on fixing memory leaks in GMail using these tools



[这里]:	http://addyosmani.com/blog/performance-optimisation-with-timeline-profiles/
[Frames mode]: http://blog.chromium.org/2012/11/build-smoother-web-apps-with-chrome.html
[Chromium blog]: http://blog.chromium.org/2012/11/build-smoother-web-apps-with-chrome.html
[展示]: https://www.youtube.com/watch?feature=player_detailpage&v=WpqZ0LjNU5A#t=1942s
[远程调用]: https://developers.google.com/chrome-developer-tools/docs/remote-debugging
[锯齿形曲线]: http://blog.tojicode.com/2012/03/javascript-memory-optimization-and.html
[requestAnimationFrame]: http://paulirish.com/2011/requestanimationframe-for-smart-animating/
[堆]: https://developers.google.com/chrome-developer-tools/docs/memory-analysis-101
[The Tour De Timeline]: http://www.youtube.com/watch?v=WpqZ0LjNU5A
[OreDev]: http://vimeo.com/53073654
[JavaScript memory optimization]: http://blog.tojicode.com/2012/03/javascript-memory-optimization-and.html
[great depth]: http://zetafleet.com/blog/google-chromes-heap-profiler-and-memory-timeline
[presentation]: https://docs.google.com/presentation/d/1wUVmf78gG-ra5aOxvTfYdiLkdGaR9OhXRnOlIcEmu2s/pub?start=false&loop=false&delayms=3000#slide=id.g1d65bdf6_0_0