// Ionic template App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'SimpleRESTIonic' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('pongRevival', ['ionic', 'backand', 'pongRevival.controllers', 'pongRevival.services'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleLightContent();
      }
    });
  })
  .config(function (BackandProvider, $stateProvider, $urlRouterProvider, $httpProvider) {

    BackandProvider.setAppName('pongrevival'); // change here to your app name
    BackandProvider.setSignUpToken('378b008d-738f-4082-97cf-4943df9dd633'); //token that enable sign up. see http://docs.backand.com/en/latest/apidocs/security/index.html#sign-up
    BackandProvider.setAnonymousToken('0b4cde06-279a-406a-8377-bdcf76d63cc8'); // token is for anonymous login. see http://docs.backand.com/en/latest/apidocs/security/index.html#anonymous-access

    $stateProvider
    // setup an abstract state for the tabs directive
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginController as login',
        cache: false
      })
      .state('leaderBoard', {
        url: '/leaderBoard',
        templateUrl: 'templates/leaderBoard.html',
        cache: false
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'templates/profile.html',
        controller: 'UserController as user',
        cache: false,
        resolve: {
          userData: function (UserModel) {
            return UserModel.fetch(UserModel.getUserId());
          }
        }
      })
      .state('tableOpen', {
        url: '/tableOpen',
        templateUrl: 'templates/tableOpen.html',
        cache: false
      })
      .state('tableTaken', {
        url: '/tableTaken',
        templateUrl: 'templates/tableTaken.html',
        cache: false
      });

    $urlRouterProvider.otherwise('/login');

    $httpProvider.interceptors.push('APIInterceptor');
  })

  .run(function ($rootScope, $state, LoginService, Backand) {

    function unauthorized() {
      console.log("user is unauthorized, sending to login");
      $state.go('tab.login');
    }

    function signout() {
      LoginService.signout();
    }

    $rootScope.$on('unauthorized', function () {
      unauthorized();
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState) {
      if (toState.name == 'tab.login') {
        signout();
      }
      else if (toState.name != 'tab.login' && Backand.getToken() === undefined) {
        unauthorized();
      }
    });

  })

