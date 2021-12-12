(function() {
  var out = {
    "error": null,
  };
  
  try {
    document.getElementById("options").style.display = "";
    document.getElementById("camelizer_version").innerHTML = c3_version;
    document.getElementById("allow_analytics").checked = c3_allow;
    document.getElementById("allow_analytics").addEventListener("change", function (e) {
      browser.runtime.sendMessage({"allow_analytics": e.currentTarget.checked});
    });
  } catch(e) {
    out["error"] = e.message + "\n" + e.stack;
  }
  
  return(out);
})();
