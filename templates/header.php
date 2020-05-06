<?php
session_start();
$loggedin = isset($_SESSION["username"]);
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>SMB Header</title>
    <link rel="stylesheet" href="../style/headerstyle.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.0/css/all.css">
</head>

<body>
    <div class="header">
        <a href="../index.php" class="company-logo">
            <div>
                <img src="../assets/SMB_edited.png" />
            </div>
        </a>
        <nav id="topNav" class="header-buttons topnav">
            <a href="../index.php" id="home">
                <div>Home</div>
            </a>
            <a href="../pages/Products.php" id="Products">
                <div>Products</div>
            </a>
            <a href="../pages/Aboutus.php" id="About">
                <div>About Us</div>
            </a>
            <a href="../pages/contactus.php" id="Contact-us">
                <div>Contact Us</div>
            </a>
            <?php if ($loggedin) {
            ?>
                <!-- <div class="dropdown"> -->
                <a href="./signout.php" id="Username">
                    <div><?= $_SESSION["username"] ?></div>
                </a>
                <!-- <div class="dropdown-menu" aria-labelledby="Username"> -->
                <!-- </div> -->
            <?php } else {
            ?>
                <a href="./login.html" id="Login">
                    <div>Login</div>
                </a>
            <?php } ?>

        </nav>
        <a href="javascript:void(0);" class="header-nav-button" onclick="dropNav()">
            <i class="fas fa-2x fa-bars" style="color: white;"></i>
        </a>
    </div>
    <script src="../scripts/headerScript.js"></script>
</body>

</html>