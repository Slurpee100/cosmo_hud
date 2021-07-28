$(document).ready(function () {
  HealthIndicator = new ProgressBar.Circle("#HealthIndicator", {
    color: "rgb(0, 182, 91)",
    trailColor: "green",
    strokeWidth: 12,
    trailWidth: 12,
    duration: 250,
    easing: "easeInOut",
  });

  ArmorIndicator = new ProgressBar.Circle("#ArmorIndicator", {
    color: "rgb(201, 36, 36)",
    trailColor: "rgb(124, 30, 30)",
    strokeWidth: 12,
    trailWidth: 12,
    duration: 250,
    easing: "easeInOut",
  });

  HungerIndicator = new ProgressBar.Circle("#HungerIndicator", {
    color: "rgb(255, 164, 59)",
    trailColor: "rgb(165, 116, 60)",
    strokeWidth: 12,
    trailWidth: 12,
    duration: 250,
    easing: "easeInOut",
  });

  ThirstIndicator = new ProgressBar.Circle("#ThirstIndicator", {
    color: "rgb(0, 140, 255)",
    trailColor: "rgb(0, 85, 155)",
    strokeWidth: 12,
    trailWidth: 12,
    duration: 250,
    easing: "easeInOut",
  });

  StressIndicator = new ProgressBar.Circle("#StressIndicator", {
    color: "rgb(255, 74, 104)",
    trailColor: "rgb(102, 27, 40)",
    strokeWidth: 12,
    trailWidth: 12,
    duration: 250,
    easing: "easeInOut",
  });

  OxygenIndicator = new ProgressBar.Circle("#OxygenIndicator", {
    color: "rgb(0, 140, 255)",
    trailColor: "rgb(0, 85, 155)",
    strokeWidth: 12,
    trailWidth: 12,
    duration: 250,
    easing: "easeInOut",
  });

  Speedometer = new ProgressBar.Circle("#SpeedCircle", {
    color: "rgba(70, 104, 135, 1)",
    trailColor: "#404b58",
    strokeWidth: 12,
    duration: 100,
    trailWidth: 12,
    easing: "easeInOut",
  });

  FuelIndicator = new ProgressBar.Circle("#FuelCircle", { 
    color: "rgba(70, 104, 135, 1)",
    trailColor: "#404b58",
    strokeWidth: 12,
    duration: 2000,
    trailWidth: 12,
    easing: "easeInOut",
  });

  NitrousIndicator = new ProgressBar.Circle("#NitrousCircle", { 
    color: "rgba(70, 104, 135, 1)",
    trailColor: "#404b58",
    strokeWidth: 12,
    duration: 2000,
    trailWidth: 12,
    easing: "easeInOut",
  });

  VoiceIndicator = new ProgressBar.Circle("#VoiceIndicator", {
    color: "#4a4a4a",
    trailColor: "#4a4a4a",
    strokeWidth: 12,
    trailWidth: 12,
    duration: 250,
    easing: "easeInOut",
  });
  VoiceIndicator.animate(0.66);
});

