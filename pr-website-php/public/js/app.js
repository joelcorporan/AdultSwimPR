
$(document).ready(function() {

    // Player Key
    //jwplayer.key = "d6gsi297N6N7krcFM23KX4G7XqOJJHfHfo7L/g==";

    // Listen to clicks on the thumbnails to start video playback
    $(document).on('click','.thumb-container', function(e){
        var assetid = $(this).children("img").data('assetid');
        $("#videostage").addClass("active");
        $("#videostagectrl").addClass("active");
        //var playerInstance = videojs("html5Player");
        //playerInstance.show();
        loadFile(assetid);
    })

    $("#videostagectrl").on("click", function(){
        $(this).removeClass('active');
        
        var playerInstance = videojs("html5Player");
        playerInstance.hide();        
        //var playerInstance = jwplayer("videoplayer");
        //playerInstance.remove();
        $("#videostage").removeClass("active");

    });

    function getToken(name) {
      var value = "; " + document.cookie;
      var parts = value.split("; " + name + "=");
      if (parts.length == 2) return parts.pop().split(";").shift();
    }

    // Load an asset by specific ID
    function loadFile(assetid) {
        var token = getToken("token")
        var headerToken = {"token": token};

        $.ajax({
            "async": true,
            "crossDomain": true,
            "url": "http://localhost:3000/getAssetRequest?id=" + assetid,
            "method": "GET",
            "headers": headerToken,
            success: function(result){
                playFile(result);
            }
        });
    }

    function playFile(url){

        var videoURL = "http://localhost:3000/proxy.m3u8?id=" + url;
        var obj,source;

        obj = document.createElement('video');
        $(obj).attr('id', 'example_video_test');
        $(obj).attr('class', 'video-js vjs-default-skin');
        $(obj).attr('width', '960');
        $(obj).attr('data-height', '540');
        $(obj).attr('controls', ' ');
        $(obj).attr('preload', 'auto');
        $(obj).attr('data-setup', '{}');

        source = document.createElement('source');
        $(source).attr('type', 'application/x-mpegURL');
        $(source).attr('src', videoURL);

        $("#videoplayer").append(obj);
        $(obj).append(source);

       /* var player = videojs('html5Player', {
            controls: true,
            autoplay: false,
            width: 960,
            height: 540,
            preload: "off"
        });

        var videoURL = "http://localhost:3000/proxy.m3u8?id=" + url;
         $("source").attr("src", videoURL);*/

/*
        var playerInstance = jwplayer("videoplayer");
        playerInstance.setup({
            primary: "html5",
            width: 960,
            height: 540,
            autostart: false,
            skin: "bekle",
            file: videoURL
        });

        playerInstance.on('error', function(e) {
            console.log(e);
            showError();
        });*/
    }
})