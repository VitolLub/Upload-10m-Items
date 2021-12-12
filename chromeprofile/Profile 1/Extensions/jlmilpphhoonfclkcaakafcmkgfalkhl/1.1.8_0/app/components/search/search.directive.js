App.directive('search', function($http, $timeout, $document, $rootScope) {
	return {
		templateUrl: function(element, attrs) {
			return attrs.templateName ? '/app/components/search/' + attrs.templateName : '/app/components/search/search.view.html'
	   	},
		scope: {
			type: '@',
			placeholder: '@',
			value: '=',
			onSubmit: '&'
		},
		link: function(scope, element, attrs) {

			scope.activeSugg = -1;
			scope.searchUrl = 'https://search.cryptobrowser.site/?f=cts&q=%s';

			chrome.storage.local.get('searchUrl', storage => {
				if (storage) {
					scope.searchUrl = storage.searchUrl
				}
			})

			if (scope.value) {
				scope.inputValue = scope.value
			}

			$document.on('click keydown', function(event) {
                if (!closest(event.target, '.search-form') && !closest(event.target, '.input') || event.keyCode == 27) {
                    scope.showSuggestions = false;
					scope.$apply();
                }
 			});

 			chrome.runtime.onMessage.addListener(r=>{
 				if (r.searchUrl) {
 					scope.searchUrl = r.searchUrl
 				}
 			})

			scope.getSuggestions = function(){

				if (scope.inputValue) {

					scope.activeSugg = -1;

					switch(scope.type) {
						case 'web':
							scope.suggUrl = 'https://'+ MAIN_DOMAIN +'/api/suggestions/?q=' + encodeURIComponent(scope.inputValue);
							break;

						case 'cities':
							scope.suggUrl = 'https://'+ MAIN_DOMAIN +'/api/v2/city?q=' + encodeURIComponent(scope.inputValue);
							break;

                        default:
                            scope.suggUrl = 'https://'+ MAIN_DOMAIN +'/api/suggestions/?q=' + encodeURIComponent(scope.inputValue);
                            break;
					}

					$http.get(scope.suggUrl).then( function(response) {
						scope.suggestions = [];
						var maxSuggestions = 5;

						if (scope.type == 'cities') {
							if (maxSuggestions > response.data.length) maxSuggestions = response.data.length;

							for (var i=0; i<maxSuggestions; i++) {
								scope.suggestions.push({
									'name_hl': response.data[i].name_hl,
									'name': response.data[i].name,
									'country_name': response.data[i].country_name,
									'lon': response.data[i].coord.lon,
									'lat': response.data[i].coord.lat,
									'tz_offset': response.data[i].tz_offset || $rootScope.userTimezoneOffset
								});
							}

							scope.query = scope.inputValue;

						} else {

							if (maxSuggestions > response.data[1].length) {
                                maxSuggestions = response.data[1].length;
                            }

							for (var i=0; i < maxSuggestions; i++) {
								scope.suggestions.push(response.data[1][i]);
							}

							scope.query = scope.inputValue;
						}

						scope.showSuggestions = true;

					});

				} else {
					scope.suggestions = [];
					scope.showSuggestions = false;
				}
			}

			scope.submit = function(sugg) {
				if (scope.type == 'cities') {
					if (sugg) {
						scope.inputValue = sugg.name + ', ' + sugg.country_name;
						scope.onSubmit({city: sugg});
					} else if (scope.activeSugg != -1) {
						scope.value = scope.value;
						scope.onSubmit({city: scope.suggestions[scope.activeSugg]});
					}
					scope.showSuggestions = false;
				} else {

					var query = sugg || scope.inputValue;

					if (query != undefined && query.length > 0) {
						window.top.location = scope.searchUrl.replace('%s', encodeURIComponent(query));
					}
				}
			}

			scope.switchSugg = function(ev) {
				if (ev.keyCode != 40 && ev.keyCode != 38) return;
				ev.preventDefault();

				if (ev.keyCode == 40) {
					if (scope.activeSugg == (scope.suggestions.length-1)) return;
					scope.activeSugg++;

				} else if (ev.keyCode == 38) {
					if (scope.activeSugg == -1) return;
					scope.activeSugg--;
				}

				if (scope.activeSugg != -1) {
					if (scope.type == 'cities') {
						scope.inputValue = scope.suggestions[scope.activeSugg].name + ', ' + scope.suggestions[scope.activeSugg].country_name;
					} else {
						scope.inputValue = scope.suggestions[scope.activeSugg];
					}
				} else {
					scope.inputValue = scope.query;
				}
			}
		}
	}
});
