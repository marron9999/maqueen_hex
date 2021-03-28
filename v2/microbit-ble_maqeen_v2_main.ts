lib_maqueen.setupAudio()
lib_mbitlink.start()
lib_mbituart.start()
lib_maqueen.start()
basic.forever(function () {
    lib_mbitlink.dispatch()
})
