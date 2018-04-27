$(document).ready(function () {

  'use strict';

	// capture the main article photo
	const $image = $('#photo');
	var $dataX = $('#dataX');
  var $dataY = $('#dataY');
  var $dataHeight = $('#dataHeight');
  var $dataWidth = $('#dataWidth');
  var $dataRotate = $('#dataRotate');
  var $dataScaleX = $('#dataScaleX');
  var $dataScaleY = $('#dataScaleY');
  var options = {
        viewMode: 2,
        modal: true,
        crop: function (e) {
          $dataX.val(Math.round(e.detail.x));
          $dataY.val(Math.round(e.detail.y));
          $dataHeight.val(Math.round(e.detail.height));
          $dataWidth.val(Math.round(e.detail.width));
          $dataRotate.val(e.detail.rotate);
          $dataScaleX.val(e.detail.scaleX);
          $dataScaleY.val(e.detail.scaleY);
        }
      };

	var originalImageURL = $image.attr('src');
	var uploadedImageName = 'cropped.jpg';
	var uploadedImageType = 'image/jpeg';
	var uploadedImageURL;


	$('#crop-btn').on('click', () => {
		//intilize the cropper
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
    var $this = $(this);
    var data = $this.data();
    var cropper = $image.data('cropper');
    var cropped;
    var $target;
    var result;
    console.log('target =', data.target);
    console.log('method =', data.method);
    console.log('data =', data);
    console.log('this = ', $this);


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
            // Bootstrap's Modal
            $('.pages-bar').html(result);

            if (!$download.hasClass('disabled')) {
              download.download = uploadedImageName;
              $download.attr('href', result.toDataURL(uploadedImageType));
            }
          }

          break;

        case 'destroy':
          if (uploadedImageURL) {
            URL.revokeObjectURL(uploadedImageURL);
            uploadedImageURL = '';
            $image.attr('src', originalImageURL);
          }

          break;
      }
   });
});

