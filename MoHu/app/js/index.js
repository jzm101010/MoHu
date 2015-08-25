var app = angular.module('myapp', ['ngRoute', 'ngCookies']);

app.directive('focus', function () {
	return {
		restrict: 'A',
		link: function (scope, element, attr){
			element[0].focus();
		}
	}
});

app.config(['$routeProvider',function ($routeProvider) {
	$routeProvider.
		when('/', {
			templateUrl: 'login.html',
			controller: loginCtrl
		}).
		when('/register', {
			templateUrl: 'register.html',
			controller: registerCtrl
		}).
		when('/posts', {
			templateUrl: 'post.html',
			controller: postCtrl
		}).
		when('/post/add', {
			templateUrl: 'add.html',
			controller: addCtrl
		}).
		when('/post/:_id', {
			templateUrl: 'content.html',
			controller: contentCtrl
		}).
		otherwise({
			redirectTo: '/'
		});
}]);

function loginCtrl ($scope, $http, $location, $cookieStore) {
	var loginSuc = $cookieStore.get('loginSuc');
	if(loginSuc == '1'){
		$location.url('/posts');
	}
	$scope.form = {};

	$scope.form.submit = function () {
		$http.post('/', $scope.form).success(function (data) {
			console.log(data);
			if (data.err) {
				return $scope.err = data.err;
			}
			$cookieStore.put('loginSuc', '1');
			$cookieStore.put('username', data.username);
			$location.url('/posts');
		});
	};

	$scope.register = function () {
		$location.url('/register');
	}
}

function registerCtrl ($scope, $http, $location) {
	$scope.form = {};

	$scope.form.submit = function () {
		$http.post('/register', $scope.form).success(function (data) {
			if(data.err) {
				return $scope.err = data.err;
			}
			$location.url('/posts');
		});
	};
}

function postCtrl ($scope, $http) {
	$http.get('/posts').success(function (data) {
		console.log(data);
		$scope.posts = data;
	});
}

function addCtrl ($scope, $http, $location, $cookieStore) {
	$scope.form = {};
	$scope.form.writer = $cookieStore.get('username');

	$scope.form.submit = function () {
		$http.post('/post/add', $scope.form).success(function() {
			$location.url('/posts');
		});
	};
}

function contentCtrl ($scope, $http, $routeParams, $cookieStore) {
	$http.get('/post/' + $routeParams._id).success(function (data) {
		$scope.post = data;
	});

	$scope.form = {};
	$scope.form.writer = $cookieStore.get('username');

	$scope.form.submit = function() {
		$http.post('/post/' + $routeParams._id + '/comment', $scope.form).success(function () {
			$scope.post.comments.push({
				writer: $scope.writer,
				comment: $scope.form.comment
			});

			$scope.form.comment = '';
		});
	};
}

