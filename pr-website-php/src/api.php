<?php

class ApiClass {

    function login($username,$password){

        $apiurl = "http://localhost:3000/userSession";

        $fields = array(
            'username' => $username,
            'password' => $password,
        );

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,$apiurl);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, Array("Content-Type: application/json"));
        curl_setopt($ch, CURLOPT_POST, 1 );
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
        $result=curl_exec($ch);
        curl_close ($ch);

        $resp = json_decode($result);

        return $resp;
    }

    function logout($sessiontoken) {

        $apiurl = "http://localhost:3000/endUserSession";

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,$apiurl);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, Array("token: " . $sessiontoken));
        $result=curl_exec($ch);
        curl_close ($ch);
        return $result;
    }

    function getUserInfo($sessiontoken){
        $apiurl = "http://localhost:3000/getInfo";
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,$apiurl);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, Array("token: " . $sessiontoken));
        $result=curl_exec($ch);
        curl_close ($ch);
        return $result;
    }


    function getUserProjects($sessiontoken){

        $apiurl = "http://localhost:3000/getProjects";


        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,$apiurl);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, Array("token: " . $sessiontoken));
        $result=curl_exec($ch);
        curl_close ($ch);

        return $result;
    }

    function getAssets($projectid,$sessiontoken){

        $apiurl = "http://localhost:3000/getAssets?id=$projectid";

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,$apiurl);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
        curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($ch, CURLOPT_HTTPHEADER, Array("token: " . $sessiontoken));
        $result=curl_exec($ch);
        curl_close ($ch);
        
        return $result;
    }

    function getAsset($hostname,$assetid,$sessionkey){

        $apiurl = "https://api.mediasilo.com/v3/assets/".$assetid;


        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,$apiurl);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, Array("MediaSiloHostContext: " . $hostname, "MediaSiloSessionKey: " . $sessionkey));
        $result=curl_exec($ch);
        curl_close ($ch);

        return $result;
    }
}

?>
