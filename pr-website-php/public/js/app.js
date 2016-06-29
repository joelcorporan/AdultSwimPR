Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

$('.header').ready(function() {
    var show = $(".header").data("show")
    console.log("SHOW: ", $(".header"))
    $(".header").children("h3").append(window.ShowDescription[show].about.title);
    $(".about").children("p").append(window.ShowDescription[show].about.description)
});

$('#contacts').ready(function() {
    var show = $("#contacts").data("show")

    for(var i = window.ShowDescription[show].contacts.ATL.length - 1; i >= 0; i--) {
        $('#atl').children("h3").after('<p>'+ window.ShowDescription[show].contacts.ATL[i].name +'</p> '+
                                       '<h5> <a href="mailto:'+ window.ShowDescription[show].contacts.ATL[i].email +'"> '+ window.ShowDescription[show].contacts.ATL[i].email +' </a> </h5> '+
                                       '<p> '+ window.ShowDescription[show].contacts.ATL[i].phone +'</p> <br>')
    }

    for(var i = window.ShowDescription[show].contacts.LA.length - 1; i >= 0; i--) {
        $('#la').children("h3").after('<p>'+ window.ShowDescription[show].contacts.LA[i].name +'</p> '+
                                       '<h5> <a href="mailto:'+ window.ShowDescription[show].contacts.LA[i].email +'"> '+ window.ShowDescription[show].contacts.LA[i].email +' </a> </h5> '+
                                       '<p> '+ window.ShowDescription[show].contacts.LA[i].phone +'</p> <br>')
    }
});

$(document).ready(function() {
    // Listen to clicks on the thumbnails to start video playback
    $(document).on('click','.thumb-container', function(e){
        var assetid = $(this).children("img").data('assetid');
        $("#jumbo-img").addClass("inactive");
        $("#videostage").addClass("active");
        $("#videostagectrl").addClass("active");
        loadFile(assetid);
    })

    $("#videostagectrl").on("click", function(){
        $(this).removeClass('active');
  
        $("video").each(function(){
            this.pause(); // can't hurt
            $(this).remove(); // this is probably what actually does the trick
        });

        $("#videostage").removeClass("active");
        $("#jumbo-img").removeClass("inactive");

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

        if(Hls.isSupported()) {
            console.log("HLS is Supported");

            var video
            if(!document.getElementById('video')) {
                video = document.createElement('video');
                $("#videoplayer").append(video);
            }
            else {
                video = document.getElementById('video');
            }

            video.height = 540;
            video.controls = "controls";
            var hls = new Hls();

            hls.loadSource(videoURL);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED,function() {
                video.play();
            });
        }
        else {
            console.log("HLS is not Supported");
        }
        /*var obj,source;

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
        $(obj).append(source);*/

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