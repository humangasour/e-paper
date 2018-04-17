$(document).ready(function () {
	//the main article window
	const $pageContainer = $('#main-article');


	function prepareForClipping(){
	  isClipping = true;
	  if(clippingObj) {
	    clippingObj.setOptions({ show: true, persistent: true, enable:true });
	  }
	}

	function clipSelectionChange(e){
		$('#clip-options').remove();
	  var pageOffset = $pageContainer.offset();
	  var clipSelection = clippingObj.getSelection();
		var firstTime = (e ? e.firstTime : false);

	  if(clipSelection.width < 10){
	    return;
	  }
	  var top = pageOffset.top + clipSelection.y1 - (firstTime ? 110 :56);
	  var leftM = pageOffset.left + clipSelection.x1 + clipSelection.width/2 - 111;
	  $('body').append('<div style="top: '+top+'px; left: '+leftM+'px; display: block; opacity: 1;" id="clip-options" class="popover fade top in" role="tooltip">'+
	    '<div style="left: 50%;" class="arrow"></div><h3 style="display: none;" class="popover-title"></h3><div class="popover-content">'+
	    (firstTime ? '<p>Re-size and place this box where you want to clip</p>' : '')+
	    (firstTime ? '' : '<button id="clip-options-save" class="btn btn-primary">Clip &amp; Share</button>') +
	    '<button id="clip-options-cancel" class="btn btn-link"><i class="fa fa-times"></i> Cancel</button></div></div>');
	  $('#clip-options-cancel').click(cancelClipping);
	  $('#clip-options-save').click(saveClipping);
	  preview(document.getElementById('photo'), clipSelection);
	  
	}

	function saveClipping() {
		$('#clip-options').remove();
	  var selection = clippingObj.getSelection();
	  if((selection.width < 50) || (selection.height) < 50){
	    alert('Very small clip. Please increase the size');
	    return;
	  }
	}

	$('<div><img src="img/page.png" style="position: relative;" /><div>')
    .css({
        float: 'left',
        position: 'relative',
        overflow: 'hidden',
        top: '-100%',
        left: '-30%',
        width: '100px',
        height: '100px'
    })
    .insertAfter($('#photo'));

	function cancelClipping(){
	  if(clippingObj) {
	    clippingObj.cancelSelection();  
	  } 
	  $('#clip-options').remove();
	  isClipping = false;
	  if(clippingObj) {
	    clippingObj.setOptions({ persistent: false });
	    clippingObj.update();
	  }
//	  $('#page-level-bar').removeClass('flip');
	}

  const clippingObj = $('img#photo').imgAreaSelect({
    'handles': true,
    'parent':'body',
    'instance':true,
    'fadeSpeed':300,
    'keys': true,
    'onSelectStart': prepareForClipping,
    'onSelectChange': clipSelectionChange,
    'aspectRatio': '1:1'
  });

  function preview(img, selection) {
	  var scaleX = 100 / (selection.width || 1);
	  var scaleY = 100 / (selection.height || 1);

	  $('#photo + div > img').css({
	    width: Math.round(scaleX * 400) + 'px',
	    height: Math.round(scaleY * 300) + 'px',
	    marginLeft: '-' + Math.round(scaleX * selection.x1) + 'px',
	    marginTop: '-' + Math.round(scaleY * selection.y1) + 'px'
	  });
	}

});

