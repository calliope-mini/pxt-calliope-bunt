enum Sensitivity {
    //% blockIdentity=calliopeBunt.sensitivity
    //% block="16496 Lux - 40ms"
    S16 = 0b000,
    //% blockIdentity=calliopeBunt.sensitivity
    //% block="8248 Lux - 80ms"
    S8 = 0b001,
    //% blockIdentity=calliopeBunt.sensitivity
    //% block="4124 Lux - 160ms"
    S4 = 0b010,
    //% blockIdentity=calliopeBunt.sensitivity
    //% block="2062 Lux - 320ms"
    S2 = 0b011,
    //% blockIdentity=calliopeBunt.sensitivity
    //% block="1031 Lux - 640ms"
    S1 = 0b100,
    //% blockIdentity=calliopeBunt.sensitivity
    //% block="515 Lux - 1280ms"
    S0 = 0b101,
}

/**
 * Read data from an Calliope mini RGB sensor.
 */
//% color=#A80000
namespace sensors {
    const ADDRESS = 0x10;
    let colorSensitivity = Sensitivity.S4;

    /**
     * Converts the sensitivity name to a number.
     */
    //% blockId=sensitivity_id block="%c" shim=TD_ID
    export function sensitivity(c: Sensitivity): number {
        return c;
    }

    /**
     * Set sensivity for the Calliope mini RGB sensor.
     */
    //% blockId=calliopeBunt_sensitivity block="set light sensitivity to %sensitivity=sensitivity_id"
    //% parts="calliope-bunt"
    //% trackArgs=0
    export function calliopeBuntSetSensitivity(sensitivity: number): void{
        colorSensitivity = sensitivity > Sensitivity.S0 ? Sensitivity.S0 : sensitivity;
    }

    /**
     * Get RGBW values from Calliope mini RGB sensor.
     */
    //% blockId=calliopeBunt_rgb block="read light color"
    //% parts="calliope-bunt"
    //% trackArgs=0
    export function calliopeBuntColor(): number {
        // enable the sensor, writing to the register
        pins.i2cWriteNumber(ADDRESS, (0x00 << 8) | (colorSensitivity << 4), NumberFormat.UInt16BE);

        // red
        pins.i2cWriteNumber(ADDRESS, 0x08, NumberFormat.Int8LE, true);
        let red = pins.map(pins.i2cReadNumber(ADDRESS, NumberFormat.UInt16LE), 0, 65535, 0, 255);

        // green
        pins.i2cWriteNumber(ADDRESS, 0x09, NumberFormat.Int8LE, true);
        let green = pins.map(pins.i2cReadNumber(ADDRESS, NumberFormat.UInt16LE), 0, 65535, 0, 255);

        // blue
        pins.i2cWriteNumber(ADDRESS, 0x0A, NumberFormat.Int8LE, true);
        let blue = pins.map(pins.i2cReadNumber(ADDRESS, NumberFormat.UInt16LE), 0, 65535, 0, 255);

        // white
        pins.i2cWriteNumber(ADDRESS, 0x0B, NumberFormat.Int8LE, true);
        let white = pins.map(pins.i2cReadNumber(ADDRESS, NumberFormat.UInt16LE), 0, 65535, 0, 255);

        // -- enable for debugging
        // serial.writeString("RGB[");
        // serial.writeNumber(red);
        // serial.writeString(",");
        // serial.writeNumber(green);
        // serial.writeString(",");
        // serial.writeNumber(blue);
        // serial.writeString("](");
        // serial.writeNumber(white);
        // serial.writeString(")\r\n");

        // shift colors down (only need the high byte)
        return basic.rgbw(red, green, blue, white);
    }


}
