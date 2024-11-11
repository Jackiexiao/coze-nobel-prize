帮我写个周周黑客松的电子奖状生成器，基于 nextjs 和 shadcn/ui, 尽量好看一些，首页有效果图演示，需要能在手机端使用

COZE_API_KEY read from .env
COZE_BOT_ID read from .env

1. 创建一个页面，让用户输入奖项名称， 和颁奖词，上传照片，然后点击生成，

下面的应该在 nextjs api 中完成

2. 首先你需要参考这个api文档上传照片获得file_id
https://www.coze.cn/docs/developer_guides/upload_files


3. 你要创建一个conversation，然后发送消息，消息中包含 `title: 奖项名称` 和 `subtitle: 颁奖词` 以及 前面上传照片对应的 `file_id`，示例代码如下

conversation_id 随机生成然后传入

```
curl --location --request POST 'https://api.coze.cn//v3/chat?conversation_id=737475200011611****' \
--header 'Authorization: Bearer pat_OYDacMzM3WyOWV3Dtj2bHRMymzxP****' \
--header 'Content-Type: application/json' \
--data-raw '{
    "bot_id": "737946218936519****",
    "user_id": "123456789",
    "stream": false,
    "auto_save_history":true,
    "additional_messages":[
        {
            "role":"user",
            "content":"[{\"type\":\"image\",\"file_url\":\"https://lf-bot-studio-plugin-resource.coze.cn/obj/bot-studio-platform-plugin-tos/artist/image/4ca71a5f55d54efc95ed9c06e019ff4b.png\"},{\"type\":\"text\",\"text\":\"帮我看看这张图片里都有什么\"}]",
            "content_type":"object_string"
        }
    ]
}'

```


3. 大概等待十几秒后，你会收到一个返回，如果 msg 其中有图片链接，则将它显示在 前端页面上

返回示例
```
{
    "data":{
    // data 字段中的 id 为 Chat ID，即会话 ID。
        "id": "123",
        "conversation_id": "123456",
        "bot_id": "222",
        "created_at": 1710348675,
        "completed_at": 1710348675,
        "last_error": null,
        "meta_data": {},
        "status": "compleated",
        "usage": {
            "token_count": 3397,
            "output_count": 1173,
            "input_count": 2224
        }
    },
    "code":0,
    "msg":""
}
```