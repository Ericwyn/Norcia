## 前言
自定义注解算是 Java 这门语言当中我非常喜欢的特性了，因为它能够实实在在的提高开发效率，简化代码而不失可读性。之前仅仅在写入门级 ORM 框架的时候使用过，这两天开发新的项目，看到dalao们在Spring Boot 当中使用自定义注解来完成各种事务，立马就学习了一下

## 环境
 - Spring Boot 2.0.5.RELEASE

## 目标
我们希望使用对于方法的注解，来为该方法加入请求鉴权，增加 RESTful API 的安全性

## 注解定义
使用 `public @interface` 来定义一个公共的注解，具体代码如下

    @Target(ElementType.METHOD)
    @Retention(RetentionPolicy.RUNTIME)
    public @interface Authorization {
        Class type();
    }

这其中的 `type` 属性我们用来区别用户角色

## 编写拦截器
有了注解之后，我们需要编写一个拦截器，为注解绑定处理流程。Spring MVC 允许我们直接继承一个拦截器适配器 `HandlerInterceptorAdapter` ，来实现一个自定义拦截器，只需要实现一个 `preHandle` 方法就可以了，完整代码如下

    @Component
    public class AuthorizationInterceptors extends HandlerInterceptorAdapter {
        @Autowired
        TokenService tokenService;
    
        @Override
        public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
            if (!(handler instanceof HandlerMethod)){
                return true;
            }
            HandlerMethod handlerMethod = (HandlerMethod)handler;
            Method method = handlerMethod.getMethod();
            Annotation annotation;
            if ((annotation = method.getAnnotation(Authorization.class) ) == null){
                return true;
            }
            String authorization = request.getHeader("token");
            AccessToken token = tokenService.getToken(authorization);
            if (token == null){
                // 设置但 token 错误的时候返回 401
                response.setStatus(401);
                return false;
            }else {
                // 判断 token 对象是否属于特定的角色（管理员、微信用户），然后分开处理
                if (((Authorization) annotation).type() == Admin.class && token.getAdmin()!=null){
                    request.setAttribute("token", token.getUuid());
                    return true;
                }else if (((Authorization) annotation).type() == Wechater.class && token.getWechater()!=null){
                    request.setAttribute("token", token.getUuid());
                    return true;
                }else {
                    response.setStatus(200);
                    response.getWriter().append(JSON.toJSONString(ResJson.errorAccessToken()));
                    return false;
                }
            }
        }
    }

## 将注解添加到 Spring 当中
注解绑定了处理的事务之后还需要将其添加到Spring 配置当中，新建一个配置类直接实现 `WebMvcConfigurer` 接口就可以了，然后填充 `addInterceptors` 方法，完整代码如下

    @Configuration
    public class InterceptorConfig implements WebMvcConfigurer {
        @Bean
        AuthorizationInterceptors authorizationInterceptor() {
            return new AuthorizationInterceptors();
        }
        
        @Override
        public void addInterceptors(InterceptorRegistry registry) {
            // 鉴权的 @Authorization 注解
            registry.addInterceptor(authorizationInterceptor()).addPathPatterns("/**");
            System.out.println("鉴权 @Authorization 注解增加成功");
        }
    }

## 使用注解

    @RequestMapping(value = "/api/logout")
    @Authorization(type = Admin.class)
    public String test(){
        return "success";
    }

这样的话，请求`/api/logout`的时候，就一定要在 header 里面带上一个 token 参数才可以，token 一般是从登录接口那里获取的
