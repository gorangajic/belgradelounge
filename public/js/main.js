
var videoIndex = 0;

var removeId = function(id) {
    if (!localStorage) {
        return;
    }
    list = loadList();
    list.push(id);
    localStorage.setItem('deleted', JSON.stringify(list));
};


var loadList = function() {
    var list = localStorage.getItem('deleted');
    if (!list) {
        return [];
    }
    return JSON.parse(list);
}

var removed = loadList();
var nextVideo = function() {
    var $items = $('.list-group-item');
    if (videoIndex >= $items.length) {
        videoIndex = 0;
    }
    $items.removeClass('active');
    var videoId = $items.eq(videoIndex).addClass('active').attr('id');
    player.loadVideoById(videoId);
    player.playVideo();

    videoIndex++;
};
$('.list-group-item').each(function() {
    var id = $(this).attr('id');
    if(removed.indexOf(id) != -1) {
        $(this).remove();
    }
});

$('.list-group-item').on('click', function() {
    videoIndex = $(this).index();
    nextVideo();
}).find('.badge').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    var $el = $(this).parent();
    var id = $el.attr('id');
    removeId(id);
    $el.remove();
});

// load javascriptApi
var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";

var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '330',
        width: '540',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    nextVideo();
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        nextVideo();
    }
}
function stopVideo() {
    player.stopVideo();
}


