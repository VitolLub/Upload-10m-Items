(function() {
  var input = document.getElementById("ASIN");
  
  if (!input || input.value == null || input.value == "")
    return({"asin": null});
  
  var asin = input.value;
  return {"asin": asin};
})();
