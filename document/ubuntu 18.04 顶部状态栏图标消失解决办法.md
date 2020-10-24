## 前言
Ubuntu 18.04 从刚刚发布不久，我一直用到现在，原先由 Ubuntu 16.04 升级而来，一路当中用的还是挺舒畅的。但是有时候也有些小问题，其中一个困扰我很久的就是顶部状态栏有时候，ICON 可能会消失，例如 网易云音乐，微信，Seafile 等的 ICON 都没法显示。

## 简单解决方法
 - 方法1，重启电脑或者注销在登录
 - 方法2，重启 GNOME ，`alt + f2`,输入  `r` ，回车
 
## 正经的解决方法

### 方法1
参照
 
 >Indicator icons do not appear after upgrade to Ubuntu 17.10
  https://askubuntu.com/questions/966987/indicator-icons-do-not-appear-after-upgrade-to-ubuntu-17-10

和 

 > Why top panel icons disapear on Gnome after installing Unity?
 https://askubuntu.com/questions/1045301/why-top-panel-icons-disapear-on-gnome-after-installing-unity

里面提到可能是 Unity 遗留了一些文件导致出现了冲突，直接运行 

    sudo apt remove indicator-application

然后重启就好了。

### 方法2
有可能是你的装了什么 GNOME 拓展导致 ICON 无法显示，chrome 打开

    https://extensions.gnome.org/local/

查看自己安装的拓展，禁用掉一些 Error 或者是与状态栏相关的拓展试试