lib_mbituart.setupAudio()
lib_mbitlink.start()
lib_mbituart.start()
basic.forever(function () {
    lib_mbitlink.dispatch()
})
