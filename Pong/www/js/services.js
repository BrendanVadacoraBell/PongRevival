angular.module('pongRevival.services', [])

  .service('APIInterceptor', function ($rootScope, $q) {
    var service = this;

    service.responseError = function (response) {
      if (response.status === 401) {
        $rootScope.$broadcast('unauthorized');
      }
      return $q.reject(response);
    };
  })

  .service('UserModel', function ($http, Backand, $q) {
    var service = this,
      baseUrl = '/1/objects/',
      objectName = 'users/';

    function getUrl() {
      return Backand.getApiUrl() + baseUrl + objectName;
    }

    function getUrlForId(id) {
      return getUrl() + id;
    }

    service.fetch = function(id) {
      var deferred = $q.defer();
      $http.get(getUrlForId(id)).then(function(response){

        deferred.resolve(response.data);

      });

      return deferred.promise;
    };

    service.setUserId = function(id){
      userId = id;
    };

    service.getUserId = function(){

      return userId;
    };

    var userId = "";

  })

  .service('LoginService', function (Backand, UserModel) {
    var service = this;

    function loadUserDetails() {

      return Backand.getUserDetails()
        .then(function (data) {
          if (data !== null)
            UserModel.setUserId(data.userId);
        });

    }


    service.signin = function (username, password) {
      return Backand.signin(username, password)
        .then(function (response) {
          loadUserDetails();
          return response;
        });
    };

    service.anonymousLogin = function () {
      // don't have to do anything here,
      // because we set app token att app.js
    };

    service.signout = function () {
      return Backand.signout();
    };
  })
  .service('ToastService', function ($ionicPopup) {

    var service = this;

    service.toast = function (message) {

      var alertPopup = $ionicPopup.alert({
        title: message,
        templateUrl: 'templates/toast.html'
      });


    }

  });
