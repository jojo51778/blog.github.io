## HTTP状态码

### 1XX
Informational信息性状态码，接收的请求正在处理
### 2XX 成功
Success成功状态码，请求正常处理完毕

#### 200 OK
请求被服务端正常处理
#### 204 No Content
请求处理成功，但是没有资源可以返回
#### 206 Partial Content
对资源某一部分的请求，响应报文中包含Content-Range指定范围的实体内容
### 3XX
Redirection重定向状态码，需要进行附加操作以完成请求
#### 301 Moved Permanently
永久性重定向。请求资源已被分配新的URI，以后使用资源现在所指的URI
#### 302 Found
临时性重定向，资源的URI已临时定位到其他位置了，希望本次使用新的URI访问
#### 303 See Other
资源URI已更新，明确使用用GET方法获取请求的资源
#### 304 Not Modified
资源已找到，但未符合条件要求，和重定向没什么关系，附带条件的请求是指采用GET方法的请求报文中包含
If-Match,If-Modeified-Since,If-None-Match,If-Range,If-Unmodeified-Since中的任一首部
#### 307 Temporary Redirect
临时重定向，跟302 Found有着相同的含义，302标准禁止POST换成GET,但是实际使用大家不遵守，307会按照浏览器标准，不会让POST变成GET
，但是对于处理响应时的行为，每种浏览器有可能出现不同的情况
### 4XX
Client Error客户端错误状态码，服务器无法处理请求
#### 400 Bad Request
表示请求报文中存在语法错误。需要修改请求的内容再次发送。浏览器会像200 OK一样对待该状态
#### 401 Unauthorized
表示请求需要有通过HTTP认证（BASIC认证、DIGEST认证）的认证信息。
如果之前已经进行过1次请求，则表示用户认证失败。返回含有401的响应必须包含一个适用于被请求资源的WWW-Authenticate首部用以质询用户信息。
当浏览器初次接收到401响应，会弹出认证用的对话窗口。
#### 403 Forbidden
请求资源的访问被服务器拒绝。未授权，可以在实体的主体部分对原因进行描述
#### 404 Not Found
服务器上无法找到请求的资源。也可以在服务端不想说明理由的时候使用
### 5XX
Server Error服务端错误状态码，服务器处理请求出错
#### 500 Internal Server Error
服务端在执行请求时候发生错误。也有可能是Web应用存在的bug或者某些临时的故障
#### 503 Service Unavailable
服务器暂时处于超负载或者正在进行停机维护，现在无法处理请求，如果事先得知以上状况需要的时间，最好写入RetryAfter首部字段在返回给客户端