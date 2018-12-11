<?php

include 'functions.php';

if (!empty($_POST))
{
    $_POST  = multiDimensionalArrayMap('cleanEvilTags', $_POST);
    $_POST  = multiDimensionalArrayMap('cleanData', $_POST);

    //your email adress 
    //$emailTo ="andresmunozcovarrubias@gmail.com"; //"yourmail@yoursite.com";
    $emailTo ="rodrigo.soto.calderon@gmail.com"; //"yourmail@yoursite.com";
    
    //from email adress
    $emailFrom ="test@nutrijuice.cl"; //"contact@yoursite.com";

    //email subject
    $emailSubject = "Formulario de contacto";

    $name = $_POST["name"];
    $city = $_POST["city"];
    $email = $_POST["email"];
    $phone = $_POST["phone"];
    $comment = $_POST["comment"];
    
    $message = "Nombre: $name<br>
    Ciudad: $city<br>
    Email: $email<br>
    Fono: $phone<br>
    Comentario: $comment";
    
    try {
      
      $headers = "MIME-Version: 1.0" . "\r\n"; 
      $headers .= "Content-type:text/html; charset=utf-8" . "\r\n"; 
      $headers .= "From: <$emailFrom>" . "\r\n";
      mail($emailTo, $emailSubject, $message, $headers);

      $data['status'] = true;
     
    } catch (Exception $e) {
      $data['status'] = false;
    }
    
    //header('Content-type: application/json');
    echo json_encode($data);
}