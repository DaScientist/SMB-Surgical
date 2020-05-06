<?php
session_start();
$loggedin = isset($_SESSION["username"]);
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Catalogue</title>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.0/css/all.css">
    <!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"> -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">

    <link rel="stylesheet" href="../style/headerstyle.css">
    <link rel="stylesheet" href="../style/footerstyle.css">
    <link rel="stylesheet" href="../style/products.css">
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
            <a href="./Products.php" id="Products" class="active">
                <div>Products</div>
            </a>
            <a href="./Aboutus.php" id="About">
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
        <!-- <div class="jumbotron section-ortho">
            <div class="row c-title">
                <div class="col-sm-10">
                    <h2>Orthopaedic Items</h2>
                </div>
            </div>
        </div> -->

        <div class="jumbotron section-rehab">
            <div class="container">
                <div class="row c-title">
                    <div class="col-sm-10">
                        <h2>Rehabilitation Items</h2>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <nav>
                            <div class="nav nav-tabs" id="nav-rehab-tab" role="tablist">
                                <a class="nav-item nav-link active" id="nav-rehab-wheelchair-tab" data-toggle="tab" href="#nav-rehab-wheelchair" role="tab" aria-controls="nav-rehab-wheelchair" aria-selected="true"><img src="https://img.icons8.com/emoji/48/000000/manual-wheelchair.png" /><span>WheelChair</span></a>
                                <a class="nav-item nav-link" id="nav-rehab-walker-tab" data-toggle="tab" href="#nav-rehab-walker" role="tab" aria-controls="nav-rehab-walker" aria-selected="false"><img src="https://img.icons8.com/dusk/64/000000/walker.png" /><span>
                                        Walker</span></a>
                                <a class="nav-item nav-link" id="nav-rehab-walking-stick-tab" data-toggle="tab" href="#nav-rehab-walking-stick" role="tab" aria-controls="nav-rehab-walking-stick" aria-selected="false"><img src="https://img.icons8.com/color/48/000000/walking-stick.png" /><span>Walking
                                        Stick</span></a>
                                <a class="nav-item nav-link" id="nav-rehab-commode-tab" data-toggle="tab" href="#nav-rehab-commode" role="tab" aria-controls="nav-rehab-commode" aria-selected="false"><img src="https://img.icons8.com/dusk/64/000000/toilet-bowl.png" /><span>Commode
                                        Tools</span></a>
                                <a class="nav-item nav-link" id="nav-rehab-bed-tab" data-toggle="tab" href="#nav-rehab-bed" role="tab" aria-controls="nav-rehab-bed" aria-selected="false"><img src="https://img.icons8.com/cotton/64/000000/bed--v1.png" /><span>Rehabilitation
                                        Bed</span></a>
                                <a class="nav-item nav-link" id="nav-rehab-healthcare-tab" data-toggle="tab" href="#nav-rehab-healthcare" role="tab" aria-controls="nav-rehab-healthcare" aria-selected="false"><img src="https://img.icons8.com/dusk/64/000000/survival-bag.png" /><span>Healthcare
                                        Devices</span></a>
                            </div>
                        </nav>
                        <div class="tab-content" id="nav-tabContent">
                            <div class="tab-pane fade show active" id="nav-rehab-wheelchair" role="tabpanel" aria-labelledby="nav-rehab-wheelchair-tab">
                                <div class="container">
                                    <div class="row">
                                        <div class="card-group">

                                            <!-- design of product card -->
                                            <!-- <div class="col-md-4 col-sm-12 text-center justify-content-center"
                                                id="nav-rehab-wheelchair-cards">
                                                <div class="card bg-light mb-3 justify-content-center text-center"
                                                data-toggle="modal" data-target="#rehabModal">
                                                <img src="../assets/Mutanseer_only_face.jpg" alt="Mustanseer Sakerwala"
                                                class="card-img-top">
                                                <div class="card-body">
                                                    <h4 class="card-title">wheelchair</h4>
                                                    <h5 class="card-subtitle text-muted">Product code</h5>
                                                </div>
                                           </div>
                                        </div> -->
                                            <!-- end of design of product card -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="nav-rehab-walker" role="tabpanel" aria-labelledby="nav-rehab-walker-tab">
                                <div class="container">
                                    <div class="row">
                                        <div class="card-group">

                                            <!-- design of product card -->
                                            <!-- <div class="col-md-4 col-sm-12 text-center justify-content-center"
                                                                                    id="nav-rehab-wheelchair-cards">
                                                                                    <div class="card bg-light mb-3 justify-content-center text-center"
                                                                                    data-toggle="modal" data-target="#rehabModal">
                                                                                    <img src="../assets/Mutanseer_only_face.jpg" alt="Mustanseer Sakerwala"
                                                                                    class="card-img-top">
                                                                                    <div class="card-body">
                                                                                        <h4 class="card-title">wheelchair</h4>
                                                                                        <h5 class="card-subtitle text-muted">Product code</h5>
                                                                                    </div>
                                                                               </div>
                                                                            </div> -->
                                            <!-- end of design of product card -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="nav-rehab-walking-stick" role="tabpanel" aria-labelledby="nav-rehab-walking-stick-tab">
                                <div class="container">
                                    <div class="row">
                                        <div class="card-group">

                                            <!-- design of product card -->
                                            <!-- <div class="col-md-4 col-sm-12 text-center justify-content-center"
                                                                                    id="nav-rehab-wheelchair-cards">
                                                                                    <div class="card bg-light mb-3 justify-content-center text-center"
                                                                                    data-toggle="modal" data-target="#rehabModal">
                                                                                    <img src="../assets/Mutanseer_only_face.jpg" alt="Mustanseer Sakerwala"
                                                                                    class="card-img-top">
                                                                                    <div class="card-body">
                                                                                        <h4 class="card-title">wheelchair</h4>
                                                                                        <h5 class="card-subtitle text-muted">Product code</h5>
                                                                                    </div>
                                                                               </div>
                                                                            </div> -->
                                            <!-- end of design of product card -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="nav-rehab-commode" role="tabpanel" aria-labelledby="nav-rehab-commode-tab">
                                <div class="container">
                                    <div class="row">
                                        <div class="card-group">

                                            <!-- design of product card -->
                                            <!-- <div class="col-md-4 col-sm-12 text-center justify-content-center"
                                                                                    id="nav-rehab-wheelchair-cards">
                                                                                    <div class="card bg-light mb-3 justify-content-center text-center"
                                                                                    data-toggle="modal" data-target="#rehabModal">
                                                                                    <img src="../assets/Mutanseer_only_face.jpg" alt="Mustanseer Sakerwala"
                                                                                    class="card-img-top">
                                                                                    <div class="card-body">
                                                                                        <h4 class="card-title">wheelchair</h4>
                                                                                        <h5 class="card-subtitle text-muted">Product code</h5>
                                                                                    </div>
                                                                               </div>
                                                                            </div> -->
                                            <!-- end of design of product card -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="nav-rehab-bed" role="tabpanel" aria-labelledby="nav-rehab-bed-tab">
                                <div class="container">
                                    <div class="row">
                                        <div class="card-group">

                                            <!-- design of product card -->
                                            <!-- <div class="col-md-4 col-sm-12 text-center justify-content-center"
                                                                                    id="nav-rehab-wheelchair-cards">
                                                                                    <div class="card bg-light mb-3 justify-content-center text-center"
                                                                                    data-toggle="modal" data-target="#rehabModal">
                                                                                    <img src="../assets/Mutanseer_only_face.jpg" alt="Mustanseer Sakerwala"
                                                                                    class="card-img-top">
                                                                                    <div class="card-body">
                                                                                        <h4 class="card-title">wheelchair</h4>
                                                                                        <h5 class="card-subtitle text-muted">Product code</h5>
                                                                                    </div>
                                                                               </div>
                                                                            </div> -->
                                            <!-- end of design of product card -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="nav-rehab-healthcare" role="tabpanel" aria-labelledby="nav-rehab-healthcare-tab">
                                <div class="container">
                                    <div class="row">
                                        <div class="card-group">

                                            <!-- design of product card -->
                                            <!-- <div class="col-md-4 col-sm-12 text-center justify-content-center"
                                                                                    id="nav-rehab-wheelchair-cards">
                                                                                    <div class="card bg-light mb-3 justify-content-center text-center"
                                                                                    data-toggle="modal" data-target="#rehabModal">
                                                                                    <img src="../assets/Mutanseer_only_face.jpg" alt="Mustanseer Sakerwala"
                                                                                    class="card-img-top">
                                                                                    <div class="card-body">
                                                                                        <h4 class="card-title">wheelchair</h4>
                                                                                        <h5 class="card-subtitle text-muted">Product code</h5>
                                                                                    </div>
                                                                               </div>
                                                                            </div> -->
                                            <!-- end of design of product card -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal fade" id="rehabModal" tabindex="-1" role="dialog" aria-labelledby="rehabModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-xl" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="rehabModalLabel">Category name</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                        <div class="container">
                                            <div class="row">
                                                <div class="col-md-4">
                                                    <img src="../assets/Mutanseer_only_face.jpg" alt="Mustanseer Sakerwala" id="" class="card-img">
                                                </div>
                                                <div class="col-md-8" id="modal-content-pointer">
                                                    <h2>Product Name</h2>
                                                    <h3>Product Code</h3>
                                                    <p class="card-text">Description</p>
                                                    <ul>
                                                        <li><b>Feature 1: </b>value</li>
                                                        <li><b>Feature 2: </b>value</li>
                                                        <li><b>Feature 3: </b>value</li>
                                                        <li><b>Feature 4: </b>value</li>
                                                    </ul>
                                                    <h5>Compnay:</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="jumbotron section-surgical">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <nav>
                            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                                <a class="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home"
                                    role="tab" aria-controls="nav-home" aria-selected="true">Home</a>
                                <a class="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-profile"
                                    role="tab" aria-controls="nav-profile" aria-selected="false">Profile</a>
                                <a class="nav-item nav-link" id="nav-contact-tab" data-toggle="tab" href="#nav-contact"
                                    role="tab" aria-controls="nav-contact" aria-selected="false">Contact</a>
                            </div>
                        </nav>
                        <div class="tab-content" id="nav-tabContent">
                            <div class="tab-pane fade show active" id="nav-home" role="tabpanel"
                                aria-labelledby="nav-home-tab">
                                ..dg.</div>
                            <div class="tab-pane fade" id="nav-profile" role="tabpanel"
                                aria-labelledby="nav-profile-tab">
                                ..sdfsasdfsf.</div>
                            <div class="tab-pane fade" id="nav-contact" role="tabpanel"
                                aria-labelledby="nav-contact-tab">
                                ..qwerwerweqr.</div>
                        </div>

                    </div>
                </div>
            </div>
        </div> -->
    </div>
    <div class="jumbotron footer">
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
    <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
    <script src="../scripts/headerScript.js"></script>

    <script src="../scripts/products.js"></script>
</body>

</html>