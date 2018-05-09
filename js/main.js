$(document).ready(function () {

  'use strict';

  let $image = $('#photo');
  let pageUrls = [];
  let croppedImages = [];
  // setup the options for the cropper
  let options = {
    viewMode: 2,
    modal: true,
    crop: function (e) {
    }
  };

  var element = document.querySelector( '#photo' );
  Intense( element );

  const fetchPages = () => {
    axios.get('https://e-paper.herokuapp.com/epaper/fetch')
    .then(response => {
      response.data.map(page => {
        pageUrls.push(page.paper_location);
      })
      pageUrls = pageUrls.slice(2);

      pageUrls.map(pageUrl => {
        $(`<img class="article-sidebar__page-img" src="${pageUrl}"></img>`).appendTo('.article-sidebar__pages-container')
      });
      
      $image.attr('src', pageUrls[0]); 
      $('.article-sidebar__page-img').first().addClass('active');  

      $('#pagination-demo').twbsPagination({
        totalPages: pageUrls.length,
        visiblePages: 5,
        onPageClick: function (event, page) {
          const activePage = $('.article-sidebar__page-img').eq(page-1);
          activePage.siblings().removeClass('active');
          activePage.addClass('active');
          $image.attr('src', activePage.attr('src'));
          let cropper = $image.data('cropper');
          if(cropper) {
            $image.cropper('destroy');
          }
        }
      })

      $('.article-sidebar__page-img').on('click', (e) => {
        showSelectedArticle(e);
      });

      // $(".pan").pan();
 
    });
  }

  fetchPages();

  const showSelectedArticle = event => {
    let targetArticleSrc = $(event.target).attr('src');
    $(event.target).siblings('img').removeClass('active');
    $(event.target).addClass('active');
    $('#pagination-demo').twbsPagination('destroy');
    $('#pagination-demo').twbsPagination({
        totalPages: pageUrls.length,
        visiblePages: 5,
        startPage: $('.article-sidebar__page-img').index(event.target) + 1,
        onPageClick: function (event, page) {
          
          const activePage = $('.article-sidebar__page-img').eq(page-1);
          activePage.siblings().removeClass('active');
          activePage.addClass('active');
          $image.attr('src', activePage.attr('src'));
          let cropper = $image.data('cropper');
          if(cropper) {
            $image.cropper('destroy');
          }
        }
      })
    $image.attr('src', targetArticleSrc);
    let cropper = $image.data('cropper');
    if(cropper) {
      $image.cropper('destroy');
    }
    console.log($('#photo'));
  }

	let uploadedImageType = 'image/jpeg';

  const appendCroppedCanvas = canvas => {
    $('<div class="clip-container"></div>').prependTo('.article-sidebar__clips-container');

    $('.clip-container').first().html(canvas); 
    const overlay = '<div class="canvas-overlay"></div>';
    const firstDiv = $('.clip-container').first();
    $('<div class="canvas-overlay"><span class="download-icon"><i class="fas fa-download"></i></span><span class="share-icon"><i class="fas fa-share-alt"></i></span></div>').appendTo(firstDiv);
  }

  // listen for clicks on crop button
	$('#crop-btn').on('click', () => {
    console.log('clicked');
    console.log($('#photo'));
		// then intilize the cropper
	  $('#photo').on({
	    ready: function (e) {
	      console.log(e.type);
        console.log('getting ready');
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
	    },
      destroy: function (e) {
        console.log(e.type);
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

    	 if (typeof data.target !== 'undefined') {
        $target = $(data.target);

        if (typeof data.option === 'undefined') {
          try {
            data.option = JSON.parse($target.val());
          } catch (e) {

          }
        }
      }

      cropped = cropper.cropped;

      switch (data.method) {

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
            appendCroppedCanvas(result);
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

