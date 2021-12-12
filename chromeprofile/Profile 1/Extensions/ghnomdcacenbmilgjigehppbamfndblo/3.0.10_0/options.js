function read_storage(keys)
{
  
  try {
    var getting = browser.storage.sync.get(keys);
    return(getting);
  } catch (e) {
  }
  
    
  return(browser.storage.local.get(keys));
}

function write_storage(key, val)
{
  obj = {};
  obj[key] = val;
  browser.storage.local.set(obj);
  
  try {
    browser.storage.sync.set(obj);
  } catch (e) {  }
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("privlink").href = first_run_url() + "&reason=privacy";
  
  read_storage(["allow_analytics", "browser_zoom"]).then(function(data) {
    data["browser_zoom"] = data["browser_zoom"] || "1.0";
    var checkbox = document.getElementById("allow_analytics");
    
    checkbox.checked = data["allow_analytics"];
    checkbox.style.marginTop = "1rem";
  
    checkbox.addEventListener("change", function (e) {
      var allow_analytics = e.currentTarget.checked;
      write_storage("allow_analytics", allow_analytics);
    });
    
    
      var select = document.getElementById("browser_zoom");
      
      for (var i = 0; i < select.options.length; i++)
      {
        var opt = select.options[i];
        opt.selected = parseFloat(opt.value) == parseFloat(data["browser_zoom"]);
      }
      
      select.addEventListener("change", function (e) {
        var browser_zoom = e.currentTarget.value;
        write_storage("browser_zoom", browser_zoom);
      });
    
  });
});