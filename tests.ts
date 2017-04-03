sensors.calliopeBuntSetSensitivity(Sensitivity.S0);
// read color
basic.forever(() => {
    let color = sensors.calliopeBuntColor();
    basic.setLedColor(color);
});
