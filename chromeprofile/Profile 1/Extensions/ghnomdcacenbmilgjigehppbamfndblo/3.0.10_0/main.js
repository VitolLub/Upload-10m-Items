function continue_loading()
{
  translate_all_elms();
  
  $(document).ready(function() {
    set_zoom();
  });
  
  // ALL FOUNDATION SHIT HERE
  $(document).foundation();
  
  /////////////////////////////////////////
  
  hide_error_overlay();
  show_loading_overlay();
  
  // set Period button states
  //update_period_options()
  //select_correct_period();
  
  // set tab state
  activate_appropriate_tab();
  
  // update chart dims based on final initial settings
  perform_vertical_expansion();
  perform_horizontal_expansion();
  
  update_user_info();
  init_intro();
  
  $(window).on("blur", function() {
    save_settings();
    //camelizer_event("Deactivation", CAMELIZER.ephemeral("locale"), null);
  });
  
  $(".3camelizer_version").html(CAMELIZER.version());
  $(".3camelizer_buildinfo").html(CAMELIZER.config("build_info"));
  
  ////////////////////////////////
  
  $("#sidebar").mouseenter(function() {
  var sb = $("#sidebar");
  sb.addClass("expanded");
})
.mouseleave(function() {
  var sb = $("#sidebar");
  sb.removeClass("expanded");
});

$("#chartmenu").click(function(e) {
  e.preventDefault();
  var elm = $(e.currentTarget);
  
  if (elm[0].tagName != "A")
    elm = elm.parent();
  
  if (elm.hasClass("disabled") || elm.hasClass("active"))
    return(false);
  
  //camelizer_event("Sidebar", "chart_options", null);
  $("#chart_options_panel").foundation("open");
});

/*
$("#gotoc3").click(function(e) {
  camelizer_event("Sidebar", "goto_c3", null);
});
*/

// sidebar
$("#sidebar .tab").click(function(e) {
  e.preventDefault();
  var elm = $(e.currentTarget);
  
  if (elm[0].tagName != "A")
    elm = elm.parent();
  
  if (elm.hasClass("disabled") || elm.hasClass("active"))
    return(false);
  
  dmsg(elm);
  var selected_tab = elm.attr("x-camel-value");
  CAMELIZER.ephemeral("selected_tab", selected_tab);
  //camelizer_event("Sidebar", selected_tab, null);
  
  var page_products = CAMELIZER.ephemeral("page_products");
  
  if (selected_tab == "pricehistory")
    $("#chartmenu").removeClass("disabled");
  else
    $("#chartmenu").addClass("disabled");
  
  if (selected_tab == "help")
  {
    // lazy load image
    // set link urls
    // etc
    var logo = $("#help_logo");
    
    if (!logo.attr("src"))
      logo.attr("src", "help-logo.png");
  }
  
  if (selected_tab == "pageproducts" && (!page_products || page_products.length == 0))
  {
    show_loading_overlay();
    
    get_asins(function(resp) {
      process_asins_for_pageproducts(resp);
      activate_appropriate_tab();
      hide_loading_overlay();
    });
  }
  else
    activate_appropriate_tab();
});
  $("#date_list .button").click(function(e) {
  e.preventDefault();
  var elm = $(e.currentTarget);
  
  if (elm.hasClass("disabled") || elm.hasClass("fake") || elm.hasClass("active"))
    return(false);
  
  var period = elm.attr("x-camel-value");
  //camelizer_event("Period", period, null);
  CAMELIZER.setting("period", period);
  select_correct_period();
  show_loading_overlay();
  load_chart();
  save_settings();
  
  return(false);
});

// set chart stuff
$("#chart").on("load", function(){
  hide_loading_overlay();
  check_tour_necessity();
  set_zoom();
});

$("#chart").on("error", function(){
  dmsg("Error loading chart!");
  $("#chart").attr("src", "chart_error.png");
  hide_loading_overlay();
});

// handle Zoom option
$("#opt_zero").prop("checked", CAMELIZER.setting("close_up"));

$("#opt_zero").change(function() {
  //camelizer_event("Close-up View", this.checked ? "Yes" : "No", null);
  CAMELIZER.setting("close_up", this.checked);
  show_loading_overlay();
  load_chart();
  save_settings();
});

// handle outlier filtering option
$("#opt_fo").prop("checked", CAMELIZER.setting("filter_outliers"));

$("#opt_fo").change(function() {
  //camelizer_event("Filter Outliers", this.checked ? "Yes" : "No", null);
  CAMELIZER.setting("filter_outliers", this.checked);
  show_loading_overlay();
  load_chart();
  save_settings();
});
  // price types
var active_price_types = CAMELIZER.setting("price_types");
var price_types = $("#pt_amazon, #pt_new, #pt_used");
price_types.prop("checked", false);
$("span.swatch").addClass("deactivated");

$.each(active_price_types, function(i, pt) {
  $("#pt_" + pt).prop("checked", true);
  $("span.swatch." + pt).removeClass("deactivated");
});

price_types.change(function() {
  var active_price_types = CAMELIZER.setting("price_types");
  var pt = $(this);
  
  if (!this.checked && active_price_types.length == 1)
  {
    pt.prop("checked", true);
    return(true);
  }
  
  show_loading_overlay();
  var val = pt.attr("x-camel-value");
  var swatch = $("span.swatch." + val);
  
  if (this.checked)
  {
    swatch.removeClass("deactivated");
    CAMELIZER.enable_price_type(val);
  }
  else
  {
    swatch.addClass("deactivated");
    CAMELIZER.disable_price_type(val);
  }
  
  //camelizer_event("Price Types", val, this.checked ? 1 : 0);
  
  load_chart();
  save_settings();
});

$("#watchfrm .pointer").click(function(e) {
  e.preventDefault();
  var id = $(e.currentTarget).attr("x-camel-value");
  $("#" + id).click();
});

$("#watchform_question").click(function(e) {
  e.preventDefault();
  CAMELIZER.ephemeral("intro").start();
});

$("#watchfrm .delete_camel").click(function(e) {
  var elm = $(e.currentTarget);
  var price_type = elm.attr("x-camel-value");
  $("tr." + price_type + " .desired input").val("");
  $("#watchfrm").submit();
  //camelizer_event("Delete Camel", price_type, null);
});

$("#watchfrm td.desired input[type='text']").keypress(function(e) {
  if (e.which == 13)
  {
    e.preventDefault();
    $(this).blur();
    $("#watchfrm").focus().submit();
    return(false);
  }
});

// watchform submission
$("#watchfrm").submit(function(e) {
  dmsg("WATCHFORM SUBMIT");
  var elm = $(e.currentTarget);
  elm.find(":submit").attr("disabled", "disabled");
  e.preventDefault();
  clear_input_errors();
  show_loading_overlay(browser.i18n.getMessage("msg_saving_watches"));
  //camelizer_event("Watch Form", "Submit", null);
  
  // error check form
  
  // submit form
  var url = "https://" + CAMELIZER.config("api_endpoint") + "/camelizer/track";
  var in_data = {
    "asin": CAMELIZER.ephemeral("asin"),
    "locale": CAMELIZER.ephemeral("locale"),
    "secret_keys": CAMELIZER.ephemeral("secret_keys"),
    "version": CAMELIZER.version(),
  };
  in_data = $("#watchfrm").serialize() + "&" + $.param(in_data);
  
  dmsg(in_data);
  dmsg(url);
  
  $.post(url, in_data, function() {}, "json")
    .done(function(data, status, xhr) {
      dmsg("SAVE SUCCESS");
      dmsg(this);
      dmsg(this.xhr);
      
      elm.find(":submit").removeAttr("disabled");
      
      var bail = false;
      var any_errors = false;
      
      // probably should abort all processing if email is invalid
      if (data.errors && data.errors.length > 0)
      {
        dmsg(data.errors);
        bail = set_input_errors(data.errors);
        any_errors = true;
        //show_top_error("Error Saving Watches", "Due to invalid prices or email address, we were unable to save your price watches.  Please see the fields highlighted in red.");
      }
      
      if (!bail)
      {
        CAMELIZER.ephemeral("camels", data.camels);
        var secret_keys = {};
        $.each(data.camels, function(price_type, camel) {
          secret_keys[price_type] = camel.secret_key;
        });
        CAMELIZER.ephemeral("secret_keys", secret_keys);
        save_secret_keys();
        update_prices_and_camels();
        hide_loading_overlay();
        
        if (!any_errors)
          show_top_success(browser.i18n.getMessage("msg_success"), browser.i18n.getMessage("msg_watches_saved"), 2.25);
        else
          show_top_notice(browser.i18n.getMessage("msg_partial_watches_saved"), browser.i18n.getMessage("msg_see_red_fields"), 5.0)
      }
      else
        hide_loading_overlay();
    })
  .fail(function(data, status, xhr) {
    elm.find(":submit").removeAttr("disabled");
    dmsg("SAVE ERROR");
    dmsg(this);
    dmsg(data);
    show_top_error(browser.i18n.getMessage("msg_error_saving_watches"), browser.i18n.getMessage("msg_server_error_saving"));
    hide_loading_overlay();
  });
  
  return(false);
});

// init them tips
$("td.desired input[type='text']").tooltipster({
  trigger: "click",
  theme: "tooltipster-punk",
  contentAsHTML: true,
  interactive: true,
});
  $("#allow_analytics").attr("checked", CAMELIZER.setting("allow_analytics"));

$("#allow_analytics").change(function (e) {
  var elm = $(e.currentTarget);
  CAMELIZER.setting("allow_analytics", elm.attr("checked"));
  save_settings();
});

var zoom = String(CAMELIZER.setting("browser_zoom") || "1.0");

if (zoom.length == 1)
  zoom += ".0";

$("#browser_zoom").val(zoom);

$("#browser_zoom").change(function (e) {
  var elm = $(e.currentTarget);
  CAMELIZER.setting("browser_zoom", elm.val());
  save_settings();
  set_zoom();
});

$("#privlink").attr("href", first_run_url() + "&reason=privacy");
  
  // grab the current url and process it
  browser.tabs.query({active: true, currentWindow: true}).then(function(tab) {
    tab = tab[0];
    CAMELIZER.ephemeral("current_tab_url", tab.url);
    parse_amazon_url_and_update_ui();
  }, function(err) {
    dmsg("Error");
    dmsg(err);
    // show some error msg
  });
}

load_settings(continue_loading); // calls the continue_loading() function above