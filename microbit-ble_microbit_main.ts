let ope = ""
let str = ""

//let V_Ultrasonic = 0
//let D_Ultrasonic = 500
//let V_LineSensor = { L: 0, R: 0 }
let V_Button = { A: 0, B: 0 }
let V_LightLevel = 0
let V_Temperature = 0
let V_MagneticForce = { X: 0, Y: 0, Z: 0 }
let V_Acceleration = { X: 0, Y: 0, Z: 0 }
let V_Rotation = { R: 0, P: 0 }

//let R_LineSensor = 0
//let R_Ultrasonic = 0
//let R_AutoTrace = 0
let R_Microbit = 0
let R_MagneticForce = 0
let R_Acceleration = 0
let R_Rotation = 0

pins.analogWritePin(AnalogPin.P0, 0)
stop_maqueen()
bluetooth.startUartService()

bluetooth.onBluetoothConnected(function () {
    ope = "RB"
})
bluetooth.onBluetoothDisconnected(function () {
    ope = "RI"
})
bluetooth.onUartDataReceived(
    serial.delimiters(Delimiters.NewLine), function () {
        str = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))
        if (ope.length > 0) ope += ","
        ope += str
    })

function chr_str() {
    let c = str.charAt(0)
    str = str.substr(1)
    return c
}

function HEX(v: number) {
    let c = "0123456789ABCDEF"
    if (v < 0) {
        v = 0 - v
        v--
        c = "FEDCBA9876543210"
    }
    let s = c.charAt(v % 16)
    v = Math.floor(v / 16)
    s = c.charAt(v % 16) + s
    v = Math.floor(v / 16)
    s = c.charAt(v % 16) + s
    v = Math.floor(v / 16)
    s = c.charAt(v % 16) + s
    return s
}

function stop_maqueen() {
    //    R_LineSensor = 0
    //    R_Ultrasonic = 0
    //    R_AutoTrace = 0
    R_Microbit = 0
    R_MagneticForce = 0
    R_Acceleration = 0
    R_Rotation = 0
    //    maqueen.motorRun(maqueen.Motor.All, maqueen.Dir.Forward, 0)
    //    maqueen.writeLED(maqueen.LED.Left, maqueen.Switch.Off)
    //    maqueen.writeLED(maqueen.LED.Right, maqueen.Switch.Off)
    basic.showLeds(`. . . . #
					. . . # .
					# . # . .
					. # . . .
					. . . . .`)
    music.playTone(131, music.beat(BeatFraction.Sixteenth))
}

//function parse_led() {
//    let c = chr_str()
//    let v = maqueen.Switch.Off
//    if (str.charAt(0) != "0") v = maqueen.Switch.On
//    if (c == "L") {
//        maqueen.writeLED(maqueen.LED.Left, v)
//        bluetooth.uartWriteString("LL" + str)
//        return
//    }
//    if (c == "R") {
//        maqueen.writeLED(maqueen.LED.Right, v)
//        bluetooth.uartWriteString("LR" + str)
//        return
//    }
//    if (c == "B") {
//        maqueen.writeLED(maqueen.LED.Left, v)
//        maqueen.writeLED(maqueen.LED.Right, v)
//        bluetooth.uartWriteString("LB" + str)
//        return
//    }
//}

function parse_console() {
    let c = chr_str()
    if (c == "T") {
        if (str.length <= 0) {
            basic.clearScreen()
            return
        }
        basic.showString(str)
        return
    }
    if (c == "0") {
        let y = parseInt(str.charAt(0))
        let x = parseInt(str.charAt(1))
        led.unplot(x, y)
        return
    }
    if (c == "1") {
        let y = parseInt(str.charAt(0))
        let x = parseInt(str.charAt(1))
        led.plot(x, y)
        return
    }
    if (c == "M") {
        basic.clearScreen()
        let y = 0
        while (y < str.length) {
            let v = "0123456789ABCDEFGHIJKLMNOPQRSTUV".indexOf(str.charAt(y))
            if ((v & 16) != 0) led.plot(0, y)
            if ((v & 8) != 0) led.plot(1, y)
            if ((v & 4) != 0) led.plot(2, y)
            if ((v & 2) != 0) led.plot(3, y)
            if ((v & 1) != 0) led.plot(4, y)
            y++
        }
        return
    }
}

