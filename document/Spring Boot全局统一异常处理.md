## 前言
之前用 Spring Boot 写 RESTful API 的时候，对于各种错误的捕捉都是直接用 try catch 的，所以在各个方法里面都总是有一些相同的 try catch 代码块，虽然也是能用但是总有点别扭不自在。这两天学习了一下 Spring Boot 当中对于异常的统一处理，发现很简单但是却能让代码优雅不少。

## 定义自定义异常
不多累述

```
public class JsonParseException extends Exception {

    private static final long serialVersionUID = 2008642168824905631L;

    public JsonParseException(String msg){
        super(msg);
    }
    
}
```

## 定义对该异常的处理
我们可以把对异常的处理全部写在一个 `GolbalExpectionHandleConfig` 类当中， 具体代码如下
```
@ControllerAdvice
public class GolbalExpectionHandleConfig {
    @ExceptionHandler(value = JsonParseException.class)
    @ResponseBody
    public ResJson jsonParseErrorHandle(HttpServletRequest req, JsonParseException jse){
        return ResJson.errorRequestParam(jse.getMessage()+" --> "+req.getRequestURL());
    }

    @ExceptionHandler(value = IOException.class)
    @ResponseBody
    public ResJson iOExceptionHandle(HttpServletRequest req, IOException ioe){
        ioe.printStackTrace();
        return ResJson.serverErrorJson("系统发生错误，IOExpection ，详情请查看服务器日志 --> "+req.getRequestURL());
    }

    @ExceptionHandler(value = Exception.class)
    @ResponseBody
    public ResJson exceptionHandle(HttpServletRequest req, Exception e){
        e.printStackTrace();
        return ResJson.serverErrorJson("系统发生错误，Expection ，详情请查看服务器日志 --> "+req.getRequestURL());
    }
}
```

从 [Spring MVC重要注解](https://blog.csdn.net/lovesomnus/article/details/73252532) 这里了解到以下几点
 - `@ControllerAdvice` 是一个 `@Component` ，用于定义`@ExceptionHandler`，`@InitBinder`和`@ModelAttribute`方法，使这些配置适用于所有使用`@RequestMapping`方法。
 - Spring4之前，`@ControllerAdvice`在同一调度的Servlet中协助所有控制器。Spring4 已经改变：`@ControllerAdvice` 支持配置控制器的子集，而默认的行为仍然可以利用。
 - 在Spring4中， `@ControllerAdvice` 通过 `annotations()`, `basePackageClasses()`, `basePackages()`方法定制用于选择控制器子集。

然后实际上除了 `@ControllerAdvice` 还有 `@RestControllerAdvice`，两者的区别估计是和`@Controller` 与 `@RestController` 差不多吧

之后所有的 RequestMapping 方法如果抛出了异常的话就会被处理了