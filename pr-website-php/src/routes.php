<?php


// Check if the the hostname and sessionkey cookies are set and the user is logged in
function isLoggedIn() {
    if(isset($_COOKIE['token'])){
        return true;
    }
    return false;
};

// Routes

// Login Page
$app->get('/login', function ($request, $response, $args) {
    return $this->view->render($response, 'login.html', []);
});

$app->post('/login', function ($request, $response, $args) {

    $parsedBody = $request->getParsedBody();
    $api = new ApiClass;

    $username = $parsedBody["username"];
    $password = $parsedBody["password"];

    if(strlen($username) == 0){
        return $this->view->render($response, '/', []);
    }

    $session = $api->login($username,$password);

    if(isset($session->statusCode)) {
        return $this->view->render($response, '/', []);
    }

    if($session == null) {
        return $this->view->render($response, "login.html", []);
    } else {

        if(isset($session->id)){
            setcookie('token', $session->id, time()+900000, '/');
            return $response->withStatus(303)->withHeader('Location', '/');
        } else {
            return $this->view->render($response, "login.html", []);
        }
    }

});


// Logout

$app->get('/logout', function ($request, $response, $args) {

    $api = new ApiClass;

    // Get the config variables
    $sessiontoken = $_COOKIE['token'];

    // Logout
    $logout = json_decode($api->logout($sessiontoken));
    
    if($logout != null) {
        setcookie('token', "", time() - 3600, '/');
        return $this->view->render($response, 'login.html', []);
    }
});

// Browse Projects / Main Screen
$app->get('/[{shows}]', function($request, $response, $args) {
    if(!isLoggedIn()) {
        return $response->withStatus(301)->withHeader('Location', '/login');
    }

    $api = new ApiClass;

    // Get the config variables
    $sessiontoken = $_COOKIE['token'];

    // Get the user detail
    $user = json_decode($api->getUserInfo($sessiontoken));

    if(!isset($user->id)){
        return $this->view->render($response, "login.html", []);
    }

    // Get all projects
    $projects = json_decode($api->getUserProjects($sessiontoken));

    return $this->view->render($response, 'shows.html', [
        'projects' => $projects,
        'user' => $user
    ]);

});

// Browse Projects / Main Screen
$app->get('/shows/[{projectName}]', function($request, $response, $args) {
    if(!isLoggedIn()) {
        return $response->withStatus(301)->withHeader('Location', '/login');
    }

    $api = new ApiClass;

    // Get the config variables
    $sessiontoken = $_COOKIE['token'];

    // Get the user detail
    $user = json_decode($api->getUserInfo($sessiontoken));

    if(!isset($user->id)){
        return $this->view->render($response, "login.html", []);
    }

    // Get all projects
    $assets = json_decode($api->getUserAssetsByName($sessiontoken, $args['projectName']));

    return $this->view->render($response, '/home.html', [
        'assets' => $assets,
        'user' => $user,
        'show' => $args['projectName']
    ]);

});

// Browse Projects / Main Screen
/*$app->get('/[{projectid}]', function ($request, $response, $args) {


    if(!isLoggedIn()) {
        return $response->withStatus(301)->withHeader('Location', '/login');
    }

    $api = new ApiClass;

    // Get the config variables
    $sessiontoken = $_COOKIE['token'];

    // Get the user detail
    $user = json_decode($api->getUserInfo($sessiontoken));

    if(!isset($user->id)){
        return $this->view->render($response, "login.html", []);
    }


    // Get all projects
    $projects = json_decode($api->getUserProjects($sessiontoken));

    // If a specific project was selected, use that project id
    if (isset($args['projectid'])) {
        $projectid = $args['projectid'];
    } else {
        $projectid = $projects[0]->id;
    };


    // Get assets for the project
    $assets = json_decode($api->getAssets($projectid,$sessiontoken));

    return $this->view->render($response, 'home.html', [
        'projects' => $projects,
        'assets' => $assets,
        'projectid' => $projectid,
        'user' => $user
    ]);


});*/

// Get the detail of a specific asset
$app->get('/asset/{assetid}', function ($request, $response, $args) {

    if(!isLoggedIn()) {
        return $response->withStatus(301)->withHeader('Location', '/login');
    }

    $api = new ApiClass;

    // Get the config variables
    $hostname = $this->get('settings')['ms_settings']['hostname'];
    $sessionkey = $_COOKIE['SESSIONKEY'];
    $assetid = $args['assetid'];

    // Get assets for the project
    $asset = $api->getAsset($hostname, $assetid,$sessionkey);

    // Return as JSON
    $response->withAddedHeader('Content-Type', 'application/json');
    $response->write($asset);

});

