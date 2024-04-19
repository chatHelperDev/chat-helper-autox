"ui";
ui.layout(
    <vertical>
        <vertical h="*" w="*">
            <webview id="web" layout_below="title" w="*" h="*" />
        </vertical>
    </vertical>
);

ui.web.loadUrl("file://" + files.path("./ui/index.html"))

let config = {
    speed: 1,
    vTick: ''
}

ui.web.jsBridge.registerHandler("run", (data, callabck) => {
    console.log('执行run')
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
        var runInterface = require("./run.js")
        runInterface('huanyou', JSON.parse(data))
    }).start()
    callabck('suc')
})

ui.web.jsBridge.registerHandler("changeImm", (data, callabck) => {
    console.log("切换输入法")
    try {
        importClass(android.view.inputmethod.InputMethodManager)
        var imm = context.getSystemService(context.INPUT_METHOD_SERVICE)
        imm.showInputMethodPicker()
    }catch(e) {
        console.log('e' )
    }
})

ui.web.jsBridge.registerHandler("requestPermission", (data, callabck) => {
    if (data === 'floaty' ) {
        console.log("打开悬浮窗")
        if (!floaty.checkPermission()) {
            floaty.requestPermission();
        }
    }
    
    if (data === 'auto') {
        app.startActivity({action: "android.settings.ACCESSIBILITY_SETTINGS"})
    }
})