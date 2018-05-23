## 前言
使用 Jitpack 能够很方便的把自己一些 java 的库打包成 jar 发布，并且可以在新项目当中使用 maven 引入，实在是很方便，以下是我一些关于 使用 Jitpack 发布 Github 项目的实践

## IDE
 - intellij IDEA

## gradle

    gradle install

然后会看到生成的`.gradle`文件夹

## gradle.build

在项目根目录下新建一个 `gradle.build`文件，基础配置如下

    //配置 java plugin
    apply plugin: 'java'
    //配置生成的jar 名称和版本号
    jar {
        baseName = 'EzeOrm'
        version = '1.1.0'
    }
    //配置代码目录，否则默认实在 src/main/java 里面
    sourceSets {
        main {
            java {
                srcDir 'src'
            }
        }
    }
    
## build

    gradle build 

此时就会看到build文件夹，子文件夹当中class文件夹是编译后的class文件，然后jar文件夹里面是生成的jar，可以查看生成的jar是否有错误

## jitpack

将项目push到github，然后建立一个新的releases ，稍等一下，然后就能在jitpack里面看到了