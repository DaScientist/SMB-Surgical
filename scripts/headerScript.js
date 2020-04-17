function dropNav() {
  var x = document.getElementById("topNav");
  if (x.className === "header-buttons topnav") {
    x.className += " responsive";
  } else {
    x.className = "header-buttons topnav";
  }
}
