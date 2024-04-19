const Nicknames = []
let vTrick = ''
const config = {
    speed: 1
}
importClass(android.content.Intent)
function getSpeed(time) {
    return time * config.speed
}

function inputMessage(message) {
    var intent = new Intent("__INPUT_AUTO__");
    intent.putExtra("message", message);
    context.sendBroadcast(intent);
}

function sendMessageByIME () {
    var intent = new Intent("__INPUT_AUTO__");
    intent.putExtra("message", "__SEND__");
    context.sendBroadcast(intent);
}

function sayHello() {
    // 检测是否在聊天界面
    let inputNode = selector().id('all_et_content_container').findOne(2000)
    if (!inputNode) {
        console.log("不是聊天界面，尝试返回")
        return 
    }
    // 找到输入框
    click(inputNode.bounds().centerX(), inputNode.bounds().centerY())
    sleep(getSpeed(1000))
    // 输入文字
    inputMessage(vTrick)
    sleep(getSpeed(500))
    // 点击发送
    sendMessageByIME()
    let hasMoney = selector().id('tv_cancel').findOne(getSpeed(1000))
    if (hasMoney) {
        hasMoney.click()
    }
    back()
}

function findUserToChat() {
    backToHome()
    // 检测昵称是否缓存过 true -> 下滑 + findUserToChat() -> return
    let nks = selector().id('tv_nickname').find()
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
        nks[i].parent().parent().click()
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
        return
    }
    sleep(getSpeed(1000))
    
}

function backToHome() {
    console.log("尝试返回首页...")
    // 检测是否在首页 true -> return
    let indexNode = id("rl_accost").findOne(1000)
    let backNode = id('tv_finish').findOne(1000)
    // 有首页元素并且没有返回按钮的情况
    if (!!indexNode && !backNode) {
        return 
    }
    // 没有首页元素并且有返回按钮的情况,代表在首页其他地方
    if (!indexNode && !!backNode) {
        back()
        sleep(getSpeed(1000))
        // 再次检测是否在首页
        indexNode = id("rl_accost").findOne(1000)
        if (!indexNode) {
            click(device.width * 0.15, device.height * 0.93)
            sleep(getSpeed(1000))
        }
        return
    }
    // 其他情况
    sleep(getSpeed(1000))
    back()
    return backToHome()
}


function _start(_c) {
    console.log("keepScreenOn")
    config.speed = _c.speed
    vTrick = _c.vTick
    console.log("欢友配置", "速度:" + config.speed, "话术:", vTrick)
    device.keepScreenOn()
    // 打开App
    app.launchApp("欢友")
    // 开始运行
    while(true) {
        _run()
        sleep(1000)
    }
    function _run() {
        sleep(getSpeed(1000))
        console.log("寻找聊天对象")
        findUserToChat()
        sleep(getSpeed(1000))
        sayHello()
    }
}

module.exports = {
    start(config) {
        _start(config)
    }
}