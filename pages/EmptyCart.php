<?php
session_start();
if (isset($_SESSION["username"])) {
    $loggedin = $_SESSION["username"];
} else {
    session_destroy();
    header("Location: ../index.php");
}
include('connection.php');

if ($result = $mysqli->query("update users set cart='{}', cart_size=0 where username = '$loggedin'")) {
    header("Location: ../index.php");
} else {
    echo 'Error in Emptying the cart';
}
