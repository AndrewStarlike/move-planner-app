
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    var street = $("#street").val();
    var city = $("#city").val();
    var address = street + ',' + city;

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    $body.append('<img class="bgimg" src="http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + address + '">');

    // YOUR CODE GOES HERE!
    // NY Times API call
    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?q=' + street + '&sort=newest&' + $.param({
        'api-key': "e98cba2283d949b884ba223ebaf4d50b"
    });
    $.ajax({
        url: url,
        method: 'GET'
    }).done(function(result) {
        $nytElem.append('<ul id="nytimes-articles" class="article-list"></ul>');
        $.each(result.response.docs, function (index, value) {
            $nytElem.find("ul").append(
                '<li class="article">' +
                '<a href="' + value.web_url + '">' + value.headline.main + '</a>' +
                '<p>' + value.snippet + '</p>'
            );
        });
    }).fail(function(err) {
        $nytHeaderElem.text('Unable to load New York Times articles');
    });

    // set timeout to 8 seconds (JSONP limitation, doesn't have error handling - the method fail)
    var wikiRequestTimeout = setTimeout(function () {
        $wikiElem.text("failed to get Wikipedia resources");
    }, 8000);

    // Wikipedia API call
    $.ajax({
        url: "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=einstein&format=json",
        method: "GET",
        dataType: "JSONP"
    }).done(function(result) {
        $.each(result.query.search, function (index, value) {
            var link = "https://www.google.ro/search?q=" + address + " wikipedia";
            $wikiElem.append("<li><a href='" + link + "'>" + value.title + "</a>");
        });
        // JSONP limitation, doesn't have error handling - the method fail
        clearTimeout(wikiRequestTimeout);
    }).fail(function(err) {
        $wikiElem.text('Unable to load Wikipedia articles');
    });

    return false;
}

$('#form-container').submit(loadData);
