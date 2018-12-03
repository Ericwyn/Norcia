# 前言
前几天忘了配置了什么，然后忽然间 ubuntu 的终端就中文乱码了，找了网上各种 ubuntu 中文教程，安装各种中文 package，结果都没用，心都碎了

如下图

![](https://ws1.sinaimg.cn/large/ae1a7c45gy1fxtbpbek34j20ow0gd40p.jpg)


## 解决方法 1
后面觉得换个终端试试，于是又 google 了一晚上的 zsh 安装教程，安装完之后发现还是乱码，于是再度 google ，然后发现这里的解决方法

 > [zsh中文乱码解决方法](https://github.com/hokein/Wiki/wiki/zsh%E4%B8%AD%E6%96%87%E4%B9%B1%E7%A0%81%E8%A7%A3%E5%86%B3%E6%96%B9%E6%B3%95)
 
 修改一下 `~/.zshrc` 就可以了，增加下面两行代码
    
    export LC_ALL=en_US.UTF-8  
    export LANG=en_US.UTF-8
 
 然后就可以中文了！！！！
 
## 后知后觉的解决方法2
用了两天之后发现 zsh 总是报权限问题...而且用起来也没有原生终端那么习惯，于是又想换回去，但是还是苦恼于中文乱码问题，然后，后知后觉想到说

“既然编辑 `~/.zshrc` 就可以解决 zsh 的中文乱码，那么编辑 `~/.bashrc` 就能够解决 bash 的乱码了吧”

于是在 `~/.bashrc` 下面也加了上面两行代码

问题解决？！！！

实在是被自己蠢到了，还是决定写这段文字来记录一下