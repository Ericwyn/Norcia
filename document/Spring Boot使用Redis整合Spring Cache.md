## 前言
业务中要求在 Spring Boot 框架上使用缓存来提高数据加载速度，减少对数据库的访问，于是使用 Spring Cache 来作为 Spring Boot 的缓存。

## 一，加入依赖
由于需要使用 Redis，所以添加 Redis 的依赖是免不了的
### `pom.xml`

    <!--Spring redis-->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>
    
### 加入配置 `application.properties`

    spring.redis.database=5
    spring.redis.host=127.0.0.1
    spring.redis.port=6379
    spring.redis.password=password
    # 旧版本 Spring Boot 中的 redis 配置
    # spring.redis.jedis.pool.max-wait=-1ms
    # spring.redis.jedis.pool.max-active=8
    # spring.redis.jedis.pool.max-idle=8
    # spring.redis.jedis.pool.min-idle=0
    spring.redis.timeout=10000ms
    
    # Spring Boot 2.0.3 默认使用 lettuce 链接 redis，配置要变成这样
    # 连接池最大连接数（使用负值表示没有限制） 默认 8
    spring.redis.lettuce.pool.max-active=8
    # 连接池最大阻塞等待时间（使用负值表示没有限制） 默认 -1
    spring.redis.lettuce.pool.max-wait=-1ms
    # 连接池中的最大空闲连接 默认 8
    spring.redis.lettuce.pool.max-idle=8
    # 连接池中的最小空闲连接 默认 0
    spring.redis.lettuce.pool.min-idle=0

## 二，引入 Spring Cache
在启动类添加注解，以引入 Spring Cache

    @SpringBootApplication
    @ServletComponentScan
    @EnableCaching
    public class FontainerApplication {
    
        public static void main(String[] args) {
            SpringApplication.run(FontainerApplication.class, args);
        }
        
    }

## 三，配置 Cache 注解
Cache 注解主要有下面几个，参考 [spring-boot-cache使用实战-简书](https://www.jianshu.com/p/fd950f65aec7) 当中的表格介绍

    @Cacheable (存在缓存则直接返回,不存在则调用业务方法,保存到缓存)
    @CacheEvict (清楚缓存,可清楚cache里全部缓存)
    @CachePut (不管缓存存不存在,调用业务方法,将返回值set到缓存里面)

我的话主要是用的是 `@Cacheable` 和 `@CacheEvict`，注解的是位于 Service 的方法，其中

 - `@Cacheable` 注解各种查询的业务方法，缓存首次查询的结果，后续的方法的时候直接返回首次查询时候缓存的结果
 - `@CacheEvict` 注解各种插入的业务方法，因为一旦进行了插入，那么旧的缓存可能就会过期了，因此，使用该注解去清除由 `@Cacheable` 注解设置的缓存
 
### 代码示例
下面的代码是 Service 层的代码，负责 Product 这个对象的查询和插入

    @Service
    public class ProductService {
        @Autowired
        ProductRepository productRepository;
    
        @Cacheable(value = "ProductService.listProduct")
        public Page<Product> listProduct(int page, int size){
            return productRepository.findAll(PageRequest.of(page, size));
        }
        
        // 使用 CacheEvict 注解，一旦插入的时候
        @CacheEvict(value = "ProductService.listProduct", allEntries = true)
        public Product addProduct(String name, String intro, String price, String pic){
            Product product = new Product();
            product.setName(name);
            product.setIntro(intro);
            product.setPrice(price);
            product.setPic(pic);
            return productRepository.save(product);
        }
    
    }

 - `listProduct(int page, int size)`使用 `@Cacheable(value = "ProductService.listProduct")` 
    注解
    - value 为 `ProductService.listProduct` 代表以这个名称来缓存其结果
    - 默认的话，缓存的 key 是该方法的入参，也就是当入参一样并且存在缓存的时候，会直接返回已缓存的结果，否则的话会执行一下数据库查询。
 
 - `addProduct(String name, String intro, String price, String pic)` 使用 `@CacheEvict(value = "ProductService.listProduct", allEntries = true)` 注解
    - CacheEvict 注解的 value 为 `ProductService.listProduct` 代表要执行该方法的时候，要清楚该名称的缓存，allEntries = true 则代表删除所有 key 的缓存。