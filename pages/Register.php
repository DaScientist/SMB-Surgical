<?php
session_start();

include('connection.php');

$Username = $_POST["username"];
$email = $_POST["email"];
$pass = $_POST["pass"];

$sql = "insert into users(username,email,pass,cart,cart_size) values ('$Username','$email','$pass','{}',0);";
if ($result = $mysqli->query($sql)) {
    echo 'User created. Kindly login with entered credentials<br><br>';
    echo '<a href="../index.php">Continue</a>';
}
