girder.exposePluginConfig('google_analytics', 'plugins/google_analytics/config');
girder.events.on('g:appload.after', function () {

    // We ignore this block of code as it is the standard Google Analytics
    // snippet.
    /* global ga */
    /* jshint ignore:start */
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    /* jshint ignore:end */

    girder.restRequest({
        type: 'GET',
        path: 'system/setting',
        data: {
            list: JSON.stringify(['google_analytics.tracking_id'])
        }
    }).done(_.bind(function (resp) {
        ga('create', resp['google_analytics.tracking_id'], 'none');
    }, this));
});
