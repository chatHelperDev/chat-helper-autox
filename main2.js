"ui";
importClass(android.view.inputmethod.InputMethodManager)
var store = storages.create('__CHAT_HELPER__')

const __CONFIG__ = {
    replay: {
        isPriority: false,
        min: 5,
        max: 10
    },
    dynamic: {
        isRefresh: true,
        min: 10,
        max: 100,
        isLike: true,
        likeChance: 30
    },
    hello: {
        isSayHello: false,
        min: 10,
        max: 100
    }
}

$ui.layout(
    <vertical padding="10">
        <vertical >
            <text textColor="red" text="回复话术放在/sdcard/Download/1.txt"/>
            <text textColor="red" text="打招呼话术放在/sdcard/Download/2.txt"/>
        </vertical>

        <horizontal >
            <text textColor="black" text="优先回复消息"/>
            <checkbox id="replayIsPriority" />
        </horizontal>
        <horizontal >
            <text textColor="black" text="最少回复消息条数"/>
            <input id="replayMin" width="100dp" />
        </horizontal>
        <horizontal >
            <text textColor="black" text="最多回复消息条数"/>
            <input id="replayMax" width="100dp" />
        </horizontal>

        <horizontal marginTop="20">
            <text textColor="black" text="打招呼"/>
            <checkbox id="helloIsSayHello" />
        </horizontal>
        <horizontal >
            <text textColor="black" text="最少打招呼次数"/>
            <input id="helloMin" width="100dp" />
        </horizontal>
        <horizontal >
            <text textColor="black" text="最多打招呼次数"/>
            <input id="helloMax" width="100dp" />
        </horizontal>

        <horizontal marginTop="20">
            <text textColor="black" text="刷动态"/>
            <checkbox id="dynamicIsRefresh" />
        </horizontal>
        <horizontal>
            <text textColor="black" text="动态点赞"/>
            <checkbox id="dynamicIsLike" />
        </horizontal>
        <horizontal>
            <text textColor="black" text="点赞几率"/>
            <input id="dynamicLikeChance" width="100dp" />
        </horizontal>
        <horizontal >
            <text textColor="black" text="最少刷动态时长"/>
            <input id="dynamicMin" width="100dp" />
        </horizontal>
        <horizontal >
            <text textColor="black" text="最多刷动态时长"/>
            <input id="dynamicMax" width="100dp" />
        </horizontal>

        <horizontal marginTop="20">
            <button id="auto" text="开无障碍"/>
            <button id="float" text="开悬浮窗"/>
            <button id="changeIMM" text="换输入法"/>
            <button id="start" text="启动"/>
        </horizontal>
    </vertical>
)
    ui.replayIsPriority.checked = !!store.get('replay.isPriority')
    ui.replayMin.value = store.get('replay.min')
    ui.replayMax.value = store.get('replay.max')
    ui.helloIsSayHello.checked = !!store.get('hello.isSayHello')
    ui.helloMin.value = store.get('hello.min')
    ui.helloMax.value = store.get('hello.max')
    ui.dynamicIsRefresh.checked = !!store.get('dynamic.isRefresh')
    ui.dynamicIsLike.checked = !! store.get('dynamic.isLike')
    ui.dynamicLikeChance.value = !! store.get('dynamic.likeChance')
    ui.dynamicMin.value = store.get('dynamic.min')
    ui.dynamicMax.value = store.get('dynamic.max')
ui.auto.click(function() {app.startActivity({action: "android.settings.ACCESSIBILITY_SETTINGS"})})
ui.float.click(function() {
    if (!floaty.checkPermission()) {
        floaty.requestPermission()
    }
})
ui.changeIMM.click(function() {
    var imm = context.getSystemService(context.INPUT_METHOD_SERVICE)
    imm.showInputMethodPicker()
})
ui.start.click(function() {
    new java.lang.Thread(function() {
        console.log("开始运行")
        if (!floaty.checkPermission()) {
            toast("本程序需要悬浮窗权限")
            console.log("无悬浮窗权限")
            return 
        }
        if(!requestScreenCapture()){
            toast("请求截图失败");
            exit();
        }
        console.log('权限校验完毕')
        saveConfig()
        console.log('保存配置成功')
        var runInterface = require("./run.js")
        runInterface('huanyou', __CONFIG__)
    }).start()

    
})

function saveConfig() {
    __CONFIG__.replay.isPriority = ui.replayIsPriority.checked
    store.put('replay.isPriority',  __CONFIG__.replay.isPriority ? 1 : 0)
    console.log('进度10%')
    __CONFIG__.replay.max = ui.replayMax.value
    store.put('replay.max', __CONFIG__.replay.max)
    __CONFIG__.replay.min = ui.replayMin.value
    store.put('replay.min', __CONFIG__.replay.min)
    __CONFIG__.hello.isSayHello = ui.helloIsSayHello.checked
    store.put('hello.isSayHello', __CONFIG__.replay.min ? 1 : 0)
    __CONFIG__.hello.max = ui.helloMax.value
    store.put('hello.max', __CONFIG__.hello.max)
    __CONFIG__.hello.min = ui.helloMin.value
    store.put('hello.min', __CONFIG__.hello.min)
    console.log('进度50%')
    __CONFIG__.dynamic.isLike = ui.dynamicIsLike.checked
    store.put('dynamic.isLike',  __CONFIG__.dynamic.isLike ? 1 : 0)
    __CONFIG__.dynamic.isRefresh = ui.dynamicIsRefresh.checked
    store.put('dynamic.isRefresh',  __CONFIG__.dynamic.isRefresh ? 1 : 0)
    __CONFIG__.dynamic.likeChance = ui.dynamicLikeChance.value
    store.put('dynamic.likeChance',  __CONFIG__.dynamic.likeChance)
    __CONFIG__.dynamic.max = ui.dynamicMax.value
    store.put('dynamic.max',  __CONFIG__.dynamic.max)
    __CONFIG__.dynamic.min = ui.dynamicMin.value
    store.put('dynamic.min',  __CONFIG__.dynamic.min)
    console.log('进度100%')
}

// var runInterface = require("./run.js")
// runInterface('huanyou', )