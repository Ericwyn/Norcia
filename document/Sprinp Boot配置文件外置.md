## 前言
之前 Spring Boot 开发的时候，打包部署会联通 properties 文件一同打包，虽然这样的好处是生成了一个 jar，直接一把梭 `nohup java -jar `就启动了，但是也有很麻烦的地方，例如需要修改配置文件的时候，就要重新打包。于是学习了 Spring Boot 将配置文件外置的方法

## Spring Boot 配置文件加载优先级
按照规定，Spring Boot 的配置文件加载优先级如下：

 - 当前目录下的config子目录
 - 当前目录
 - classpath下的config目录
 - classpath根路径

**优先级自上而下递减 !**

## 修改 pom.xml
因为我们需要使用外置的配置文件，所以先要让 maven 忽略 resource 里面的配置文件，在打包的时候略过他们，方法如下：在 `pom.xml` 当中添加以下代码

    <build>
        <resources>
            <resource>
                <directory>src/main/resources</directory>
                <excludes>
                    <exclude>**/*.properties</exclude>
                    <exclude>**/*.yml</exclude>
                    <exclude>**/*.xml</exclude>
                </excludes>
            </resource>
        </resources>
    </build>

## 转移配置
 - 在项目根目录下面创建 config 文件夹
    - 之所以使用 config 文件夹是考虑到这样的话工程目录更加清晰
 - 复制 `resource` 文件夹当中的配置文件到 config 文件夹里面
 
## 修改代码（可能不需要）
如果代码当中有些并不是使用自动注入读取的配置的话，要修改获取方式，从前我们使用

    Resource resource = new ClassPathResource("/application.properties");
    
 现在变成
 
    Resource resource = new FileSystemResource("config/application.properties");

最后，重新打包项目就可以了~