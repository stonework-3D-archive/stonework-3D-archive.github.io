$(function(){

  var map = L.map('mapdiv', {
    minZoom: 6,
    maxZoom: 18,
    gestureHandling: true
  });

  // 迅速測図
  var oldLayer = L.tileLayer(
    'http://aginfo.cgk.affrc.go.jp/ws/ws/tmc/1.0.0/Kanto_Rapid-900913-L/{z}/{x}/{y}.png', {
       maxNativeZoom: 17,
       opacity: 0.9,
       attribution: '<a href="http://aginfo.cgk.affrc.go.jp/tmc/index.html.ja" target="_blank">農研機構</a>'
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
                  case '石橋供養塔': return '供養';
                  case '念仏塔': return '念仏';
                  case '狛犬': return '狛犬';
                  case '猿田彦大神塔': return '猿田';
                  case '橋柱': return '橋柱';
                  case '日支事変記念碑': return '日支';
                  case '馬頭観音': return '馬頭';
                  case '疱瘡神塔': return '疱瘡';
                  case '大日如来塔': return '大日';
                  case '出羽三山塔': return '出羽';
                  case '聖徳太子塔': return '太子';
                  default: return '';
                }
              }(feature)),
            iconSize: [30, 30],
            iconShape: 'marker',
            innerIconStyle: 'left: -3px; position: relative;',
            borderColor: '#AAA',
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