window.addEventListener("message", function (event) {
  let data = event.data;

  if (data.action == "update_hud") {
    HealthIndicator.animate(data.hp / 100);
    ArmorIndicator.animate(data.armor / 100);
    HungerIndicator.animate(data.hunger / 100);
    ThirstIndicator.animate(data.thirst / 100);
    StressIndicator.animate(data.stress / 100);
    OxygenIndicator.animate(data.oxygen / 100);
  }

  // Get current voice level and animate path
  if (data.action == "voice_level") {
    switch (data.voicelevel) {
      case 1.0:
        data.voicelevel = 33;
        break;
      case 2.3:
        data.voicelevel = 66;
        break;
      case 5.0:
        data.voicelevel = 100;
        break;
      default:
        data.voicelevel = 33;
        break;
    }
    VoiceIndicator.animate(data.voicelevel / 100);
  }

  // Light up path if talking
  if (data.talking == 1) {
    VoiceIndicator.path.setAttribute("stroke", "yellow");
  } else if (data.talking == false) {
    VoiceIndicator.path.setAttribute("stroke", "white");
  }

  // Headset icon if using radio
  if (data.radio == true) {
    $("#VoiceIcon").removeClass("fa-microphone");
    $("#VoiceIcon").addClass("fa-headset");
  } else if (data.radio == false) {
    $("#VoiceIcon").removeClass("fa-headset");
    $("#VoiceIcon").addClass("fa-microphone");
  }

  // Hide stress if disabled
  if (data.action == "disable_stress") {
    $("#StressIndicator").hide();
  }

  // Hide voice if disabled
  if (data.action == "disable_voice") {
    $("#VoiceIndicator").hide();
  }

  // Show oxygen if underwater
  if (data.showOxygen == true) {
    $("#OxygenIndicator").show();
  } else if (data.showOxygen == false) {
    $("#OxygenIndicator").hide();
  }

  // Hide armor if 0
  if (data.oxygen >= 75) {
    $("#OxygenIndicator").fadeOut();
  } else if (data.oxygen < 75) {
    $("#OxygenIndicator").fadeIn();
  }

  if (data.hunger == 100) {
    $("#HungerIndicator").fadeOut();
  } else if (data.hunger < 100) {
    $("#HungerIndicator").fadeIn();
  }

  if (data.thirst == 100) {
    $("#ThirstIndicator").fadeOut();
  } else if (data.thirst < 100) {
    $("#ThirstIndicator").fadeIn();
  }

  if (data.hp >= 90) {
    $("#HealthIndicator").fadeOut();
  } else if (data.hp < 90) {
    $("#HealthIndicator").fadeIn();
  }

  if (data.armor == 0) {
    $("#ArmorIndicator").fadeOut();
  } else if (data.armor > 0) {
    $("#ArmorIndicator").fadeIn();
  }

  if (data.stress == 0) {
    $("#StressIndicator").fadeOut();
  } else if (data.stress > 0) {
    $("#StressIndicator").fadeIn();
  }

  // Change color and icon if HP is 0 (dead)
  if (data.hp < 0) {
    HealthIndicator.animate(0);
    HealthIndicator.trail.setAttribute("stroke", "red");
    $("#hp-icon").removeClass("fa-heart");
    $("#hp-icon").addClass("fa-skull");
  } else if (data.hp < 25) {
    HealthIndicator.trail.setAttribute("stroke", "red");
    $("#hp-icon").toggleClass("flash");
  } else if (data.hp > 25) {
    HealthIndicator.trail.setAttribute("stroke", "green");
    $("#hp-icon").removeClass("fa-skull");
    $("#hp-icon").addClass("fa-heart");
  }

  // Flash if thirst is low
  if (data.thirst < 25) {
    $("#ThirstIcon").toggleClass("flash");
  }
  // Flash if hunger is low
  if (data.hunger < 25) {
    $("#HungerIcon").toggleClass("flash");
  }

  if (data.rpm > 0) {
    $("#SpeedIndicator").text(data.speed);
    let SpeedoLimit = data.maxspeed;
    var rpm = data.rpm;

    if (rpm > SpeedoLimit) {
      rpm = SpeedoLimit;
    }

    Speedometer.animate(rpm / SpeedoLimit);
      Speedometer.path.setAttribute("stroke", "white");
    if (data.rpm > 95) {
      Speedometer.path.setAttribute("stroke", "red");
    } else if (data.rpm > 85) {
      Speedometer.path.setAttribute("stroke", "yellow");
    } else if (data.rpm == 0) {
      $("#SpeedIndicator").text("0");
      Speedometer.path.setAttribute("stroke", "none");
    }
  }


  if (data.action == "update_fuel") {
    let fuel = data.fuel;
    if (fuel > 97) {
      FuelIndicator.animate(100 / 100);
    } else if (fuel < 97) {
      FuelIndicator.animate(fuel / 100);
    }
    if (fuel < 17) {
      FuelIndicator.path.setAttribute("stroke", "red");
    } else if (fuel > 17) {
      FuelIndicator.path.setAttribute("stroke", "white");
    }
  }

  if (data.action == "update_nitrous") {
    if (data.nitrous > 0) {
      $("#NitrousCircle").fadeIn();
      NitrousIndicator.animate(data.nitrous / 100);
    }
    else {
      $("#NitrousCircle").fadeOut();
      NitrousIndicator.animate(0);
    } if (data.nitrous < 20) {
      NitrousIndicator.path.setAttribute("stroke", "red");
    } else {
      NitrousIndicator.path.setAttribute("stroke", "white");
    }
  }

  if (data.showSpeedo == true) {
    $("#VehicleContainer").fadeIn();
  } else if (data.showSpeedo == false) {
    $("#VehicleContainer").fadeOut();
  }

  if (data.showFuel == true) {
    $("#FuelCircle").show();
  } else if (data.showFuel == false) {
    $("#FuelCircle").hide();
  }

  if (data.showNitrous == true) {
    $("#NitrousCircle").show();
  } else if (data.showNitrous == false) {
    $("#NitrousCircle").hide();
  }

  if (data.showUi == true) {
    $(".container").show();
  } else if (data.showUi == false) {
    $(".container").hide();
  }

  if (data.action == "toggle_hud") {
    $("body").fadeToggle()
  }
});
