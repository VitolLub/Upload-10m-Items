/*$('#aaa').click(function(event){

          console.log("aaaaaaa clicked");

          chrome.runtime.sendMessage({type: "getProductsData"}, function(response) {

			  console.log(response.status);
		});

 });*/

function throwAlert(type,text){

   $('body').prepend('<div id="alertID" class="col-sm-12 alert '+type+' alert-dismissible" role="alert">\
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">\
                    <span aria-hidden="true">&times;</span></button>\
                    <strong>Ooooppps!</strong> '+text+'</div>');

    setTimeout(function(){ 
            $('#alertID').remove();
    }, 4000);

}

$(function() {

    
  // call the tablesorter plugin and apply the uitheme widget
  $("#researchTable").tablesorter({
    // this will apply the bootstrap theme if "uitheme" widget is included
    // the widgetOptions.uitheme is no longer required to be set
    theme : "bootstrap",

    widthFixed: true,

    headerTemplate : '{content} {icon}', // new in v2.7. Needed to add the bootstrap icon!

    // widget code contained in the jquery.tablesorter.widgets.js file
    // use the zebra stripe widget if you plan on hiding any rows (filter widget)
    widgets : [ "uitheme","columnSelector", "filter", "zebra" ,"output","stickyHeaders"],

    widgetOptions : {
      // using the default zebra striping class name, so it actually isn't included in the theme variable above
      // this is ONLY needed for bootstrap theming if you are using the filter widget, because rows are hidden
      zebra : ["even", "odd"],

      // reset filters button
      filter_reset : ".reset",

      // extra css class name (string or array) added to the filter element (input or select)
      filter_cssFilter: "form-control",

      output_headerRows    : true,        // output all header rows (multiple rows),

      output_delivery      : 'd', 

      output_saveFileName  : 'research_table.csv',



       // extra class name added to the sticky header row
       stickyHeaders: '',

            // number or jquery selector targeting the position:fixed element
       stickyHeaders_offset: 0,

            // added to table ID, if it exists
       stickyHeaders_cloneId: '-sticky',

            // trigger "resize" event on headers
       stickyHeaders_addResizeEvent: true,

            // if false and a caption exist, it won't be included in the sticky header
       stickyHeaders_includeCaption: true,

            // The zIndex of the stickyHeaders, allows the user to adjust this to their needs
       stickyHeaders_zIndex: 2,

            // jQuery selector or object to attach sticky header to
       stickyHeaders_attachTo: '.tab-content',//null,

            // jQuery selector or object to monitor horizontal scroll position (defaults: xScroll > attachTo > window)
       stickyHeaders_xScroll: null,

            // jQuery selector or object to monitor vertical scroll position (defaults: yScroll > attachTo > window)
       stickyHeaders_yScroll: null,


            // scroll table top into view after filtering
       stickyHeaders_filteredToTop: true
      // set the uitheme widget to use the bootstrap theme class names
      // this is no longer required, if theme is set
      // ,uitheme : "bootstrap"

    }
  });

    // call this function to copy the column selection code into the popover
      $.tablesorter.columnSelector.attachTo( $('.bootstrap-popup'), '#popover-target');

      $('#popover')
        .popover({
          placement: 'right',
          html: true, // required if content has HTML
          content: $('#popover-target')
        });
  /*.tablesorterPager({

    // target the pager markup - see the HTML block below
    container: $(".ts-pager"),

    // target the pager page select dropdown - choose a page
    cssGoto  : ".pagenum",

    // remove rows from the table to speed up the sort of large tables.
    // setting this to false, only hides the non-visible rows; needed if you plan to add/remove rows with the pager enabled.
    removeRows: false,

    // output string - default is '{page}/{totalPages}';
    // possible variables: {page}, {totalPages}, {filteredPages}, {startRow}, {endRow}, {filteredRows} and {totalRows}
    output: '{startRow} - {endRow} / {filteredRows} ({totalRows})'

  });*/


   /* chrome.runtime.onMessage.addListener(

          function(request, sender, sendResponse) {
           
            if (request.type == "productsData"){

               console.log("got products data : " + request.content);

               //$("table tbody").append('<tr><td><a href="http://www.google.com">click me</a></td><td>Languages</td><td>female</td><td>'+request.content+'</td><td>37</td><td>67</td><td>54</td></tr>');
              
                // let the plugin know that we made a update, then the plugin will
                // automatically sort the table based on the header settings
                //$("table").trigger("update");

                 sendResponse({status : "OK"});

                //return false;
            }

      });*/

  

  function delay(time) {
    return function () {
        console.log("Delaying");
        var ret = new $.Deferred();
        setTimeout(function () {
            ret.resolve();
        }, time);
        return ret;
    };
  }

  function median(SortedArr) { 
        
        var half = Math.floor(SortedArr.length/2); 
        if (SortedArr.length % 2) { 
          return SortedArr[half]; } 
        else { 
          return (SortedArr[half-1] + SortedArr[half]) / 2.0; 
        } 
  } 

  function isLocalStorageSupported(){

      if(typeof(Storage) !== "undefined") {

        return true;
    // Code for localStorage/sessionStorage.
      } 

      return false;
  }

  var marketplace = 'US';


});

