var myApp = angular.module('chirpApp', ['ngRoute', 'ngResource']).run(function($http, $rootScope, $location) {
	$rootScope.authenticated = false;
	$rootScope.current_user = 'Guest';

	$rootScope.logout = function(){
		$http.get('auth/signout');
		$rootScope.authenticated = false;
		$rootScope.current_user = 'Guest';
	};

	$rootScope.loggedIn = function() {
		$http.post('/auth/isloggedIn').success(function(data) {
			if(data.state == 'success') {
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				$location.path('/');
			}
			else {
				$rootScope.authenticated = false;
				$rootScope.current_user = '';
				$location.path('/');
			}
		});
	};

	$rootScope.loggedIn();

	//$http.get('auth/auth');
});

myApp.config(function($routeProvider){
	$routeProvider
	//the timeline display
		.when('/', {
			templateUrl: 'main.html',
			controller: 'mainController'
		})
		//the login display
		.when('/login', {
			templateUrl: 'login.html',
			controller: 'authController'
		})
		//the signup display
		.when('/signup', {
			templateUrl: 'register.html',
			controller: 'authController'
		});
});

myApp.factory('postService', function($resource){
	return $resource('/api/posts/:id');
});

myApp.factory('userService', function($resource){
	return $resource('/api/users');
});

myApp.controller('mainController', function( $scope, postService, userService, $rootScope ){

	$scope.posts = postService.query();
	$scope.users = userService.query();
	console.log($scope.users);
	$scope.newPost =
	{
		created_by : '',
		text : '',
		created_at : '',
		category: ''
	};

	$scope.categories = ['auto', 'moto'];

	$scope.addPost = function() {
		// set the value time that have not been created in yet in the dom
		$scope.newPost.created_by = $rootScope.current_user;
		$scope.newPost.created_at = Date.now();
		// push the post we've created to the posts array
		postService.save($scope.newPost, function(){
			$scope.posts = postService.query();
			$scope.newPost = {created_by: '', text: '', created_at: '', category: ''};
		});
	};

	$scope.delete = function(post)	{
		console.log(post);
		postService.delete({id: post._id});
		$scope.posts = postService.query();
	};
});

myApp.controller('authController', function($scope, $rootScope, $http, $location) {

	// initialize the user
	$scope.user = {username: '', password: ''};
	$scope.error_message = '';

	$scope.login = function () {
		//placeholder until authentication is implemented
		$http.post("/auth/login", $scope.user).success(function(data){
			if(data.state == 'success') {
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				$location.path('/');
			}
			else {
				$scope.error_message = data.message;
			}
		});

	};

	$scope.register = function () {
		//placeholder until authentication is implemented
		$http.post("/auth/signup", $scope.user).success(function(data){
			if(data.state == 'success') {
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				$location.path('/');
			}
			else {
				$scope.error_message = data.message;
			}
		});
	};

});
