App.filter('requireAction', function() {
  return function(items) {
	 return items.filter(item => item.isActionRequired );
  };
});
