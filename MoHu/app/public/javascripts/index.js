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
			templateUrl: 'login,html',
			controller: loginCtrl
		}).
		when('/register', {
			templateUrl: 'register.html',
			controller: registerCtrl
		}).
		when('/mohu', {
			templateUrl: 'index.html',
			controller: postCtrl
		}).
		when('/post/add', {
			templateUrl: 'add.thml',
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

function loginCtrl ($scope, $http, $location, $cookies) {
	var loginSuc = $cookies.get('loginSuc');
	if(loginSuc == '1'){
		$location.url('/mohu');
	}
	$scope.form = {};

	$scope.form.submit = function () {
		$http.post('/', $scope.form).success(function (data) {
			if (data.err) {
				return $scope.err = data.err;
			}
			$cookies.put('loginSuc', '1');
			$cookies.put('username', data.username);
			$location.url('/mohu');
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
			$location.url('/');
		});
	};
}

function postCtrl ($scope, $http) {
	$http.get('/mohu').success(function (data) {
		$scope.posts = data;
	});
}

function addCtrl ($scope, $http, $location, $cookies) {
	$scope.form = {};
	$scope.form.writer = $cookies.get('username');

	$scope.form.submit = function () {
		$http.post('/post/add', $scope.form).success(function() {
			$location.url('/mohu');
		});
	};
}

function contentCtrl ($scope, $http, $routeParams, $cookies) {
	$http.get('/post/' + $routeParams._id).success(function (data) {
		$scope.post = data;
	});

	$scope.form = {};
	$scope.form.writer = $cookies.get('username');

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

