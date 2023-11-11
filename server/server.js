import http from 'node:http';

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.end(JSON.stringify([
    {
      "serviceUrl": "http://sedac.ciesin.columbia.edu/geoserver/wms",
      "layers": [
        {
          "layerName": "Probabilities of Urban Expansion to 2030",
          "layerId": "lulc:lulc-global-grid-prob-urban-expansion-2030"
        },
        {
          "layerName": "Population Density – 2015",
          "layerId": "gpw-v4:gpw-v4-population-density_2015"
        }
      ]
    }
  ]));
});

server.listen(4000, () => {
  console.log('server running on http://localhost:4000')
})
