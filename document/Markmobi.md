## 前言
自己使用 Kindle 已经有好几年的历史了，从高中时期看各种古文，后来一口气的看一大堆小说，再到后来看看一些技术书籍，而最近发现 Kindle 的另外一个用处就是看 Github 上面的一些电子书籍。

Github 上面是有很多的技术书籍的，因为 Github 有着开放和包容的特性，所以很多的人会翻译各种技术专业的文档或者相关的书，并变成一个 repo ，后续不断更新和提交。从这看来，Github 其实像是一个大的书库。另外哪怕不是书籍，Github 上面也有很多可能并不太适合在电脑上面阅读的 README，以及那种超长的那种项目文档。某天我翻阅的时候，忽然发现或许拿 Kindle 来阅读，应该会舒服很多吧。于是就开始了探索如何把 Github 上面的文档挪到 Kindle 上面阅读的问题。准确的说来，这个问题应该是——如何让 Markdown 文档变成合适 Kindle 存储和阅读的 mobi 文件。

 那既然说起将 Markdown 文件变成书，变成 Mobi，大家可能马上就可以想到 Gitbook。毕竟人家有下载按钮，有直接变成 Mobi 格式的功能。可是最大的问题在于并不是所有 Github 上面的 repo 都同样的在 Gitbook 拥有一个 repo 啊，所以说到底，还是需要一个工具来帮我们转换。
 
 可惜，在我 google 了巨久之后，我也没有发现什么工具能够直接输入一个 markdown 文件，输出一个 mobi 文件。比较曲折的过程是 ：
 - 使用 `pandoc` 将 markdown 转换成 html
 - 使用 `KindleGen` 再将 html 转换成 mobi
 
 虽然曲折，但是按着流程操作了两遍，发现真的还行来着，毕竟只要是 mobi 就可以，字体大小什么的都可以交给 kindle 设置。
 
 可是每次都这么操作真的是很麻烦，作为一个程序员自然就想写一个工具过来把这些步骤放到一次完成啦，甚至是做成一个在线工具，直接上传 markdown 然后转换成 mobi ，并提供下载链接
 
 于是就写了个 `Markmobi`
 
 实际上这只是一个调用 `pandoc` 和 `kindleGen` 的整合工具而已，内里还是使用 `pandoc`和`kindleGen`在工作
 
 ## Markdown 文档要求
  - 文档的资源文件夹（如图片存放文件夹等），需要与markdown 放在同一目录下，且使用文档中需要使用相对路径进行引用
  - 文档的命名不可包含空格
  
 ## 转换过程
  - markdown --> HTML
  - HTML ------> Mobi
 
 ## 依赖
 ### 1 , Pandoc
  - 安装方法
  
        apt-get install pandoc
     
 ### 2 , KindleGen
  - 去 Kindle 官网上面找、或者 Google 搜索一下就好了
  
  
 ## 配置
  - `markmobi.cfg` 文件，需要设置 Kindlegen 的绝对路径
 
        KINDLEGEN_PATH = /media/ericwyn/kindlegen ;
 
 
 ## 运行示例
  - 转换成功
 
         check KindleGen successful
         Version : V2.9 
         check Pandoc successful
         version : 1.16.0.2
         build success
         /media/Java并发_convert.mobi
         
         Process finished with exit code 0
         
  - 转换失败
  
         check KindleGen successful
         Version : V2.9 
         check Pandoc successful
         version : 1.16.0.2
         build fail
         
         ----------------------- log -----------------------
         
         
         *************************************************************
          Amazon kindlegen(Linux) V2.9 build 1028-0897292 
          A command line e-book compiler 
          Copyright Amazon.com and its Affiliates 2014 
         *************************************************************
         
         Error(kindlegen):E30005: Could not find file  题解_convert.mobi
         
         
         Process finished with exit code 0
         
## 源码所在

 [Github_Markmobi](https://github.com/Ericwyn/Markmobi/)
 
 代码是使用 Java 写的，说实话总觉得用起来还是有点麻烦，并且效率也不怎么高，不过好处是我能够用这个在外面套一个 Spring Boot 和一个简单的前端之后，写成一个在线服务
 
 当然啦～有机会的话还是觉得用 Go 来重写会比较好，交叉编译成三端二进制这一点我能吹爆！