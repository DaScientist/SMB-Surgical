<?php
session_start();
$loggedin = isset($_SESSION["username"]);
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact SMB Surgicals</title>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.0/css/all.css">
    <!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"> -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">

    <link rel="stylesheet" href="../style/headerstyle.css">
    <link rel="stylesheet" href="../style/footerstyle.css">
    <link rel="stylesheet" href="../style/contactus.css">
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
                <div><i class="fas fa-home"></i>Home</div>
            </a>
            <a href="../pages/Products.php" id="Products">
                <div><i class="fas fa-list"></i>Products</div>
            </a>
            <a href="../pages/Aboutus.php" id="About">
                <div><i class="fas fa-address-card"></i>About Us</div>
            </a>
            <a href="../pages/contactus.php" id="Contact-us">
                <div><i class="fas fa-address-book"></i>Contact Us</div>
            </a>
            <?php if ($loggedin) {
            ?>
                <!-- <div class="dropdown"> -->
                <a href="#" id="Username">
                    <div><i class="fas fa-user"></i><?= $_SESSION["username"] ?></div>
                </a>
                <a href="../pages/cart.php" id="cart">
                    <div><i class="fas fa-shopping-cart"></i>
                        <div>Cart</div>
                    </div>
                </a>
                <a href="../pages/signout.php" id="logout">
                    <div><i class="fas fa-sign-out-alt"></i>
                        <div>Logout</div>
                    </div>
                </a>
                <!-- <div class="dropdown-menu" aria-labelledby="Username"> -->
                <!-- </div> -->
            <?php } else {
            ?>
                <a href="./login.html" id="Login">
                    <div><i class="fas fa-sign-in-alt"></i>Login</div>
                </a>
            <?php } ?>

        </nav>
        <a href="javascript:void(0);" class="header-nav-button" onclick="dropNav()">
            <i class="fas fa-2x fa-bars" style="color: white;"></i>
        </a>
    </div>
    <div class="main">
        <h1 class="title">Contact us</h1>
        <!-- <div class="container" id="ff-compose"></div>
        <script async defer
            src="https://formfacade.com/include/104228328212503156379/form/1FAIpQLSdTiXuavIcMsr1VGPKpSZ3qkv5li4137FrkC2QLKQ08yaTXKw/bootstrap.js?div=ff-compose"></script> -->

        <div id="ff-compose"></div>
    </div>
    <div class="jumbotron">
        <div class="container">
            <div class="row">
                <div class="col-md-4 col-sm-12">
                    <div class="row col-sm-12">
                        <img class="footer-logo" src="../assets/SMB_edited_with_tagline.png" alt="Logo">
                    </div>
                    <div class="row social justify-content-center">
                        <!-- handler -->
                        <a href="#"><i class="fab fa-facebook"></i></a>
                        <a href="#"><i class="fab fa-twitter"></i></a>
                        <a href="#"><i class="fab fa-google-plus-g"></i></a>
                        <a href="#"><i class="fab fa-instagram"></i></a>
                        <a href="#"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>
                <div class="col-md-4 col-sm-12 text-center">
                    <!-- Address -->
                    <h5>18, Vama Square,</h5>
                    <h5>Ayurvedic Tran Rasta,</h5>
                    <h5>Outside Panigate,</h5>
                    <h5>Vadodara, Gujarat,</h5>
                    <h5>India - 390019</h5>
                </div>
                <div class="col-md-4 col-sm-12">
                    <!-- Address -->
                    <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14765.648864170133!2d73.220786!3d22.3002448!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xda68269a0a304015!2sSMB%20Surgical!5e0!3m2!1sen!2sin!4v1587057482377!5m2!1sen!2sin" width="350" height="200" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>
                </div>
            </div>
            <div class="row justify-content-center">
                © Copyright 2020 - SMB Surgical
            </div>
        </div>
    </div>
    <script src="../scripts/headerScript.js"></script>
    <script src="../scripts/classic.js?div=ff-compose"></script>

</body>

</html>