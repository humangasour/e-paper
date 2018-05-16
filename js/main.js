$(document).ready(function () {

  'use strict';

  const articleOverlay = document.querySelector( '.main-article__overlay' );
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const date = new Date();
  let $image = $('#photo');
  let pageUrls = [];
  let croppedImages = [];
  let uploadedImageType = 'image/jpeg';
  // setup the options for the cropper
  let options = {
    viewMode: 2,
    modal: true,
    crop: function (e) {
    }
  };

  
  let curDate = days[date.getDay()] + ', ' + date.getDate() + ' ' + months[date.getMonth()] + ', ' + date.getFullYear();
  $('.datepicker').attr('value', curDate);

  $('.datepicker').on('click', function () {
    $('.datepicker').pickadate({
      format: 'dddd, dd mmm, yyyy',
      formatSubmit: 'yyyy/mm/dd',
      hiddenPrefix: 'prefix__',
      hiddenSuffix: '__suffix',
      closeOnSelect: true,
      closeOnClear: true,
      clear: '',
      max: new Date(date.getFullYear(), date.getMonth(), date.getDate())
    });
  })


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
            $('.cropper-crop-box').popover('hide');
            $image.cropper('destroy');
          }
          articleOverlay.setAttribute('data-image', $image.attr('src'));      
          Intense( articleOverlay );
        }
      })

      $('.article-sidebar__page-img').on('click', (e) => {
        showSelectedArticle(e);
      });
      
      // code that turns the image into humangasour
      articleOverlay.setAttribute('data-image', $image.attr('src'));      
      Intense( articleOverlay );


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
            $('.cropper-crop-box').popover('hide');
            $image.cropper('destroy');
          }
          articleOverlay.setAttribute('data-image', $image.attr('src'));      
          Intense( articleOverlay );
        }
      })
    $image.attr('src', targetArticleSrc);
    let cropper = $image.data('cropper');
    if(cropper) {
      $('.cropper-crop-box').popover('hide');
      $image.cropper('destroy');
    }
    articleOverlay.setAttribute('data-image', $image.attr('src'));      
    Intense( articleOverlay );
  }

  const appendCroppedCanvas = canvas => {
    $('<div class="clip-container"></div>').prependTo('.article-sidebar__clips-container');

    $('.clip-container').first().html(canvas); 
    const overlay = '<div class="canvas-overlay"></div>';
    const firstDiv = $('.clip-container').first();
    $('<div class="canvas-overlay"><span class="download-icon"><i class="fas fa-download"></i></span><span class="share-icon"><i class="fas fa-share-alt"></i></span></div>').appendTo(firstDiv);
  }

  const showPopover = () => {
    $('.cropper-crop-box').popover({
      content: '<p class="popover-options"><strong class="save-btn" data-method="showCanvasInModal">SAVE</strong> <span>|</span> <strong class="cancel-btn" style="color: rgba(243, 22, 43, 0.81);">CANCEL</strong></p>',
      placement: 'top',
      html: true,
    });
    $('.cropper-crop-box').popover('show');
    // $('.save-btn').on('click', () => {
    //   let $this = $(this);
    //   let data = $this.data();
    //   let cropper = $image.data('cropper');

    //   let result = $image.cropper(data.method, data.option, data.secondOption);
    //   console.log('result', result);
    //   $('#saveAndShareModal').modal('show');
    //   $('#saveAndShareModal .cropped-img').html(result);
    // })
    $('.cancel-btn').on('click', function() {
      $('.cropper-crop-box').popover('hide');
      $('#photo').cropper('destroy');
    });
  }

  // listen for clicks on crop button
  $('#crop-btn').on('click', () => {
    // then intilize the cropper
    $('#photo').on({
      ready: function (e) {
        console.log('crop ready');
        showPopover();
      },
      cropstart: function (e) {
        console.log('crop started');
        showPopover();
      },
      cropmove: function (e) {
        console.log('crop moving');
        showPopover();
      },
      cropend: function (e) {
        console.log('crop end');
        showPopover();
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


  //listen for clicks on top bar
   $(document).on('click', '[data-method]', function () {
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
    }

    result = $image.cropper(data.method, data.option, data.secondOption);

    switch (data.method) {

        case 'getCroppedCanvas':
          if (result) {
            croppedImages.push(result.toDataURL(uploadedImageType));
            let croppedImageData = {
              imgSrc: croppedImages[0],
            }
            appendCroppedCanvas(result);
          }

          break;

        case 'showCanvasInModal':
          if (result) {
            $('#saveAndShareModal').modal('show');
            let imageData = $image.cropper('getCroppedCanvas');
            $('.cropped-img').html(imageData);
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
  });


});
