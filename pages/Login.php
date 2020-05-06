<?php
$email = $_POST["email"];
$pass = $_POST["pass"];

$mysqli = new mysqli("localhost", "root", "", "smb");

if ($result = $mysqli->query("select * from users where email = '$email' and pass = '$pass'")) {
    session_start();
    $row = $result->fetch_assoc();
    $_SESSION["username"] = $row["username"];
    header("Location: ../index.php");
} else {
    if (isset($_SERVER['HTTP_REFERER'])) {
        header("Location: " . $_SERVER['HTTP_REFERER']);
    }
}
