<?php
$toAddress = 'info@eriksaulnier.com';
$fromAddress = 'contact@eriksaulnier.com';
$subject = 'New Contact Form Submission';

if (isset($_POST['g-recaptcha-response'])) {
    $captcha = $_POST['g-recaptcha-response'];

    // Valdate Captcha
    $options = array('http' =>
        array(
            'method'  => 'POST',
            'header'  => 'Content-type: application/x-www-form-urlencoded',
            'content' => http_build_query(
                array(
                    'secret'   => '6Lehpj4UAAAAACJSnVYY3KvdGDpsw-MmkL-RjoFf',
                    'response' => $captcha,
                    'remoteip' => $_SERVER['REMOTE_ADDR']
                )
            )
        )
    );
    $context = stream_context_create($options);
    $isValid  = json_decode(file_get_contents('https://www.google.com/recaptcha/api/siteverify', false, $context));

    // If Captcha is valid attempt to send email
    if ($isValid) {
        $name = $_POST['name'];
        $email = $_POST['email'];
        $message = $_POST['message'];

        // Prepend the name and email to the message
        $message = "Name: $name\r\nEmail: $email\r\n\r\n$message";

        // Attempt to send email
        try {
            mail($toAddress, $subject, $message, "From: $fromAddress\r\nReply-to: $email");
            var_dump(http_response_code(200));
        } catch(Exception $e) {
            var_dump(http_response_code(500));
        }
    } else {
        var_dump(http_response_code(403));
    }
}
