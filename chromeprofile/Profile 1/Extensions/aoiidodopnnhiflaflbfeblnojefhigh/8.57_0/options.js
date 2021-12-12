if (chrome) {
  var browser = chrome;
}

function allStorageSet(items, callback) {
  var storage = (browser.storage || {}).sync;
  var fn = (typeof callback === 'function') ? callback : (function () {});
  if (typeof items === 'object') {
    storage && storage.set(items, fn);
    var keys = Object.keys(items);
    keys.forEach(function (key) {
      localStorage.setItem(key, JSON.stringify(items[key]));
    });
  }
}

function allStorageGet(callback, key) {
  var storage = (browser.storage || {}).sync;
  var fn = (typeof callback === 'function') ? callback : (function () {});

  function parseLocalStorage() {
    var merged = {};
    for (var i = 0; i < localStorage.length; i++) {
      try {
        merged[localStorage.key(i)] = JSON.parse(localStorage.getItem(localStorage.key(i)));
      } catch (e) {}
    }
    return merged;
  }

  if (storage) {
    storage.get(function (local) {
      var merged = parseLocalStorage();
      var keys = Object.keys(local);
      keys.forEach(function (key) {
        local[key] && (merged[key] = local[key]);
      });
      fn(key ? local[key] : local);
    });
  } else {
    var merged = parseLocalStorage();
    fn(key ? merged[key] : merged);
  }
}
// Saves options to storage.
function save_options() {
  var select = document.getElementById("country");
  var country = select.children[select.selectedIndex].value;
  allStorageSet({country: country}, function () {
    allStorageGet(function(local) {
      // Update status to let user know options were saved.
      var status = document.getElementById("status");
      status.innerHTML = "Options saved successfully";
      setTimeout(function() {
        status.innerHTML = "";
      }, 750);

      // Persist change
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if(xhr.readyState == 4) {
          // Reload parser
          browser.runtime.sendMessage({action:"reloadParser", url: "options.html"});
        }
      }
      xhr.open("GET", "http://tb.priceblink.com/universal_scrapes.php?uid=" + local.uid + "&browser=chrome&ver=" + local.version + "&action=u&country_pref=" + local.country + "&n=" + new Date().getMilliseconds(), true);
      xhr.send();
    });
  });
}

// Restores select box state to saved value from storage.
function restore_options() {
  allStorageGet(function (local) {
    var country = local["country"];
    if (!country) {
      return;
    }
    var select = document.getElementById("country");
    for (var i = 0; i < select.children.length; i++) {
      var child = select.children[i];
      if (child.value == country) {
        child.selected = "true";
        break;
      }
    }
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
