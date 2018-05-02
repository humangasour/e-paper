function shareClickHandler () {
  console.log($(this).parent().parent().child('img'));
}

$(document).ready(function () {

  'use strict';

	// capture the main article photo
	const $image = $('#photo');

  // setup the options for the cropper
  let options = {
    viewMode: 2,
    modal: true,
    crop: function (e) {
    }
  };

  let croppedImages = [];

	let uploadedImageType = 'image/jpeg';

  const appendCroppedCanvas = canvas => {
    $('<div class="clip-container"></div>').prependTo('.article-sidebar__clips-container');

    $('.clip-container').first().html(canvas); 
    const overlay = '<div class="canvas-overlay"></div>';
    const firstDiv = $('.clip-container').first();
    $('<div class="canvas-overlay"><span class="download-icon"><i class="fas fa-download"></i></span><span onclick="shareClickHandler();" class="share-icon"><i class="fas fa-share-alt"></i></span></div>').appendTo(firstDiv);
  }

  function shareClickHandler () {
    alert('something');
  }

  // listen for clicks on crop button
	$('#crop-btn').on('click', () => {
		// then intilize the cropper
	  $image.on({
	    ready: function (e) {
	      console.log(e.type);
	    },
	    cropstart: function (e) {
	      console.log(e.type, e.detail.action);
	    },
	    cropmove: function (e) {
	      console.log(e.type, e.detail.action);
	    },
	    cropend: function (e) {
	      console.log(e.type, e.detail.action);
	    },
	    crop: function (e) {
	      console.log(e.type);
	    },
	    zoom: function (e) {
	      console.log(e.type, e.detail.ratio);
	    }
	  }).cropper(options);
	}); 

	//listen for clicks on buttons
	 $('.paginate').on('click', '[data-method]', function () {
    let $this = $(this);
    let data = $this.data();
    let cropper = $image.data('cropper');
    let cropped;
    let $target;
    let result;


    if(cropper && data.method) {
    	 data = $.extend({}, data);
    	 console.log('newdata =', data);

    	 if (typeof data.target !== 'undefined') {
        $target = $(data.target);

        if (typeof data.option === 'undefined') {
          try {
            data.option = JSON.parse($target.val());
            console.log('data-option', data.option);
          } catch (e) {
            console.log(e.message);
          }
        }
      }

      cropped = cropper.cropped;

      switch (data.method) {
        case 'rotate':
          if (cropped && options.viewMode > 0) {
            $image.cropper('clear');
          }

          break;

        case 'getCroppedCanvas':
          if (uploadedImageType === 'image/jpeg') {
            if (!data.option) {
              data.option = {};
            }

            data.option.fillColor = '#fff';
          }

          break;
      }


      result = $image.cropper(data.method, data.option, data.secondOption);
    }

    switch (data.method) {
        case 'rotate':
          if (cropped && options.viewMode > 0) {
            $image.cropper('crop');
          }

          break;

        case 'scaleX':
        case 'scaleY':
          $(this).data('option', -data.option);
          break;

        case 'getCroppedCanvas':
          if (result) {
            croppedImages.push(result.toDataURL(uploadedImageType));
            let croppedImageData = {
              imgSrc: croppedImages[0],
            }
            // axios.post('https://e-paper-d1cb3.firebaseio.com/croppedImages.json', croppedImageData)
            //   .then(response => {
                  
            //   })

            appendCroppedCanvas(result);

            // axios.get('https://e-paper-d1cb3.firebaseio.com/croppedImages.json')
            //     .then(response => {
            //       let responseData = response.data;
            //       console.log('responseData', responseData);
            //     });
          }

          break;
      }
   });


  $('#pages-btn').on('click', function() {
    $(this).toggleClass('article-sidebar__buttons--active');
    $(this).next().toggleClass('article-sidebar__buttons--active');
    $('.article-sidebar__pages-container').removeClass('d-none');
    $('.article-sidebar__clips-container').addClass('d-none');
  });  

  $('#clips-btn').on('click', function() {
    $(this).toggleClass('article-sidebar__buttons--active');
    $(this).prev().toggleClass('article-sidebar__buttons--active');
    $('.article-sidebar__pages-container').addClass('d-none');
    $('.article-sidebar__clips-container').removeClass('d-none');
    // axios.get('https://e-paper-d1cb3.firebaseio.com/croppedImages.json')
    //   .then(response => {
    //     // let img = '<img src="' + response.data + '">';
    //     console.log(response.data);
    //     // $('.article-sidebar__clips-container').html(img);
    //   })
  });


});