function parse_tone() {
    let c = chr_str()
    let v = parseInt(str)
    let w = music.beat(BeatFraction.Sixteenth)
    if (c == "1") w = music.beat(BeatFraction.Whole)
    else if (c == "2") w = music.beat(BeatFraction.Half)
    else if (c == "4") w = music.beat(BeatFraction.Quarter)
    else if (c == "8") w = music.beat(BeatFraction.Eighth)
    music.playTone(v, w)
}

function parse_request() {
    let c = chr_str()
    if (c == "I") {
        stop_maqueen()
        return
    }
    if (c == "B") {
        music.playTone(523, music.beat(BeatFraction.Sixteenth))
        input.setAccelerometerRange(AcceleratorRange.EightG)
        basic.showLeds(`. # . # .
							. . . . .
							# . . . #
							. # # # .
							. . . . .`)
        return
    }
    if (c == "C") {
        input.calibrateCompass()
        return
    }
    //    if (c == "S") {
    //        R_LineSensor = parseInt(str)
    //        return
    //    }
    //    if (c == "U") {
    //        R_Ultrasonic = parseInt(str)
    //        return
    //    }
    //    if (c == "A") {
    //        R_AutoTrace = parseInt(str)
    //        if (R_AutoTrace == 0) {
    //            maqueen.motorRun(maqueen.Motor.All, maqueen.Dir.Forward, 0)
    //            maqueen.writeLED(maqueen.LED.Left, maqueen.Switch.Off)
    //            maqueen.writeLED(maqueen.LED.Right, maqueen.Switch.Off)
    //            bluetooth.uartWriteString("MB0,LB0")
    //        }
    //    }
    if (c == "M") {
        R_Microbit = parseInt(str)
        return
    }
    if (c == "F") {
        R_MagneticForce = parseInt(str)
        return
    }
    if (c == "G") {
        R_Acceleration = parseInt(str)
        return
    }
    if (c == "R") {
        R_Rotation = parseInt(str)
        return
    }
}

//function parse_mortor() {
//    let c = chr_str()
//    let v = parseInt(str)
//    if (c == "L") {
//        if (v >= 0) {
//            maqueen.motorRun(maqueen.Motor.Left, maqueen.Dir.Forward, v)
//        } else {
//            maqueen.motorRun(maqueen.Motor.Left, maqueen.Dir.Backward, Math.abs(v))
//        }
//        bluetooth.uartWriteString("ML" + v)
//        return
//    }
//    if (c == "R") {
//        if (v >= 0) {
//            maqueen.motorRun(maqueen.Motor.Right, maqueen.Dir.Forward, v)
//        } else {
//            maqueen.motorRun(maqueen.Motor.Right, maqueen.Dir.Backward, Math.abs(v))
//        }
//        bluetooth.uartWriteString("MR" + v)
//        return
//    }
//    if (c == "B") {
//        if (v >= 0) {
//            maqueen.motorRun(maqueen.Motor.All, maqueen.Dir.Forward, v)
//        } else {
//            maqueen.motorRun(maqueen.Motor.All, maqueen.Dir.Backward, Math.abs(v))
//        }
//        bluetooth.uartWriteString("MB" + v)
//        return
//    }
//}

