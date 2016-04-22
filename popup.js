// Based on the Chromium Extension Example (Copyright (c) 2014 The Chromium Authors. All rights reserved.)

function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
	
	// image manipulation button
	document.getElementById("better").onclick = function () { 
		var images=['http://m.cdn.blog.hu/va/vastagbor/image/2013/10/jobban.jpg','http://mandiner.hu/attachment/0069/68371_m_j_t.jpg','http://m.cdn.blog.hu/he/hetikomment/image/fidesz-plakat.jpg','http://img.444.hu/tv22.jpg','http://pics.indavideo.hu/videos/001/381/605/1-1.jpg','http://imagestore1.blogger.hu/25_147944_712580_4ebda4d88ef46c3a1d4f1406273210a7_9f0190_301.jpg','http://www.kormany.hu/download/7/40/00000/ME_fogyatek_2014_A4.jpg'];
		var d = new Date();
		if(d.getDay()==0){
			images=['http://nepszava.hu/picture/50507/normal/201/00201465.jpeg','https://d2gvief1bcth7.cloudfront.net/wp-content/uploads/sites/3/2015/02/VASI.jpg','http://librarius.hu/wp-content/uploads/2015/03/vasarnapi-bolt-zarva.jpeg','http://drtoth.eu/wp-content/uploads/2015/03/vasarnapi-zarva-tartas.jpg','http://hircsarda.hu/wp-content/uploads/2015/06/balaton.jpg'];
		}
		chrome.tabs.executeScript(null,{code:"var a = document.getElementsByTagName('img');var p=['"+images.join("','")+"'];for (var i=0, m=a.length; i < m; i++)a[i].src=p[Math.floor(Math.random()*p.length)];"});
		window.close();
	};
	
	// enable/disable extension button
	var options=document.getElementById("option");
	chrome.storage.local.get(null,function (obj){
		if (obj.disabled=='true'){
			options.value='Bővítmény indítása';
			options.onclick = function () { 
				chrome.storage.local.set({"disabled":"false"},function (){
					window.close();
					chrome.tabs.executeScript(null,{code:"window.location.reload();"});
				});
			}
		}else{
			options.value='Bővítmény szüneteltetése';
			options.onclick = function () { 
				chrome.storage.local.set({"disabled":"true"},function (){
					window.close();
					chrome.tabs.executeScript(null,{code:"window.location.reload();"});
				});
			}
		}
	});
  });
});
