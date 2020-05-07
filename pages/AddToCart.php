<?php
session_start();

include('connection.php');


$username = $_SESSION["username"];
$category = $_POST["input-category"];
$pid = $_POST["input-pid"];

echo 'Category:' . $category . ' and pid:' . $pid . '<br>';

$result = $mysqli->query("select * from users where username = '$username'");
if ($result = $mysqli->query("select * from users where username = '$username'")) {
    $row = $result->fetch_assoc();
    // var_dump($row);
    $prod_list = json_decode($row["cart"], true);
    // $prod_list["demo2"] = "Demo3";
    // var_dump($prod_list);
    $last_index = -1;
    foreach ($prod_list as $key => $value) {
        // echo $key . " => " . var_dump($value) . "<br>";
        // foreach ($value as $key1 => $value1) {
        //     echo $key1 . " => " . $value1 . "<br>";
        // }
        $last_index = $key;
    }
    $new_item = array("category" => $category, "pid" => $pid);
    array_push($prod_list, $new_item);
    $cart_field = json_encode($prod_list);
    var_dump($cart_field);
    if ($update_result = $mysqli->query("update users set cart = '$cart_field' where username = '$username'")) {
        echo 'Database updated';
        header("Location: ./Products.php");
    }
}

// var_dump($result);