//function keepline() {
//    let cl = maqueen.readPatrol(maqueen.Patrol.Left)
//    let cr = maqueen.readPatrol(maqueen.Patrol.Right)
//    let cv = cl + cr
//    if (cv != 1) return
//    if ((V_LineSensor.L + V_LineSensor.R) != 0) return
//    let m = ""
//    if (cr == 1) {
//        maqueen.motorRun(maqueen.Motor.Left, maqueen.Dir.Forward, 0)
//        m += ",ML0"
//    } else {
//        maqueen.motorRun(maqueen.Motor.Right, maqueen.Dir.Forward, 0)
//        m += ",MR0"
//    }
//    if ((R_AutoTrace & 2) != 0) {
//        if (cr == 1) {
//            maqueen.writeLED(maqueen.LED.Right, maqueen.Switch.On)
//            m += ",LR1"
//        } else {
//            maqueen.writeLED(maqueen.LED.Left, maqueen.Switch.On)
//            m += ",LL1"
//        }
//    }
//    if (m.length > 0) {
//        bluetooth.uartWriteString(m.substr(1))
//    }
//    if ((R_AutoTrace & 4) != 0) {
//        music.playTone(131, music.beat(BeatFraction.Sixteenth))
//    }
//    while (cv != 0) {
//        cl = maqueen.readPatrol(maqueen.Patrol.Left)
//        cr = maqueen.readPatrol(maqueen.Patrol.Right)
//        cv = cl + cr
//    }
//    V_LineSensor.L = 0
//    V_LineSensor.R = 0
//    maqueen.motorRun(maqueen.Motor.All, maqueen.Dir.Forward, 0)
//    m = "MB0,SB0"
//    if ((R_AutoTrace & 2) != 0) {
//        maqueen.writeLED(maqueen.LED.Right, maqueen.Switch.Off)
//        maqueen.writeLED(maqueen.LED.Left, maqueen.Switch.Off)
//        m += ",LB0"
//    }
//    bluetooth.uartWriteString(m)
//}

function parse_ope() {
    if (ope.length <= 0) return
    let opx = ope
    ope = ""
    while (opx.length > 0) {
        let i = opx.indexOf(",")
        if (i > 0) {
            str = opx.substr(0, i)
            opx = opx.substr(i + 1)
        } else {
            str = opx
            opx = ""
        }
        let c = chr_str()
        if (c == "E") {
            bluetooth.uartWriteString(str)
            continue
        }
        //        if (c == "L") {
        //            parse_led()
        //            continue
        //        }
        //        if (c == "M") {
        //            parse_mortor()
        //            continue
        //        }
        if (c == "T") {
            parse_tone()
            continue
        }
        if (c == "R") {
            parse_request()
            continue
        }
        if (c == "C") {
            parse_console()
            continue
        }
        //        if (c == "U") {
        //            D_Ultrasonic = parseInt(str.substr(1))
        //            return
        //        }
        if (c == "G") {
            let g = str.charAt(1)
            let v = AcceleratorRange.EightG
            if (g == "1") v = AcceleratorRange.OneG
            else if (g == "2") v = AcceleratorRange.TwoG
            else if (g == "4") v = AcceleratorRange.FourG
            input.setAccelerometerRange(v)
            continue
        }
    }
}

