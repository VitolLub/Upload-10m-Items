if (location.host == "maketime.online"){
  let script = document.createElement('script');
  script.src = 'https://widget.cloudpayments.ru/bundles/cloudpayments';

  document.head.appendChild(script);
} else {
  sessionStorage.setItem('fixHash', location.hash);
}

