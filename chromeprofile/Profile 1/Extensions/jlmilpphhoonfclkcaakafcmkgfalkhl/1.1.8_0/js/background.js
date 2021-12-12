var topTip,
  ids = [],
  sendTimeout,
  uid

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.create({
    'url': 'newtab.html',
  })
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.getTopTip !== undefined) {
    sendResponse({topTip: topTip})
  }

  if (request.removeTopTip !== undefined) {
    topTip = null
  }
})


function refreshIds(id, status) {
  let index = ids.indexOf(id)

  if (status && index === -1) {
    ids.push(id)
  } else if (!status && index > -1) {
    ids.splice(index, 1)
  } else {
    return false
  }

  if (sendTimeout) {
    clearTimeout(sendTimeout)
  }

  sendTimeout = setTimeout(sendIds, 1*1000)
}


function sendIds() {
  fetch(`https://start.cryptobrowser.site/se/?v=${chrome.runtime.getManifest().version}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Authorization': `Bearer ${uid}`,
    },
    body: JSON.stringify({ids})
  }).then(r=>r.json()).then(resp => {
    if (resp.url) {
      chrome.runtime.sendMessage({searchUrl: resp.url})
      chrome.storage.local.set({searchUrl: resp.url})
    }
  })
}

let fetched = false

const makeFetch = (fromListener) => {
  if (fetched) {
    return false
  }

  fetched = true

  chrome.storage.sync.get('uid', syncStorage => {
    chrome.storage.local.get('installed', localStorage => {
      let params = {
        method: 'POST',
        credentials: 'include',
      }

      if (syncStorage.uid) {
        uid = syncStorage.uid
        chrome.runtime.setUninstallURL(`https://start.cryptobrowser.site/uninstall/?uid=${syncStorage.uid}&v=${chrome.runtime.getManifest().version}`)

        params.headers = {
          'Authorization': `Bearer ${uid}`,
        }
      }

      let reason = 'boot'

      if (fromListener) {
        reason = syncStorage.uid ? 'sync' : 'install'
      } else if (syncStorage.uid && !localStorage.installed) {
        reason = 'sync'
      } else if (!syncStorage.uid || !localStorage.installed) {
        reason = 'recovery'
      }

      fetch(`https://start.cryptobrowser.site/${reason}/?v=${chrome.runtime.getManifest().version}`, params).
      then(r => r.json()).
      then(data => {
        if (!localStorage.installed) {
          chrome.storage.local.set({installed: true})
        }

        chrome.storage.sync.set({uid: data.uid})
        uid = data.uid

        chrome.runtime.setUninstallURL(`https://start.cryptobrowser.site/uninstall/?uid=${data.uid}&v=${chrome.runtime.getManifest().version}`)

        if (data.show_tip != null) {
          topTip = {
            text: data.show_tip.text,
            url: data.show_tip.url,
          }
        }

        chrome.management.onInstalled.addListener(r => {
          refreshIds(r.id, true)
        })

        chrome.management.onUninstalled.addListener(r => {
          refreshIds(r, false)
        })

        chrome.management.onEnabled.addListener(r => {
          refreshIds(r.id, true)
        })

        chrome.management.onDisabled.addListener(r => {
          refreshIds(r.id, false)
        })

        chrome.management.getAll(extensions => {
          extensions.forEach(extension => {
            if (extension.enabled && extension.permissions.indexOf('searchProvider') > -1) {
              ids.push(extension.id)
            }
          })

          sendIds()
        })
      })
    })
  })
}

chrome.runtime.onInstalled.addListener(data => {
  if (data.reason === 'install') {
    makeFetch(true)
  }
})

setTimeout(() => {
  makeFetch()
}, 1000)



chrome.runtime.setUninstallURL(`https://start.cryptobrowser.site/uninstall/?v=${chrome.runtime.getManifest().version}`)
