export const DRONE_DIAGNOSTICS = {
  title: "DRONE DIAGNOSTICS: TOTAL BLACKOUT",
  warning: "Remove all propellers immediately before attempting any bench diagnostics.",
  isolationTest: {
    label: "USB Isolation Test",
    steps: [
      "Disconnect the LiPo / main battery.",
      "Plug the Flight Controller (FC) directly into a computer via USB.",
      "If FC LEDs turn on: MCU and 3.3V logic rail are intact. Failure is in main battery or 5V BEC.",
      "If FC LEDs stay off: 3.3V regulator, protective diode, or MCU itself is fried."
    ]
  },
  powerSubsystem: [
    { cause: "Dead/Deep-Discharged Battery", fix: "Check total voltage. Replace if under 3.0V/cell." },
    { cause: "Smart Battery Sleep", fix: "Wake up by connecting to AC charger for 30-60 mins." },
    { cause: "Broken Battery Connector", fix: "Reflow solder joints; replace corroded XT60/XT30." },
    { cause: "Failed 5V / 9V BEC", fix: "Measure voltage between 5V pad and GND. Replace PDB/FC if 0V." }
  ],
  hardwareFailures: [
    { cause: "Short Circuit on 5V Rail", fix: "Isolate peripheral modules (VTX, GPS, Cam) one by one." },
    { cause: "Carbon Fiber Frame Short", fix: "Locate pinched wires touching carbon edges; insulate frame." },
    { cause: "Catastrophic MCU Failure", fix: "Replace the flight controller board." }
  ]
};
