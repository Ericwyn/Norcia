# 0 前言

最近学校之前开通了 iMC Portal 无线网络, 只是每次都要开启浏览器才可以登录, 并且需要一直开着一个标签, 这是件很麻烦的事情, 而且最近 (2018-07-11) 发现会出现每隔 15 分钟就断线一次的问题, 所以希望通过抓包来了解连接的过程,之后使用 java 或者其他语言实现模拟登录, 并且在断线之后自动重连

# 1 协议解析
## 1.1 获取 cookie
访问学校 iMC portal 页面之后会发现有以下的一些页面请求

![](http://ww1.sinaimg.cn/large/ae1a7c45gy1ftfjvp7kftj20t20dqmzl.jpg)

emmm ? 所以学校 iMC portal 后台还是用 java 写的, 页面还是 jsp ????

其中 `portal/templatePage/20170110154814101/login_custom.jsp` 的响应里面有 Set-Cookie 字段, 就是一个 `i_p_pl` 的 cookie , 先拿小本本记下来~

话说我还好奇这个 `i_p_pl`是什么意思来着, 于是想着解密看看

解密的话, 肯定第一步就是 base64 直接上啦~毕竟用很广泛

base64 解密结果之后可以得到

    %7B%22errorNumber%22%3A%221%22%2C%22nextUrl%22%3A%22http%3A%2F%2F10.50.15.9%3A80%2Fportal%2FtemplatePage%2F20170110154814101%2Flogin_custom.jsp%22%2C%22quickAuth%22%3Afalse%2C%22clientLanguage%22%3A%22Chinese%22%2C%22assignIpType%22%3A0%2C%22iNodePwdNeedEncrypt%22%3A1%2C%22wlannasid%22%3A%22%22%2C%22wlanssid%22%3A%22%22%2C%22nasIp%22%3A%22%22%2C%22byodServerIp%22%3A%220.0.0.0%22%2C%22byodServerIpv6%22%3A%220000%3A0000%3A0000%3A0000%3A0000%3A0000%3A0000%3A0000%22%2C%22byodServerHttpPort%22%3A%2280%22%2C%22ifTryUsePopupWindow%22%3Afalse%2C%22uamInitCustom%22%3A%220%22%2C%22customCfg%22%3A%22MTA1%22%2C%22regCodeType%22%3A%22MA%22%7D
    
然后我们可以发现这是一段经过 url 编码的数据, 所以使用 url 解码再看看咯~

解码之后发现这是一段 `JSON`

    {
        "errorNumber": "1",
        "nextUrl": "",
        "quickAuth": false,
        "clientLanguage": "Chinese",
        "assignIpType": 0,
        "iNodePwdNeedEncrypt": 1,
        "wlannasid": "",
        "wlanssid": "",
        "nasIp": "",
        "byodServerIp": "0.0.0.0",
        "byodServerIpv6": "0000:0000:0000:0000:0000:0000:0000:0000",
        "byodServerHttpPort": "80",
        "ifTryUsePopupWindow": false,
        "uamInitCustom": "0",
        "customCfg": "MTA1",
        "regCodeType": "MA"
    }
    
然而似乎没有发现什么特别厉害的东西啊,就没有管, 先记着再说, 不过倒是发现了网站信息交换时候的一般加密手段似乎就是 单纯的 

    JSON -> URLEncoder -> base64 

## 1.2 登录
尝试登录的时候,发现接口的地址是 `portal/pws?t=li`, 一个 POST 请求

![](http://ww1.sinaimg.cn/large/ae1a7c45gy1ftfjw2nyrfj21150k3dlg.jpg)

在这里我们就能看到之前获得的 cookie 的用处了

![](http://ww1.sinaimg.cn/large/ae1a7c45gy1ftfjw93p75j211l0jvgoy.jpg)

而在具体的 POST 的数据上面, 有以下的内容

    userName: 1000000000
    userPwd: MTAwMDAwMDAwMA==
    userDynamicPwd: 
    userDynamicPwdd: 
    serviceTypeHIDE: 
    serviceType: 
    userurl: 
    userip: 
    basip: 
    language: Chinese
    usermac: null
    wlannasid: 
    wlanssid: 
    entrance: null
    loginVerifyCode: 
    userDynamicPwddd: 
    customPageId: 0
    pwdMode: 0
    portalProxyIP: 10.50.15.9
    portalProxyPort: 50200
    dcPwdNeedEncrypt: 1
    assignIpType: 0
    appRootUrl: http://xx.xx.xx.xx/portal/
    manualUrl: 
    manualUrlEncryptKey: 

尝试了几次之后, 发现其实有改变的就是 `userName` 和 `userPwd` 两个参数, 而 `userPwd` 是一串有两个`=` 号的密文, 显然就是将用户密码经过 base64 之后得到

而登录的返回的话是下面这样的一段密文

    JTdCJTIycG9ydFNlcnZFcnJvckNvZGUlMjIlM0ElMjIxJTIyJTJDJTIycG9ydFNlcnZFcnJvckNvZGVEZXNjJTIyJTNBJTIyJUU4JUFFJUJFJUU1JUE0JTg3JUU2JThCJTkyJUU3JUJCJTlEJUU4JUFGJUI3JUU2JUIxJTgyJTIyJTJDJTIyZV9jJTIyJTNBJTIycG9ydFNlcnZFcnJvckNvZGUlMjIlMkMlMjJlX2QlMjIlM0ElMjJwb3J0U2VydkVycm9yQ29kZURlc2MlMjIlMkMlMjJlcnJvck51bWJlciUyMiUzQSUyMjclMjIlN0Q

和对 cookie 内容的解密一样, 我们用 base64 先解密一次, 然后用 urlDecode 就可以看到原来的 JSON 信息了, 其 JSON 信息如下

    {
        "portServErrorCode": "1",
        "portServErrorCodeDesc": "设备拒绝请求",
        "e_c": "portServErrorCode",
        "e_d": "portServErrorCodeDesc",
        "errorNumber": "7"
    }

而经过多次的尝试之后, 发现根据输入内容及帐号状态的不同, 会有以下的一些返回

 - 设备上已经有帐号登录了
    
        {
            "portServErrorCode": "1",
            "portServErrorCodeDesc": "设备拒绝请求",
            "e_c": "portServErrorCode",
            "e_d": "portServErrorCodeDesc",
            "errorNumber": "7"
        }

 - 用户名错误

        {
            "portServIncludeFailedCode": "63018",
            "portServIncludeFailedReason": "E63018:用户不存在或者用户没有申请该服务。",
            "e_c": "portServIncludeFailedCode",
            "e_d": "portServIncludeFailedReason",
            "errorNumber": "7"
        }

 - 密码错误

        {
            "portServIncludeFailedCode": "63032",
            "portServIncludeFailedReason": "E63032:密码错误，您还可以重试8次。",
            "e_c": "portServIncludeFailedCode",
            "e_d": "portServIncludeFailedReason",
            "errorNumber": "7"
        }

 - 登录成功

        {
            "errorNumber": "1",
            "heartBeatCyc": 900000,
            "heartBeatTimeoutMaxTime": 2,
            "userDevPort": "Servers-Aggregation-SW-S5560X-54C-EI-vlan-01-4055@vlan",
            "userStatus": 99,
            "serialNo": 4686,
            "ifNeedModifyPwd": false,
            "browserUrl": "",
            "clientPrivateIp": "",
            "userurl": "",
            "usermac": null,
            "nasIp": "",
            "clientLanguage": "Chinese",
            "ifTryUsePopupWindow": true,
            "triggerRedirectUrl": "",
            "portalLink": "JTdCJTIyZXJyb3JOdW1iZXIlMjIlM0ElMjIxJTIyJTJDJTIyaGVhcnRCZWF0Q3ljJTIyJTNBOTAwMDAwJTJDJTIyaGVhcnRCZWF0VGltZW91dE1heFRpbWUlMjIlM0EyJTJDJTIydXNlckRldlBvcnQlMjIlM0ElMjJTZXJ2ZXJzLUFnZ3JlZ2F0aW9uLVNXLVM1NTYwWC01NEMtRUktdmxhbi0wMS00MDU1JTQwdmxhbiUyMiUyQyUyMnVzZXJTdGF0dXMlMjIlM0E5OSUyQyUyMnNlcmlhbE5vJTIyJTNBNDY4NiUyQyUyMmlmTmVlZE1vZGlmeVB3ZCUyMiUzQWZhbHNlJTJDJTIyYnJvd3NlclVybCUyMiUzQSUyMiUyMiUyQyUyMmNsaWVudFByaXZhdGVJcCUyMiUzQSUyMiUyMiUyQyUyMnVzZXJ1cmwlMjIlM0ElMjIlMjIlMkMlMjJ1c2VybWFjJTIyJTNBbnVsbCUyQyUyMm5hc0lwJTIyJTNBJTIyJTIyJTJDJTIyY2xpZW50TGFuZ3VhZ2UlMjIlM0ElMjJDaGluZXNlJTIyJTJDJTIyaWZUcnlVc2VQb3B1cFdpbmRvdyUyMiUzQXRydWUlMkMlMjJ0cmlnZ2VyUmVkaXJlY3RVcmwlMjIlM0ElMjIlMjIlN0Q"
        }
 
    
     - 这里的 portalLink 解密之后如下, 似乎也没有什么有用的内容
        
        > {"errorNumber":"1","heartBeatCyc":900000,"heartBeatTimeoutMaxTime":2,"userDevPort":"Servers-Aggregation-SW-S5560X-54C-EI-vlan-01-4055@vlan","userStatus":99,"serialNo":4686,"ifNeedModifyPwd":false,"browserUrl":"","clientPrivateIp":"","userurl":"","usermac":null,"nasIp":"","clientLanguage":"Chinese","ifTryUsePopupWindow":true,"triggerRedirectUrl":""}

## 1.3 登录成功
当我们输入正确的帐号和密码后, 网页上的变化是, 跳转到了一个 已登录的提示页面, 从 Chrome 看到的请求有以下这些

![](http://ww1.sinaimg.cn/large/ae1a7c45gy1ftfjwehcl5j20ya0htq8r.jpg)

出去对静态资源的请求, 剩下的就是

<br>

 - GET `afterLogin.jsp` 上线提示
 - GET `online.jsp`
 - GET `listenClose.jsp`
 - GET `online_heartBeat.jsp`
 - GET `online_showTimer.jsp`

<br>

其中第四个 `online_heartBeat.jsp` 显然是为了为此连接而使用的心跳包, 剩下的, 从结果来看, 似乎都只是一些用于网页上展示的页面文件而已, 例如 `online_showTimer.jsp` 就是展示倒计时的时钟的

而测试中发现, 在通过 `portal/pws?t=li` 接口登录成功之后, 哪怕不往 `online_showTimer.jsp` 发送一个 GET 请求, 也依然能够联网, 所以实际上我们登录, 就只需要用到 `online_showTimer.jsp` 接口而已

那么 `online_heartBeat.jsp` 接受什么信息呢, 主要是下面的这些 URL 参数

    hlo: null
    pl: 上面 cookie 当中获取的值
    startTime: 1531901701428
    userName: null
    userPwd: null
    loginType: 3
    innerStr: null
    outerStr: null
    v_is_selfLogin: 0
    custompath: templatePage/20170110154814101/
    uamInitCustom: 0
    uamInitLogo: H3C
    customCfg: MTA1

这里面除了 startTime 和 pl 之外, 其他的参数似乎并没有什么变化, 另外就是 Referer 和 Cookie 的 Header

## 1.4 退出

那么当我登录好了, 如果想要退出的话, 应该怎么办呢, 一开始通过 Chrome 查看到, 实际上退出的话, 是向两个地址发送了请求, 分别是

 - GET `portal/pws?t=lo&language=Chinese&userip=&basip=&_=1531901705967`
 - POST `portal/templatePage/20170110154814101/logout.jsp`

一开始我以为 GET 请求只是获取页面而已, POST 一定是正正经经的退出接口

然后尝试了好几次之后我发现我错了

**所以这个 GET 的接口才是正确的退出接口 ????? 为什么是 GET 而不是 POST ?????**

反正我是搞不懂了

而这个 GET 接口主要接受的这么几个 URL 参数

    pl: 上面 Cookie 中取得的值
    hlo: null
    customCfg: MTA1
    custompath: templatePage/20170110154814101/
    uamInitCustom: 0
    uamInitLogo: H3C

另外带上 Cookie 的 Header 和 Referer 的 Header, 其中 Referer 的值是

    http://xx.xx.xx.xx/portal/templatePage/20170110154814101/online_showTimer.jsp?hlo=null&pl=JTdCJTIyZXJyb3JOdW1iZXIlMjIlM0ElMjIxJTIyJTJDJTIyaGVhcnRCZWF0Q3ljJTIyJTNBOTAwMDAwJTJDJTIyaGVhcnRCZWF0VGltZW91dE1heFRpbWUlMjIlM0EyJTJDJTIydXNlckRldlBvcnQlMjIlM0ElMjJTZXJ2ZXJzLUFnZ3JlZ2F0aW9uLVNXLVM1NTYwWC01NEMtRUktdmxhbi0wMS00MDU1JTQwdmxhbiUyMiUyQyUyMnVzZXJTdGF0dXMlMjIlM0E5OSUyQyUyMnNlcmlhbE5vJTIyJTNBNzE5NiUyQyUyMmlmTmVlZE1vZGlmeVB3ZCUyMiUzQWZhbHNlJTJDJTIyYnJvd3NlclVybCUyMiUzQSUyMiUyMiUyQyUyMmNsaWVudFByaXZhdGVJcCUyMiUzQSUyMiUyMiUyQyUyMnVzZXJ1cmwlMjIlM0ElMjIlMjIlMkMlMjJ1c2VybWFjJTIyJTNBbnVsbCUyQyUyMm5hc0lwJTIyJTNBJTIyJTIyJTJDJTIyY2xpZW50TGFuZ3VhZ2UlMjIlM0ElMjJDaGluZXNlJTIyJTJDJTIyaWZUcnlVc2VQb3B1cFdpbmRvdyUyMiUzQXRydWUlMkMlMjJ0cmlnZ2VyUmVkaXJlY3RVcmwlMjIlM0ElMjIlMjIlN0Q&startTime=1531901701428&userName=null&userPwd=null&loginType=3&innerStr=null&outerStr=null&v_is_selfLogin=0&custompath=templatePage/20170110154814101/&uamInitCustom=0&uamInitLogo=H3C&customCfg=MTA1

里面的变量除了 pl 之外就是那个 startTime 参数了, 显而易见就是连接开始的时间啦, 但是后面发现似乎怎么设置都没有关系, 因为我是用代码记录下发送登录请求的函数执行时候的时间戳, 然后填到这里来的

## 1.5 未解问题

还是没法知道为什么学校的 iMC Portal 在连接 15 分钟后就会自动断开, 起初我以为是网页错误导致无法发送心跳包, 但是当我用代码模拟的整个过程, 并且每 5 分钟发送一次心跳包的情况下

**连接 15 分钟后, 依然会掉线!!!???**

此处有黑人问号, 只能猜测这样的设计是为了避免大家离开了教学去但是帐号没有下线, 导致无法在宿舍登录校园网?

# 2 最终产出

详细的了解了连接的过程以及对应的数据发送内容之后, 就可以用代码来实现连接过程了, 并且最重要的是, 能够实现自动在断线后重连的功能

最终程序使用 Golang 实现, 由于 Golang 方便的编译功能, 所以程序能够快速的变成 Linux\Windows\Mac 平台下的二进制文件, 方便使用和传播

具体的代码在 

    https://github.com/Besfim/iMC-Portal-Login

其中 Release 已经发布了 V0.1 版本, 下载对应平台的二进制文件就能够使用了, 使用方法如下

    -p string
        校园网密码 (default "null")
    -u string
        学生学号 (default "null")
    -d
        开启 DEBUG 日志打印
    -o 
        强制退出之前登录的帐号, 确保帐号已下线, 也要求输入正确的用户名和密码参数-p s

更多代码细节请参考 Github 上面的源码
