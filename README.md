## ChatHelper聊天助手脚本

项目结构

    images 资源文件

    platform 平台支持
        huanyou.js 欢友平台
        ....js     其他平台

    ui       UI界面
        index.html  UI主文件
        ui.min.css  UI样式文件

    main.js  入口文件
    package.json    帮助编辑器识别配置
    project.json    Autox.js 项目配置文件
    run.js          项目运行入口文件

开发新平台

    在platform中新建平台.js文件
    写好相关逻辑，暴露start方法

        module.exports = {
            start(config) {
                // 在这里调用其他方法
            }
        }
        // 方法参数config 配置如下示例
        config = {
            "replay":{
                "isPriority":true,
                "min":"1",
                "max":"2"
            },
            "dynamic":{
                "isRefresh":true,
                "min":"3",
                "max":"4",
                "isLike":true,
                "likeChance":"0"
            },
            "hello":{
                "isSayHello":true,
                "min":"5",
                "max":"6"
            }
        }
    
