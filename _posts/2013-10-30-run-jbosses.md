---
layout: post
title: jboss服务器配置多实例
description: <strong>摘要:</strong> 在开发, 测试项目的过程中, 我们经常需要在同一台主机上, 同一个服务器上配置多个运行实例。这样做有一下几点好处:<ul><li>在项目开发, 调试阶段能最大限度的节省资源</li><li>某个实例出现异常或错误都不会对其他实例的运行造成影响</li><li>需要对某个实例进行重启、关闭等操作属于独立操作, 不会对服务器的运行造成影响</li></ul>对重要性的介绍就到这里, 对jboss服务器进一步了解可以点击......</ul><a href="/run-jbosses" title="阅读全文">阅读全文</a>
tags: 后台开发
excerpt: jboss
---

## jboss配置多实例的重要性
在开发, 测试项目的过程中, 我们经常需要在同一台主机上, 同一个服务器上配置多个运行实例。这样做有一下几点好处:

* 在项目开发, 调试阶段能最大限度的节省资源
* 某个实例出现异常或错误都不会对其他实例的运行造成影响
* 需要对某个实例进行重启、关闭等操作属于独立操作, 不会对服务器的运行造成影响

对重要性的介绍就到这里, 对jboss服务器进一步了解可以点击[这里](http://www.jboss.org/developer/tutorials.html)

本文地址: [http://forkme.info/run-jbosses/][]或者[http://www.cnblogs.com/blackmanba/p/3674301.html][], 转载请注明源地址。

## jboss server配置
解决这个问题的关键其实就是对于不同的实例分配不同的端口。

在linux下, 进入到jboss的server目录下, 拷贝一份实例数据修改项目名, 如图:

![Git Bash](/images/runjboss/copy.jpg)

在jboss启动时默认发布的不同实例需要使用不同的端口监听。项目复制过来后由于端口一样所以会导致端口冲突, 无法启动。解决这个问题最简单的方法就是直接在配置文件中修改端口。这种方法当然可以, 但是对于jboss服务器来说, 每个实例所需的端口数非常多, 包括http协议的8080、AJP协议的8009、JNP服务的1099、RMI命名服务的1098等等, 并且这些端口配置都分布在不同的文件, 手工修改极易出错。

考虑到这些因素, jboss服务器提供了[Binding-Manager][]服务, 不用繁琐的配置就能够实现多实例运行而端口不冲突。步骤如下:

### 1. 部署环境
以jboss 4.2.3 GA 为例, server下有两个不同的实例node1, node2(名字自定义), %JBOSS_HOME%表示jboss安装目录。
关键文件是%JBOSS_HOME%/docs/examples/binding-manager/sample-bindings.xml, 该文件默认情况下定义了4组不同的端口配置(分别是ports-default、ports-01、ports-02、ports-03), 也就是说默认情况下jboss支持部署4个不同的jboss实例。

### 2. node2配置
进入node2目录, 修改node2/conf/jboss-service.xml文件, 配置如下:

	<mbean code="org.jboss.services.binding.ServiceBindingManager" name="jboss.system:service=ServiceBindingManager">  
		<attribute name="ServerName">ports-01</attribute>  
		<attribute name="StoreURL">${jboss.home.url}/docs/examples/binding-manager/sample-bindings.xml</attribute>  
		<attribute name="StoreFactoryClassName">  
			org.jboss.services.binding.XMLServicesStoreFactory  
		</attribute>  
	</mbean>

这里node2配置为使用ports-01的配置。	

### 3. node1配置
node1默认可以不用配置, 这种情况下使用的是jboss提供的默认端口8080, 8009等, 也可以参照第一步的配置, 只需修改"ServerName"与node2不一样即可。ps: 只能是定义的四组端口范围内。

### 4. 自定义端口
这一步不是必须的, 上一步配置的时候已经指定了运行端口。如果你想修改实例http服务监听端口, 才需进行下列步骤。
进入node1目录, 修改node1/deploy/jboss-web.deployer/server.xml, 配置如下:
	
	<Connector port="80" address="0.0.0.0" 
		maxThreads="250" maxHttpHeaderSize="8192"
        emptySessionPath="true" protocol="HTTP/1.1"
        enableLookups="false" redirectPort="8443" acceptCount="100"
        connectionTimeout="20000" disableUploadTimeout="true" />

里面port="80"选项可以修改为任意的端口, 只要不冲突即可。ps: node2的配置也与node1一致。

### 5. 启动实例
完成上述配置后, 实例的启动非常简单。如下:

	%JBOSS_HOME%/bin/run.sh -c node1 -b ip地址 &
	%JBOSS_HOME%/bin/run.sh -c node2 -b ip地址 &

ip地址指的就是项目的地址。

## 配置说明
如果没有指定运行端口而采用默认定义的4组端口配置, 端口是以以下方式进行设定的:

http服务端口默认情况下是8080, 其他实例的端口依次在8080的基础上增加100, 对应关系如下:

	ports-default      8080
	ports-01           8180
	ports-02           8280
	ports-03           8380	

其他端口规律和http端口规律一致。eg: AJP端口依次为8009、8109、8209、8309。

## 注意事项

* 上述方法同样适用于同一台机器上面部署多个jboss而不是同一个jboss下部署多个实例
* 如果定义的4组端口不够用, 也可以自行添加其他port组
* 在正式环境下, 推荐将不同的实例绑定在不同的ip地址上

## 使用情景

* 32位JVM限制无法使用超过2G的内存, 通过多实例可以充分利用服务器上的大内存(不理解, 有懂的人请告知)
* 不同的jboss用于不同的用途, 比如开发环境, 测试环境的分离
* 在同一台机器上使用不同版本的jboss服务器
* 在同一台机器上部署基于不同JVM的jboss

[Binding-Manager]:    http://docs.jboss.org/jbossas/docs/Server_Configuration_Guide/4/html/Additional_Services-Services_Binding_Management.html  "Bind-Manager"
[http://forkme.info/run-jbosses/]: http://forkme.info/run-jbosses/
[http://www.cnblogs.com/blackmanba/p/3674301.html]: http://www.cnblogs.com/blackmanba/p/3674301.html
