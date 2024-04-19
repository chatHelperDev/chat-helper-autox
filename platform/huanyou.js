importClass(android.content.Intent)
var Nicknames = []
function getSpeed(v) {
    return v
}
function main(_c) {
    /**
     * {
     *  helloContext: ['1', '2', '3'...]
     *  replayContent: [
     *      {key: 关键词, content: [{replay: 回复内容，lastTime: 上次使用时间}]}
     *  ]
     * }
     */
    const replayConfig = {
        helloContent: [],
        replayContent: []
    }
    construct()
    function construct() {
        const replayContentText = files.read('/sdcard/Download/1.txt')
        const helloContentText = files.read('/sdcard/Download/2.txt')
        replayConfig.helloContent = helloContentText.split(/[(\r\n)\r\n]+/)
        const replayContext = replayContentText.split(/[(\r\n)\r\n]+/)
        for (let i = 0; i < replayContext.length; ++i) {
            let line = replayContext[i].split('--')
            let key = line.shift()

            let currentReplayContent = {key, content: []}
            for (let j = 0; j < line.length; ++ j) {
                currentReplayContent.content.push({replay: line[j], lastTime: new Date().getTime()})
            }
            replayConfig.replayContent.push(currentReplayContent)
        }
    }
    function backToTop(bottomIdx) {
        var bottom = id('ll_bottom').findOne(1000)
        if (!bottom) {
             back()
             sleep(1000)
             return backToTop()
        }
        // 判断是否在资料详情页面
        if (id('ll_bottom').findOne().childCount() !== 5) {
            back()
            sleep(1000)
            return backToTop()
        }
        console.log("回到首页成功")
    }
    
    function replayMessage() {
        // 回到聊天顶部
        function swipToTop() {
            swipe(device.width * 0.4, device.height * 0.3, device.width * 0.3, device.height * 0.9, 200)
            let node = id('tv_title').findOne(1000)
            if (node) {
                return 
            }
            return swipToTop()
        }
        // 检测是否有新消息
        function hasNewMessage() {
            backToTop()
            console.log("正在检测是否有新消息")
            click(device.width * 0.7, device.height * 0.9)
            let unReadMessageNode = id('tv_tab_title').findOne(1000)
            if (!unReadMessageNode) {
                return false
            }
            return unReadMessageNode.text().indexOf("(") !== -1 
        }
        // 回复逻辑
        function replay() {
            // 检测是否有消息
            if (!hasNewMessage()) {
                return false
            }
            try {
                // 这里边会判断是打招呼还是回复，打招呼是当前聊天信息框是否无内容，回复逻辑是当前最后一条消息不是自己发送
                // 点一个未读消息进入, 先点一下聊天保证界面有未读消息的节点
                click(device.width * 0.7, device.height * 0.9)
                sleep(1000)
                const unReadNode = id('tv_unread_count').findOne(1000)
                if (!unReadNode) {
                    console.log('未找到未读消息，尝试返回顶部')
                    swipToTop()
                    // 没有未读消息了
                    return replay() 
                }
                unReadNode.parent().parent().click()
                sleep(1000)
                sendMessage()
                return true
            }catch(e) {
                console.log(e)
                console.log('消息发送异常')
                return true
            }
            // 点击未读消息进入聊天界面
            // 回复信息
            
        }
        backToTop()
        // 如果配置优先回复消息，则消息回复完再执行
        // if (_c.replay.isPriority) {
        //     console.log('优先回复消息')
        //    while(replay()) {
            
        //    }
        //    return 
        // }
        // 如果没有勾选优先回复，则随机回复N个消息
        const randMessage = random(+_c.replay.min, +_c.replay.max + 1)
        console.log('随机回复', randMessage, '个消息')
        for (let i = 0; i < randMessage; i ++ ) {
            replay()
        }
        
    }
    
    function refreshDynamic() {
        backToTop()
        const bottom = id('ll_bottom').findOne(1000)
        if (!bottom) {
            return 
        }
        click(device.width * 0.20, bottom.bounds().centerY())
        // 随机一个时间
        const time = random(+_c.dynamic.min, +_c.dynamic.max) * 1000 + (new Date().getTime())
        console.log('结束时间', new Date(time).getMinutes(), new Date(time).getSeconds())
        function runner() {
            // 时间到了，结束
            if ((new Date().getTime()) > time) {
                return 
            }
            swipe(device.width * 0.25, device.height * 0.75, device.width * 0.7, device.height * 0.3, 500)
            if (random(0, 100) <= +_c.replay.likeChance) {
                // 执行点赞
                console.log('执行点赞')
                let node = id('tv_amount_time_read').findOne(1000)
                // 当在屏幕中间区域才执行点赞 device.height * 0.25 < y < device.height * 0.8
                if (node && node.bounds().top > device.height * 0.25 && node.bounds().top < device.height * 0.8) {
                    click(node.bounds().left + 10, node.bounds().bottom + 40)
                }
            }
            sleep(random(2000, 8000))
            return runner()
        }
        runner()
    }
    
    function sendMessage() {
        // 获取打招呼话术
        function getHelloMessage() {
            return replayConfig.helloContent[random(0, +replayConfig.helloContent.length)]
        }
        // 获取回复话术
        function getReplayMessage() {
            // 获取最后一条内容信息
            let messageNodes = id('recyclerview').findOne().find(
                id("tv_content")
            )
            if (!messageNodes) {
                console.log('获取最后一条信息失败')
                return 
            }
            let msgContent = messageNodes[messageNodes.length - 1].text()
            if (!msgContent) {
                console.log('最后一条消息解析失败')
                return 
            }
            console.log('正在获取回复内容', msgContent)
            let currentKeyLength = 0
            let currentIdx = 0
            for (let i = 0; i < replayConfig.replayContent.length; ++ i) {
                let current = replayConfig.replayContent[i]
                // 找到关键词 且 当前关键词最长
                if (msgContent.indexOf(current.key) !== -1 && current.key.length > currentKeyLength) {
                    currentKeyLength = current.key.length
                    currentIdx = i
                }
            }
            // 未匹配到话术 返回''
            if (currentKeyLength === 0) {
                return ''
            }
            // 获取最长未使用话术
            const currentMatchContent = replayConfig.replayContent[currentIdx]
            let lastUseTime = currentMatchContent.content[0].lastTime
            let replayMessage = currentMatchContent.content[0].replay
            let _oldReplayidx = 0
            for (let i = 1; i < currentMatchContent.content.length; ++ i) {
                let curMatchReplay = currentMatchContent.content[i]
                if (curMatchReplay.lastTime < lastUseTime) {
                    _oldReplayidx = i
                    lastUseTime = curMatchReplay.lastTime
                    replayMessage = curMatchReplay.replay
                }
            }
            currentMatchContent.content[_oldReplayidx].lastTime = new Date().getTime()
            return replayMessage
        }
        // 判断是不是新对话框，如果是则发送回复话术，不是则发送打招呼话术
        function lastMessageIsSendBySelf () {
            // 判断最后一条消息颜色
            var messagesNodes = id('recyclerview').findOne().find(
                id("tv_content")
            )
            if (messagesNodes.length < 1) {
                return false
            }
            // 截屏
            var img = images.captureScreen()
            // 裁剪所选区域
            var lastMessageNode = messagesNodes[messagesNodes.length - 1]
            var messageClip = images.clip(
                img, 
                lastMessageNode.bounds().left, 
                lastMessageNode.bounds().top,
                100,
                lastMessageNode.bounds().bottom - lastMessageNode.bounds().top
            )
            // 找到则代表是对方发送的消息，没找到则代表自己发送的消息
            let r = images.findColor(messageClip, '#ffffff')
            messageClip.recycle()
            img.recycle()
            return !r
        }
        // 发送消息逻辑 配合键盘
        function inputAndSendMessage(message) {
            var intent = new Intent("__INPUT_AUTO__");
            intent.putExtra("message", message);
            context.sendBroadcast(intent);
            sleep(1000)
            intent = new Intent("__INPUT_AUTO__");
            intent.putExtra("message", "__SEND__");
            context.sendBroadcast(intent);
        }
        console.log("开始发送消息")
        let message = ''
        if (lastMessageIsSendBySelf()) {
            console.log('最后一条消息是自己发送，不回复')
            return 
        }
        // 空白消息框
        if (!id('ccv_content').findOne(3000)) {
            message = getHelloMessage()
        } else {
            message = getReplayMessage()
        }
        console.log('待发送的消息', message)
        // 如果message为空，则直接返回不执行发送数据
        if (!message) {
            return 
        }
        let inputNode = id('all_et_content_container').findOne(1000)
        // 检测是否有快速发送消息数据
        try {
            console.log('正在检测是否有快捷消息')
            let quickNode = id('quick_replies_recyclerview').findOne(1000)
            if (quickNode && quickNode.childCount() > 1) {
                quickNode.child(random(1, quickNode.childCount() - 1)).click()
            }
            sleep(random(4000, 10000))
        }catch(e) {
            console.log(e.message)
        }
        
        try {
            click(inputNode.bounds().centerX(), inputNode.bounds().centerY())
            inputAndSendMessage(message)
        }catch(e) {
            back()
            sleep(1000)
        }
        
        return 
        
    }

    function sayHello() {
        backToTop()
        // 到第一个选项卡
        var bottomNode = id('ll_bottom').findOne(1000)
        if (!bottomNode) {
            console.log("界面位置不正确，正在尝试下一个动作")
            return 
        }
        click(device.width * 0.15, bottomNode.bounds().centerY())
        // 随机一个打招呼数量
        const count = random(+_c.hello.min, +_c.hello.max)
        console.log('随机打招呼数量', count)
        for (let i = 0; i < count; i ++ ) {
            findUserToChat()
            toHello()
            sleep(1000)
            backToTop()
        }
        function findUserToChat() {
            // 检测昵称是否缓存过 true -> 下滑 + findUserToChat() -> return
            let nks = selector().id('recyclerview').findOne().find(
                id('tv_nickname')
            )
            if (!nks) {
                console.log("未找到列表信息，等待5秒后继续")
                sleep(getSpeed(5000))
                return
            }
            let _isClicked = false 
            for (let i = 0; i < nks.length; i ++ ) {
                let _cnks = nks[i].text()
                if (Nicknames.indexOf(_cnks) !== -1) {
                    continue
                }
                Nicknames.push(_cnks)
                // 超过10000个昵称缓存则删除
                if (Nicknames.length > 10000) {
                    Nicknames.shift()
                }
                // 执行进入聊天界面
                try {
                    nks[i].parent().parent().click()
                }catch(e) {
                    sleep(1000)
                    console.log('昵称数据获取出错，正在尝试下一个')
                    continue
                }
                _isClicked = true
                sleep(getSpeed(1000))
                // 判断是否在用户详细信息页面
                if (!id('rl_level').findOne(1000)) {
                    continue
                }
                // 找到私信按钮, 在设备中间偏左位置
                click(device.width * 0.43, device.height * 0.93)
                break
            }
            if (!_isClicked) {
                swipe(device.width / 2, device.height * 0.8, device.width / 3, device.height * 0.2, 500)
                sleep(random(1000, 3000))
                return findUserToChat()
            }
            sleep(getSpeed(1000))
        }

        function toHello() {
            // 检测是否在聊天界面
            let inputNode = selector().id('all_et_content_container').findOne(2000)
            if (!inputNode) {
                console.log("不是聊天界面，尝试返回")
                return 
            }
            // 找到输入框
            click(inputNode.bounds().centerX(), inputNode.bounds().centerY())
            sleep(getSpeed(1000))
            // 发送消息
            sendMessage()

            let hasMoney = selector().id('tv_cancel').findOne(getSpeed(1000))
            if (hasMoney) {
                hasMoney.click()
            }
            back()
        }
    }
    while(true) {
        // 回首页
        console.log('正在回到首页')
        backToTop()
        // 回复消息
        console.log('正在执行回复消息任务')
        replayMessage()
        // 回首页
        backToTop()
        // 打招呼
        console.log('正在执行打招呼任务')
        sayHello()
        // 回首页
        backToTop()
        // 刷新动态
        console.log('正在执行刷新动态任务')
        refreshDynamic()
    }
}
module.exports = {
    start(config) {
        main(config)
    }
}