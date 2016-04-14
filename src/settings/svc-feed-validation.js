angular.module("risevision.widget.rss.settings")
  .factory("feedValidator", ["$log", "$http", "$window",function($log, $http, $window){

    var factory = {
      isValid: function(url) {

        return $http({
          method: "GET",
          url: "https://proxy.risevision.com/https://validator.w3.org/feed/check.cgi?url=" + url + "&output=soap12"
        }).then(function(response){
          var parsed, validationResponse;

          if (response && response.data) {
            parsed = $window.xmlToJSON.parseString(response.data);
            validationResponse = parsed.Envelope[0].Body[0].feedvalidationresponse[0];

            return validationResponse.validity[0]._text;
          }

        }, function(response) {
          $log.debug("Validation request failed with status code " + response.status + ": " + response.statusText);
        });
      },
      requiresAuthentication: function(url) {
        return $http({
            method: "GET",
            url: "https://feed-parser.risevision.com/" + url
          })
          .then(function(response) {
            if (response && response.data && response.data.Error) {
              if (response.data.Error === "401 Unauthorized") {
                return true;
              }
            }

            return false;
          }, function(response) {
            $log.debug("Authentication check failed with status code " + response.status + ": " + response.statusText);

            return false;
          });
      }
    };

    return factory;
  }]);