basic.forever(function () {
    parse_ope()
    //    if (R_AutoTrace != 0) {
    //        keepline()
    //    }
    //    if ((R_LineSensor & 1) != 0) {
    //        let cl = maqueen.readPatrol(maqueen.Patrol.Left)
    //        let cr = maqueen.readPatrol(maqueen.Patrol.Right)
    //        if (V_LineSensor.L != cl) {
    //            V_LineSensor.L = cl
    //            if (V_LineSensor.L == V_LineSensor.R)
    //                bluetooth.uartWriteString("SB" + V_LineSensor.L)
    //            else bluetooth.uartWriteString("SL" + V_LineSensor.L)
    //        }
    //        if (V_LineSensor.R != cr) {
    //            V_LineSensor.R = cr
    //            if (V_LineSensor.L == V_LineSensor.R)
    //                bluetooth.uartWriteString("SB" + V_LineSensor.R)
    //            else bluetooth.uartWriteString("SR" + V_LineSensor.R)
    //        }
    //    }
    //    if (R_Ultrasonic > 0) {
    //        let v = maqueen.Ultrasonic(PingUnit.Centimeters, D_Ultrasonic)
    //        if (R_Ultrasonic > 1) {
    //            v = Math.floor(v / R_Ultrasonic) * R_Ultrasonic
    //        }
    //        if (V_Ultrasonic != v) {
    //            V_Ultrasonic = v
    //            bluetooth.uartWriteString("U-" + V_Ultrasonic)
    //        }
    //    }
    if ((R_Microbit & 1) != 0) {
        let m = ""
        let v = 0
        if (input.buttonIsPressed(Button.A)) v = 1
        if (V_Button.A != v) {
            V_Button.A = v
            m += ",BA" + V_Button.A
        }
        v = 0
        if (input.buttonIsPressed(Button.B)) v = 1
        if (V_Button.B != v) {
            V_Button.B = v
            m += ",BB" + V_Button.B
        }
        if (m.length > 0) {
            bluetooth.uartWriteString(m.substr(1))
        }
    }
    if ((R_Microbit & 2) != 0) {
        let v = input.temperature()
        if (V_Temperature != v) {
            V_Temperature = v
            bluetooth.uartWriteString("T-" + V_Temperature)
        }
    }
    if ((R_Microbit & 4) != 0) {
        let v = input.lightLevel()
        if (V_LightLevel != v) {
            V_LightLevel = v
            bluetooth.uartWriteString("V-" + V_LightLevel)
        }
    }
    if (R_MagneticForce != 0) {
        let x = input.magneticForce(Dimension.X)
        let y = input.magneticForce(Dimension.Y)
        let z = input.magneticForce(Dimension.Z)
        if (R_MagneticForce != 1) {
            x = Math.floor(x / R_MagneticForce) * R_MagneticForce
            y = Math.floor(y / R_MagneticForce) * R_MagneticForce
            z = Math.floor(z / R_MagneticForce) * R_MagneticForce
        }
        if (V_MagneticForce.X != x
            || V_MagneticForce.Y != y
            || V_MagneticForce.Z != z) {
            V_MagneticForce.X = x
            V_MagneticForce.Y = y
            V_MagneticForce.Z = z
            bluetooth.uartWriteString("F-"
                + HEX(V_MagneticForce.X)
                + HEX(V_MagneticForce.Y)
                + HEX(V_MagneticForce.Z))
        }
    }
    if (R_Acceleration != 0) {
        let x = input.acceleration(Dimension.X)
        let y = input.acceleration(Dimension.Y)
        let z = input.acceleration(Dimension.Z)
        if (R_Acceleration != 1) {
            x = Math.floor(x / R_Acceleration) * R_Acceleration
            y = Math.floor(y / R_Acceleration) * R_Acceleration
            z = Math.floor(z / R_Acceleration) * R_Acceleration
        }
        if (V_Acceleration.X != x
            || V_Acceleration.Y != y
            || V_Acceleration.Z != z) {
            V_Acceleration.X = x
            V_Acceleration.Y = y
            V_Acceleration.Z = z
            bluetooth.uartWriteString("G-"
                + HEX(V_Acceleration.X)
                + HEX(V_Acceleration.Y)
                + HEX(V_Acceleration.Z))
        }
    }
    if (R_Rotation != 0) {
        let r = input.rotation(Rotation.Roll)
        let p = input.rotation(Rotation.Pitch)
        if (R_Rotation != 1) {
            r = Math.floor(r / R_Rotation) * R_Rotation
            p = Math.floor(p / R_Rotation) * R_Rotation
        }
        if (V_Rotation.R != r || V_Rotation.P != p) {
            V_Rotation.R = r
            V_Rotation.P = p
            bluetooth.uartWriteString("R-"
                + HEX(V_Rotation.R)
                + HEX(V_Rotation.P))
        }
    }
})
