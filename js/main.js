$(document).ready(function () {
	const $pageContainer = $('#main-article');

	function clipSelectionChange(e){
	  var pageOffset = $pageContainer.offset();
	  console.log('pageOffset = ' + pageOffset.top)
	  var clipSelection = clippingObj.getSelection();
	  var firstTime = false;
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
}

  const clippingObj = $('img#photo').imgAreaSelect({
    handles: true,
    onSelectEnd: console.log('selected'),
    keys: true,
    instance: true,
    onSelectEnd: clipSelectionChange,
  });
});

