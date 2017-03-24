(function ( $ ) {

    $.fn.typehint = function( options ) {

        var cache = [];
        var self = this;
        var settings = $.extend({
            color: "#556b2f",
            backgroundColor: "white"
        }, options );

        this.keyup(function() {
            console.log('Changed value: ' + self.val());
            var q = self.val();
            hideHints();
            console.log('Cache: ' + cache);
            var cachedData = findInCache(q);
            if (cachedData != false) {
                console.log('Found in cache');
                displayData(cachedData);
            } else {
                $.ajax({
                    method: 'GET',
                    url: '/autocomplete.php',
                    data: {q: q},
                    success: function (data) {
                        console.log('Got response: ' + data);
                        if (data.length > 0) {
                            pushToCache(data[0]);
                            displayData(data);
                        }
                    }
                });
            }
        });

        function hideHints()
        {
            $('.typehint').remove();
        }

        function pushToCache(data)
        {
            cache.push(data);
        }

        function findInCache(data)
        {
            data = data.toLowerCase();
            for (var i = 0; i < cache.length; i++) {

                if (cache[i].toLowerCase().match(new RegExp(data.toLowerCase(), 'g'))) {
                    return cache[i];
                }
            }

            return false;
        }

        function displayData(data)
        {
            hideHints();
            if ($.isArray(data)) {
                var insertData = '';
                for (var i = 0; i < data.length; i++) {
                    insertData = insertData + "<div class='item'>" + data[i] + "</div>";
                }
                self.parent().append('<div class="typehint">' + insertData + '</div>');
            } else {
                self.parent().append('<div class="typehint">' + data + '</div>');
            }
        }

        return this.css({
            color: settings.color,
            backgroundColor: settings.backgroundColor
        });
    };
}( jQuery ));


$(document).ready(function() {
    $('#search').typehint();
});
