$(function(){

  var map = L.map('mapdiv', {
    minZoom: 6,
    maxZoom: 18
  });

  // 迅速測図
  var oldLayer = L.tileLayer(
    'http://www.finds.jp/ws/tmc/1.0.0/Kanto_Rapid-900913-L/{z}/{x}/{y}.png', {
       maxNativeZoom: 17,
       opacity: 0.9,
       attribution: '<a href="http://www.finds.jp/wsdocs/hawms/index.html" target="_blank">歴史的農業環境WMS配信サービス</a>'
  });

  // 地理院地図
  var newLayer = L.tileLayer(
    'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
       opacity: 0.6,
       attribution: '<a href="http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html" target="_blank">国土地理院</a>'
  });

  // レイヤコントロール
  var baseLayers = {
    "現代": newLayer,
    "明治期": oldLayer
  };
  L.control.layers(baseLayers).addTo(map);
  newLayer.addTo(map);

  var markerclusters = new L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 40
  });
  map.addLayer(markerclusters);

  $.getJSON( 'https://raw.githubusercontent.com/ShinodaKosuke/stonework-3D-archive/master/stonework-3D-archive.geojson', function(data) {
    var modelLayer = L.geoJson(data, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
          icon: L.BeautifyIcon.icon({
            isAlphaNumericIcon: true,
            text: (function(feat){
                var str = feat.properties['分類'];
                var type = str.split(',');
                switch(type[0].trim()) {
                  case '庚申塔': return '庚申';
                  case '月待塔': return '月待';
                  case '地神塔': return '地神';
                  case '道祖神': return '塞神';
                  case '道標': return '道標';
                  case '石橋供養塔': return '石橋';
                  default: return '';
                }
              }(feature)),
            iconSize: [30, 30],
            iconShape: 'marker',
            borderColor: '#888',
            backgroundColor: '#CCC',
            textColor: '#000'
          })
        }).bindPopup(
          function() {
            tr = '<table border>';
            Object.keys(feature.properties).forEach( function(k){
              tr = tr + '<tr><td style="white-space: nowrap;">' + k + '</td><td>' + feature.properties[k] + '</td></tr>';
            });
            return tr + '</table>';
          }
        );
      }
    });
    markerclusters.addLayer(modelLayer);
    map.fitBounds(markerclusters.getBounds());
  });

  L.easyButton('fa fa-info fa-lg',
    function() {
      $('#about').modal('show');
    },
    'このサイトについて',
    null, {
      position:  'bottomright'
    }).addTo(map);

});
