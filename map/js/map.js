$(function(){

  var embed = false;
  var parr=location.search.substring(1).split('&');
  for(i = 0; i < parr.length; i++) {
    ppair = parr[i].split('=');
    if(ppair[0] == 'embed' && ppair[1] == '1') {
      embed = true;
    }
  }

  if( embed ) {
    var map = L.map('mapdiv', {
      minZoom: 6,
      maxZoom: 18,
      gestureHandling: true
    });
  } else {
    var map = L.map('mapdiv', {
      minZoom: 6,
      maxZoom: 18
    });
  }

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
          title:feature.properties['分類'],
          icon: L.icon({
            iconAnchor: [14, 40],
            iconUrl: (function(feat){
              var str = feat.properties['分類'];
              var type = str.split(',');
              switch(type[0].trim()) {
                case '庚申塔': return 'icon/koshin.png';
                case '月待塔': return 'icon/tsukimachi.png';
                case '地神塔': return 'icon/sekijin.png';
                case '道祖神': return 'icon/dosojin.png';
                case '道標': return 'icon/dohyo.png';
                case '石橋供養塔': return 'icon/kuyohi.png';
                case '念仏塔': return 'icon/kuyohi.png';
                case '狛犬': return 'icon/stone.png';
                case '猿田彦大神塔': return 'icon/koshin.png';
                case '橋柱': return 'icon/stone.png';
                case '日支事変記念碑': return 'icon/chukonhi.png';
                case '馬頭観音': return 'icon/bato.png';
                case '疱瘡神塔': return 'icon/sekijin.png';
                case '大日如来塔': return 'icon/nyorai.png';
                case '出羽三山塔': return 'icon/mount.png';
                case '聖徳太子塔': return 'icon/kuyohi.png';
                case '御嶽塔': return 'icon/mount.png';
                case '記念碑': return 'icon/kinenhi.png';
                case '富士講碑': return 'icon/fujiko.png';
                default: return 'icon/stone.png';
              }
            }(feature))
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
    $('#model_count').text(modelLayer.getLayers().length);
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
