## 设定工作文件目录
打包R package 要求两个目录 分别是

 - 工作目录 （存放 R 代码）

        mkdir /home/ericwyn/work
        
 - 包目录 （存放包）

        mkdir /home/ericwyn/Rlibs

 - 默认情况下在mydir是找不到mylib下的包的，因为mylib不在包的搜索路径里，解决这个问题只需要在mydir新建一个文 件`.Rprofile`文件，里面写上：`.libPaths(“/home/wentrue/Rlibs”)`即可。这样在mydir运行R脚本或启动R终 端，mylib就会被添加到包搜索路径中。

## 完善目录结构

    once
    ├── data
    ├── DESCRIPTION
    ├── man
    ├── NAMESPACE
    ├── R
    │   └── arild.R
    └── src

 - 必需的是`DESCRIPTION`文件、`man目录`和`R目录` 以及 `NAMESPAC`文件

### 关于目录结构解释
 - `DESCRIPTION`文件描述包的`meta信息`，模板如下

        Package: once
        Version: 0.1
        Date: 2017-10-11
        Title: Once Test
        Author: Ericwyn Chen <Ericwyn.chen@gmail.com>
        Maintainer: Ericwyn Chen <Ericwyn.chen@gmail.com>
        Depends: R (>= 1.9.0)
        Description: A Once Test Description
        License: GPL version 2 or later

 - `R`目录下面存放 R 脚本文件，里面的函数可导出作为包函数库提供给外部使用

 - `data`目录里放一些试验数据（如果需要在包里使用到的话），常用是以`csv`格式存放，在R终端里data(***)可以载入，这里留空

 - `man`目录是R的帮助文档，即?xxx时显示的那些，有一定的格式要求，这里也留空

 - `src`存 放 `c / c++ / fortran`源代码，必须同时放置`Makefile`或`Makevars`文件指导编译程序工作，这里留空。

 - `NAMESPACE` 文件也是必须的，我一开始因为没有放置这个文件，所以检查的时候一直出错，在 R 3.0.0 以及以后的版本中，所有的package 打包都需要带上一个`NAMESPACE`文件，最简单的话就是一行

        exportPattern( "." )

    参考的网址是
    
    > https://stackoverflow.com/questions/17196225/error-a-namespace-file-is-required
    
    以及
    
    > https://d.cosx.org/d/15991-15991

## 检查包是否能正确安装
以下步骤全部在 mydir 目录下进行操作
### 运行 R CMD check once
    R CMD check once

通常之后你会看到一段的日志，说明了检查状态，以及错误、和警告的信息，我们当然是希望 `0 
WARNINGs 0ERROR` 啦，但是新手上路多多少少总会有些翻车的，具体出现的`ERROR` 和`WORINING`就只能自己google然后看着办了，其中我遇到的有以下的问题

 - 缺少 `NAMESPACE` 文件，日志如下

        * checking if there is a namespace ... ERROR
        All packages need a namespace as from R 3.0.0.
        R CMD build will produce a suitable starting point, but it is better to
        handcraft a NAMESPACE file.
    
    增加了
`NAMESPACE` 文件之后解决

 - PDF 手册检查错误 ？！ （并不太懂这是什么）
        
        * checking PDF version of manual without hyperrefs or index ... ERROR
        Re-running with no redirection of stdout/stderr.
        Hmm ... looks like a package
        Error in texi2dvi(file = file, pdf = TRUE, clean = clean, quiet = quiet,  : 
          pdflatex is not available
        Error in texi2dvi(file = file, pdf = TRUE, clean = clean, quiet = quiet,  : 
          pdflatex is not available
        调用tools::texi2pdf()时出了错
        You may want to clean up by 'rm -rf /tmp/Rtmpx83tzh/Rd2pdf39de438ea1a1'
    
    没有理会直接跳过了，因为看到了成功生成的`XXX.Rcheck`文件夹

## 生成包
### 运行R CMD build once
    R CMD build once
之后将会生成一个once_0.1.tar.gz 的包

### 安装包到opencpu当中
将包发送到服务器上，在tar.gz 文件所在目录，运行下面命令

    R CMD INSTALL once_0.1.tar.gz --library=/usr/local/lib/R/site-library
    service opencpu restart

之后就可以在opencpu 的包列表
`http://OPENCPU_ADDRESS/ocpu/library/once` 当中看到这个包了
而函数的调用地址则是
`http://OPENCPU_ADDRESS/ocpu/library/once/R/arild`

至此打包和安装完毕

##后记

### 自动打包器
后面自己觉得这个过程太过繁琐，于是决定写一个R 语言的自动打包装置，用Java 调用R CMD 实现了，地址是

> https://github.com/Ericwyn/AutoPackingOfR