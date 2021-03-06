<?php
session_start();
$loggedin = isset($_SESSION["username"]);
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <!--Let browser know website is optimized for mobile-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SMB Surgicals</title>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.0/css/all.css">
    <!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"> -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <!--Import Google Icon Font-->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <!-- Compiled and minified CSS -->
    <!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"> -->
    <!-- custom css -->
    <link rel="stylesheet" href="style/headerstyle.css">
    <link rel="stylesheet" href="style/footerstyle.css">
    <link rel="stylesheet" href="style/stylesheet.css">
</head>

<body id="body" style="background-color:aqua">
    <div class="header">
        <a href="./index.php" class="company-logo">
            <div>
                <img src="./assets/SMB_edited.png" />
            </div>
        </a>
        <nav id="topNav" class="header-buttons topnav">
            <a href="./index.php" id="home">
                <div><i class="fas fa-home"></i>Home</div>
            </a>
            <a href="./pages/Products.php" id="Products">
                <div><i class="fas fa-list"></i>Products</div>
            </a>
            <a href="./pages/Aboutus.php" id="About">
                <div><i class="fas fa-address-card"></i>About Us</div>
            </a>
            <a href="./pages/contactus.php" id="Contact-us">
                <div><i class="fas fa-address-book"></i>Contact Us</div>
            </a>
            <?php if ($loggedin) {
            ?>
                <!-- <div class="dropdown"> -->
                <a href="#" id="Username">
                    <div><i class="fas fa-user"></i><?= $_SESSION["username"] ?></div>
                </a>
                <a href="./pages/cart.php" id="cart">
                    <div><i class="fas fa-shopping-cart"></i>
                        <div>Cart</div>
                    </div>
                </a>
                <a href="./pages/signout.php" id="logout">
                    <div><i class="fas fa-sign-out-alt"></i>
                        <div>Logout</div>
                    </div>
                </a>
                <!-- <div class="dropdown-menu" aria-labelledby="Username"> -->
                <!-- </div> -->
            <?php } else {
            ?>
                <a href="./pages/login.html" id="Login">
                    <div><i class="fas fa-sign-in-alt"></i>Login</div>
                </a>
            <?php } ?>

        </nav>
        <a href="javascript:void(0);" class="header-nav-button" onclick="dropNav()">
            <i class="fas fa-2x fa-bars" style="color: white;"></i>
        </a>
    </div>
    <div class="main">
        <div class="carousel-container-custom container">
            <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
                <ol class="carousel-indicators">
                    <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="3"></li>
                </ol>
                <div class="carousel-inner">
                    <div class="carousel-item active">
                        <img src="assets/home_carousel/422222.jpg" class="d-block w-100 h-100 carousel-image-custom" alt="...">
                        <div class="carousel-caption d-none d-md-block caption-carousel-1">
                            <h3>From masks to all necessary surgical
                                equipments,
                                Look up our catalog for the products we deal
                            </h3><br>
                            <a href="pages/Products.php" class="carousel-button-1">Products</a>
                        </div>
                    </div>
                    <div class="carousel-item">
                        <img src="assets/home_carousel/677515.jpg" class="d-block w-100 h-100 carousel-image-custom" alt="...">
                        <div class="carousel-caption d-none d-md-block caption-carousel-2">
                            <h3>Contact us to do business for your hospital</h3><br>
                            <a href="pages/contactus.php" class="carousel-button-2">Contact Us</a>
                        </div>
                    </div>
                    <!-- <div class="carousel-item">
                        <img src="assets/home_carousel/16907.jpg" class="d-block w-100" alt="...">
                    </div> -->
                    <div class="carousel-item">
                        <img src="assets/home_carousel/front-page-22_1920x1080.jpg" class="d-block w-100 h-100 carousel-image-custom" alt="...">
                        <div class="carousel-caption d-none d-md-block caption-carousel-3">
                            <a href="pages/Products.php" class="carousel-button-3">Products</a><br><br>
                            <h3>We also deal with rehabilitation aids to wheelchairs and such equipments! Browse our
                                catalog for more info
                            </h3>
                        </div>
                    </div>
                    <div class="carousel-item">
                        <img src="assets/home_carousel/about_us.jpg" class="d-block w-100 h-100 carousel-image-custom" alt="...">
                        <div class="carousel-caption d-none d-md-block caption-carousel-4">
                            <h1>Know more about us!</h1><br>
                            <a href="pages/Aboutus.php" class="carousel-button-4">About Us</a>
                        </div>
                    </div>

                </div>
                <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="sr-only">Previous</span>
                </a>
                <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="sr-only">Next</span>
                </a>
            </div>
        </div>
        <div class="custom-container custom-1">
            <div class="container">
                <div class="row" style="margin: 0;padding: 20px 0;">
                    <div class="col-md-6 col-sm-12">
                        <div id="carouselIndicators" class="carousel w-80 slide" data-ride="carousel">
                            <ol class="carousel-indicators">
                                <li data-target="#carouselIndicators" data-slide-to="0" class="active"></li>
                                <li data-target="#carouselIndicators" data-slide-to="1"></li>
                                <li data-target="#carouselIndicators" data-slide-to="2"></li>
                            </ol>
                            <div class="carousel-inner">
                                <div id="slide-one" class="carousel-item text-center active">
                                    <img src="./assets/catalog/1050-960_eFlexx-front-small-300x274.png" class="d-block h-100" alt="...">
                                </div>
                                <div id="slide-two" class="carousel-item text-center">
                                    <img src="./assets/catalog/km-1520.3-1-1050x960-300x274.png" class="d-block h-100" alt="...">
                                </div>
                                <div id="slide-three" class="carousel-item text-center">
                                    <img src="./assets/catalog/WK300-1050x960-300x274.png" class="d-block h-100" alt="...">
                                </div>
                            </div>
                            <a class="carousel-control-prev" href="#carouselIndicators" role="button" data-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="sr-only">Previous</span>
                            </a>
                            <a class="carousel-control-next" href="#carouselIndicators" role="button" data-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="sr-only">Next</span>
                            </a>
                        </div>
                    </div>
                    <div class="col-md-6 col-sm-12">
                        <div class="row justify-content-center text-center">
                            <h3 class="small-carousel-title"></h3>
                        </div>
                        <div class="row text-center">
                            <p class="small-carousel-description"></p>
                        </div>
                        <div class="row justify-content-center text-center"><a href="#" class="btn bg-primary small-carousel-link"></a></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="custom-container custom-2">
            <div class="container">
                <div class="row">
                    <div class="col-md-12 text-center">
                        <h2>Authorized dealers of:</h2>
                    </div>
                </div>
                <div class="row dealer-list">
                    <div class="col">
                        <img id="tynor-logo" src="./assets/authorized distributor companies/Tynor-Logo.png" alt="Tynor">
                    </div>
                    <div class="col">
                        <img id="karma-logo" src="./assets/authorized distributor companies/Karma-Logo.png" alt="Karma">
                    </div>
                    <div class="col">
                        <img id="satnam-logo" src="./assets/authorized distributor companies/satnam-logo.png" alt="Satnam">
                    </div>
                    <div class="col">
                        <img id="denis-logo" src="./assets/authorized distributor companies/denis-logo.png" alt="Denis">
                    </div>
                    <div class="col">
                        <img id="skk-logo" src="./assets/authorized distributor companies/shri-krishna-keshav-logo.gif" alt="Shri Krishna Keshav">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="jumbotron">
        <div class="container">
            <div class="row">
                <div class="col-md-4 col-sm-12">
                    <div class="row col-sm-12 justify-content-center">
                        <img class="footer-logo" src="assets/SMB_edited_with_tagline.png" alt="Logo">
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
                <div class="col-md-4 col-sm-12 text-center">
                    <!-- Address -->
                    <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14765.648864170133!2d73.220786!3d22.3002448!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xda68269a0a304015!2sSMB%20Surgical!5e0!3m2!1sen!2sin!4v1587057482377!5m2!1sen!2sin" width="250" height="150" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>
                </div>
            </div>
            <div class="row justify-content-center">
                © Copyright 2020 - SMB Surgical
            </div>
        </div>
    </div>

    <!-- scripts are ahead -->
    <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
    <script>
        function myFunction() {
            var x = document.getElementById("topNav");
            if (x.className === "topnav") {
                x.className += " responsive";
            } else {
                x.className = "topnav";
            }
        }
        let small_carousel_data = [{
                title: "eFlexx",
                description: "The eFlexx (EFL) is a foldable power wheelchair that can fit into the trunk of a sedan. This power chair is ideal for users who live in an area where wheelchair accessible transportation is not readily available. The battery is in compliance with UN38.3 regulation, which makes it the perfect power chair for travel overseas.",
                button: "eFlexx",
                link: "#eFlexx"
            },
            {
                title: "KM-2500",
                description: "Weighing 10.9kg, the KM-2500 is an ideal choice for people with slim build or for people dealing with tight spaces and narrow doorways. It features a foldable backrest and swingaway footplates. Made of aluminum alloy, it is ultralight and compact making it easy to store and transport.",
                button: "KM-2500",
                link: "#KM-2500"
            },
            {
                title: "WK-80",
                description: "Karma lightweight aluminum folding walker features the eye-catching appearance and two-in-one fixed and reciprocal functions. Our walker series have a wide variety of choices for every individual’s need.",
                button: "WK-80",
                link: "#WK-80"
            }
        ]
        $(document).ready(function() {
            document.querySelector('.small-carousel-title').textContent = small_carousel_data[0].title;
            document.querySelector('.small-carousel-description').textContent = small_carousel_data[0].description;
            document.querySelector('.small-carousel-link').textContent = small_carousel_data[0].button;
            document.querySelector('.small-carousel-link').href = small_carousel_data[0].link;

            $('#carouselIndicators').on('slide.bs.carousel', (evt) => {
                // let carouselContent = document.querySelector('#show-data-small-carousel');
                let index = $(this).find('.active');
                // console.log('Smal carousel index = ');
                console.log(evt.to);
                // carouselContent.write('<p class="small-carousel-title">' + small_carousel_data[index].title + '</p>' +
                //     '<p class="small-carousel-description">' + small_carousel_data[index].description + '</p>' +
                //     '<a href="' + small_carousel_data[index].link + '" class="btn"></a>")');
                document.querySelector('.small-carousel-title').textContent = small_carousel_data[evt.to].title;
                document.querySelector('.small-carousel-description').textContent = small_carousel_data[evt.to].description;
                document.querySelector('.small-carousel-link').textContent = small_carousel_data[evt.to].button;
                document.querySelector('.small-carousel-link').href = small_carousel_data[evt.to].link;
            });
        })
    </script>
    <script src="./scripts/script.js"></script>
    <script src="./scripts/headerScript.js"></script>
    <!-- Compiled and minified JavaScript -->
    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script> -->
</body>

</html>