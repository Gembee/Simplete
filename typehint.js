(function ( $ ) {

    $.fn.typehint = function( options ) {

        var cache = [];
        var self = this;
        var queryLength = 0;
        var settings = $.extend({
            color: "#556b2f",
            backgroundColor: "white",
            showResults: 10,
            minChar: 1
        }, options );

        $(document).keyup(function(e) {
            if (e.keyCode === 13) {
                //enter
                hideHints();
            }
            if (e.keyCode === 27) {
                //esc
                hideHints();
            }
        });

        $(document).click(function() {
            hideHints();
        });

        this.click(function(e) {
            populateAutocomplete();
            e.stopPropagation();
        });

        this.keyup(function() {
            populateAutocomplete();
        });

        function hideHints()
        {
            $('.typehint').remove();
        }

        function populateAutocomplete()
        {
            console.log('Changed value: ' + self.val());
            var q = self.val();
            var lastQueryLength = queryLength;
            queryLength = q.length;
            if (q.length < settings.minChar) {
                hideHints();
                return false;
            }
            console.log('Cache: ' + cache);
            var cachedData = findInCache(q);
            if (cachedData != false && (queryLength > lastQueryLength  || cachedData.length > 2 )) {
                console.log('Found in cache');
                displayData(cachedData);
            } else {
                displaySearching();
                $.ajax({
                    method: 'GET',
                    url: 'autocomplete.php',
                    data: {q: q},
                    success: function (data) {
                        console.log('Got response: ' + data);
                        if (data.length > 0) {
                            pushToCache(data);
                            displayData(data);
                        } else {
                            displayNothingFound();
                        }
                    }
                });
            }
        }

        function pushToCache(data)
        {
            for (var j = 0; j < data.length; j++) {
                var push = true;
                for (var i = 0; i < cache.length; i++) {
                    if (data[j].toLowerCase() == cache[i].toLowerCase()) {
                        push = false;
                    }
                }
                if (push) {
                    cache.push(data[j]);
                }
            }
        }

        function findInCache(data)
        {
            var tags = [];
            for (var i = 0; i < cache.length; i++) {

                if (cache[i].toLowerCase().match(new RegExp(data.toLowerCase() + '.*', 'i'))) {
                    var re = new RegExp(data, "ig") ;
                    var t = cache[i].replace(re,"<span style='font-weight:bold;color:Blue;'>" +
                        data + "</span>");

                    tags.push(t);
                }
                if (tags.length >= settings.showResults) {
                    return tags;
                }
            }

            if (tags.length > 0) {
                return tags;
            } else {
                return false;
            }
        }

        function displayData(data)
        {
            hideHints();
            if ($.isArray(data)) {
                var insertData = '';
                for (var i = 0; i < data.length; i++) {
                    insertData = insertData + "<li class='item'>" + data[i] + "</li>";
                }
                self.parent().append('<div class="typehint"><ul>' + insertData + '</ul></div>');
            } else {
                self.parent().append('<div class="typehint"><ul><li class="item">' + data + '</li></ul></div>');
            }
            $('.typehint').children().children('.item').click(function() {
                self.val($(this).text());
                self.focus();
            });
        }

        function displayNothingFound()
        {
            hideHints();
            self.parent().append('<div class="typehint"><ul style="padding-left: 8px;">No results...</ul></div>');
        }

        function displaySearching()
        {
            hideHints();
            self.parent().append('<div class="typehint"><ul style="padding-left: 8px;">Searching...</ul></div>');
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
