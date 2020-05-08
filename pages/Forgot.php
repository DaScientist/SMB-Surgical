<?php
session_start();

include('connection.php');

$Username = $_POST["username"];
$email = $_POST["email"];

$sql = "select * from users where username='$Username' and email='$email'";
if ($result = $mysqli->query($sql)) {
    echo 'Password is :';
    $row = $result->fetch_assoc();
    echo $row["pass"] . '<br><br><br>';
    echo '<a href="../index.php">Continue</a>';
}

// var_dump($result);
