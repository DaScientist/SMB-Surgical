<?php
session_start();
$loggedin = isset($_SESSION["username"]);
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About SMB Surgicals</title>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.0/css/all.css">
    <!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"> -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">

    <link rel="stylesheet" href="../style/headerstyle.css">
    <link rel="stylesheet" href="../style/footerstyle.css">
    <link rel="stylesheet" href="../style/aboutus.css">
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
            <a href="./Products.php" id="Products">
                <div>Products</div>
            </a>
            <a href="./Aboutus.php" id="About" class="active">
                <div>About Us</div>
            </a>
            <a href="./contactus.php" id="Contact-us">
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
    <div class="main">
        <div class="content">
            <div class="container justify-content-center">
                <div class="row">
                    <h3 class="section-title">
                        Developers:
                    </h3>
                </div>
                <div class="row justify-content-center">
                    <div class="card bg-light mb-3 card-vertical" style="width: 24rem;">
                        <div class="card-header">
                            Developer + Engineer
                        </div>
                        <img src="../assets/Mutanseer_only_face.jpg" alt="Mustanseer Sakerwala" class="card-img-top">
                        <div class="card-body">
                            <h4 class="card-title">Mustanseer Sakerwala</h4>
                            <h5 class="card-subtitle mb-2 text-muted">170410107097</h5>
                            <p class="card-text">Love to explore different domains and obtain the power of computation
                            </p>
                            <small class="text-muted">
                                It is better to be a warrior in a garden than a gardener in a war.>
                            </small><br><br>
                            <div class="card-social justify-content-center text-center">
                                <!-- handler -->
                                <a href="#"><i class="fab fa-2x fa-twitter"></i></a>
                                <a href="#"><i class="fab fa-2x fa-google-plus-g"></i></a>
                                <a href="#"><i class="fab fa-2x fa-instagram"></i></a>
                                <a href="#"><i class="fab fa-2x fa-github"></i></a>
                                <a href="#"><i class="fab fa-2x fa-linkedin"></i></a>
                                <a href="#"><i class="fab fa-2x fa-quora"></i></a>
                            </div>
                        </div>
                        <div class="card-footer">
                            Your friendly neighbourhood engineer
                        </div>
                    </div>
                    <div class="card mb-3 bg-light card-horizontal">
                        <div class="card-header">
                            Developer + Engineer
                        </div>
                        <div class="row no-gutters">
                            <div class="col-md-4">
                                <img src="../assets/Mutanseer_only_face.jpg" alt="Mustanseer Sakerwala" class="card-img">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h4 class="card-title">Mustanseer Sakerwala</h4>
                                    <h5 class="card-subtitle mb-2 text-muted">170410107097</h5>
                                    <p class="card-text">Love to explore different domains and obtain the power of
                                        computation
                                    </p>
                                    <small class="text-muted">
                                        It is better to be a warrior in a garden than a gardener in a war.
                                    </small><br><br>
                                    <div class="card-social justify-content-center text-center">
                                        <!-- handler -->
                                        <a href="#"><i class="fab fa-2x fa-twitter"></i></a>
                                        <a href="#"><i class="fab fa-2x fa-google-plus-g"></i></a>
                                        <a href="#"><i class="fab fa-2x fa-instagram"></i></a>
                                        <a href="#"><i class="fab fa-2x fa-github"></i></a>
                                        <a href="#"><i class="fab fa-2x fa-linkedin"></i></a>
                                        <a href="#"><i class="fab fa-2x fa-quora"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer">
                            Your friendly neighbourhood engineer
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="jumbotron">
        <div class="container">
            <div class="row">
                <div class="col-md-4 col-sm-12">
                    <div class="row col-sm-12 justify-content-center text-center">
                        <img class="footer-logo" src="../assets/SMB_edited_with_tagline.png" alt="Logo">
                    </div>
                    <div class="row social justify-content-center text-center">
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
                <div class="col-md-4 col-sm-12 justify-content-center text-center">
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
</body>

</html>