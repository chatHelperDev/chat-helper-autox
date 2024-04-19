function showControlWindow() {
    var w = floaty.rawWindow(
        <frame gravity="center">
            <button text="退出" id="s" />
        </frame>
    );
    w.setSize(-2, -2)
    w.setPosition(device.width * 0.7, 30)
    w.s.click(function () {
        threads.shutDownAll()
        exit()
    })
}
function showLogWindow() {
    console.show(true)
    console.setPosition(10,10)
    console.setSize(device.width * 0.5,400)
}
function run(platform, config) {
    console.log("打开悬浮窗")
    showControlWindow()
    showLogWindow()
    console.log(platform, config, "./platform/" + platform + '.js')
    var p = require('./platform/huanyou.js')

    console.log(p)
    var wapperRun = function () {
        try {
            app.launchApp("欢友")
            sleep(3000)
            console.log("平台启动")
            console.setSize(device.width * 0.5,400)
            p.start(config)
        }catch(e) {
            if (e.name === "JavaException") {
                toast(e.message)
                throw e
            }
            console.log(e)
            wapperRun()
        }
    }
    wapperRun()
}

module.exports = function (platform, config) {
    auto.waitFor()
    // console.log('新线程开启')
    run(platform, config)
    // let th = threads.start(function () {
        
    // })
}