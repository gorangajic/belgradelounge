
var fs = require('fs')
  , config = JSON.parse(fs.readFileSync('./config.json'))
  , token = config.token
  , graph = require('fbgraph')
  , _ = require('underscore')
  , cache
  ;

  console.log(token);


graph.setAccessToken(token);

// http://stackoverflow.com/questions/18268233/get-youtube-video-id-from-link-with-javascript
var matchYoutubeUrl = function(url){
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return (url.match(p)) ? RegExp.$1 : false ;
};

// export yotuube link fetcher
module.exports = function(callback) {
    var min = 1000 * 60;
    if (cache && cache.time + min > +new Date) {
        callback(cache.links);
        return;
    }
    // Belgrade Lounge group id fetching 100 posts
    graph.get('245858279883/feed?limit=100', function(req, res) {
        var links = [];
        console.log(res);
        _.each(res.data, function(post) {
            if (!post.link) {
                return ;
            }
            var id = matchYoutubeUrl(post.link);
            if (id) {
                links.push({
                    id: id,
                    name: post.name,
                    by: post.from.name
                });
            }
        });
        cache = {
            links: links,
            time: +new Date()
        };
        callback(links);
    });
}