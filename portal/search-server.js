var fs = require('fs'),
    http = require('http'),
    url = require('url'),
    qs = require('querystring'),
    lunr = require('./portal/static/js/lunr'),
    stream = fs.createWriteStream('search-log');

var indexesPath = process.argv[2];
    indexes = { en: {}, zh: {} };

function onRequest(request, response) {
    var parsed_url = url.parse(request.url);
        path = parsed_url.pathname;

    try {
        if (path === '/search' && request.method == 'GET') {
            var items = [],
                parsedQuery = qs.parse(parsed_url.query),
                version = parsedQuery.version,
                language = parsedQuery.lang;

            // Log search terms.
            stream.write(parsedQuery.q + '\n');

            if (!indexes[language].hasOwnProperty(version)){
                var index = require([indexesPath, language, version, 'index'].join('/'));

                indexes[language][version] = {
                    index: index,
                    indexPathMap: require([indexesPath, language, version, 'toc'].join('/')),
                    idx: lunr.Index.load(index)
                };
            }

            var currentIndex = indexes[language][version];

            currentIndex.idx.search(parsedQuery.q).map((result) => {
                items.push(currentIndex.indexPathMap[result.ref]);
            });

            response.writeHead(200, {'Content-Type': 'application/json'});
            response.write(JSON.stringify({ results: items }));
            response.end();
        }

    // NOTE(Varun): At some point log/report this.
    } catch (e){}
}

http.createServer(onRequest).listen(8888);

console.log('Search server running at http://127.0.0.1:8888/');
