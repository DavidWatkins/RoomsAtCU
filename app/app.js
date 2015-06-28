'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', ['ngMaterial', 'ngRoute'])

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
                when('/', {
                    templateUrl: 'views/room_information.html',
                    controller: function() {}
                }).
                when('/form', {
                    templateUrl: 'views/form.html',
                    controller: function() {}
                }).
                otherwise({
                    redirectTo: '/'
                });
        }])

    .service('restService', ['$http', function($http){

        this.makeGETRequest = function(URL, successFunction, failureFunction){

            $http.get(URL)
                .success(function(data, status, headers, config) {
                    successFunction(data, status, headers, config);
                }).
                error(function(data, status, headers, config) {
                    failureFunction(data, status, headers, config);
                });
        };

        this.makePOSTRequest = function(URL, data, successFunction, failureFunction){

            $http.post(URL, data)
                .success(function(data, status, headers, config) {
                    console.log('post success');
                    successFunction(data, status, headers, config);
                }).
                error(function(data, status, headers, config) {
                    failureFunction(data, status, headers, config);
                });
        };

        var onRoomSelectedSuccess, onRoomSelectedFailure;

        this.registerOnRoomSelectedCallback = function(successFunction, failureFunction){
            console.log('callbacks registered');
            onRoomSelectedSuccess = successFunction;
            onRoomSelectedFailure = failureFunction;
        };

        this.onRoomSelected = function(data){
            this.makePOSTRequest('/getRoomInformation', data, onRoomSelectedSuccess, onRoomSelectedFailure);
        }
    }])

    .controller('sidenavCtrl', ['$scope', '$location','restService', function($scope, $location, restService){

        $scope.roomRegistry = null;

        var prevSelectedBuilding = null;
        var prevSelectedFloor = null;
        var prevSelectedRoom = null;

        $scope.onRoomSelected = function(){

            if($scope.selectedBuilding === undefined ||
               $scope.selectedFloor === undefined ||
               $scope.selectedRoom === undefined || (
               $scope.selectedBuilding === prevSelectedBuilding &&
               $scope.selectedFloor === prevSelectedFloor &&
               $scope.selectedRoom === prevSelectedRoom ) ||
               !(($scope.roomRegistry[$scope.selectedBuilding])[$scope.selectedFloor].indexOf($scope.selectedRoom) > -1)){
                return;
            }

            prevSelectedBuilding = $scope.selectedBuilding;
            prevSelectedFloor = $scope.selectedFloor;
            prevSelectedRoom = $scope.selectedRoom;

            $location.url('/');
            restService.onRoomSelected({ building: $scope.selectedBuilding, floor: $scope.selectedFloor, room: $scope.selectedRoom });
        };

        $scope.getBuildings = function(){
            if($scope.roomRegistry === null || $scope.roomRegistry === undefined){
                return [];
            }

            return Object.keys($scope.roomRegistry);
        };

        $scope.getFloors = function(){

            if($scope.roomRegistry === null || $scope.selectedBuilding === undefined){
                return [];
            }

            return Object.keys($scope.roomRegistry[$scope.selectedBuilding]);
        };

        $scope.getRooms = function(){
            if($scope.roomRegistry === null || $scope.selectedBuilding === undefined || $scope.selectedFloor === undefined){
                return [];
            }

            return ($scope.roomRegistry[$scope.selectedBuilding])[$scope.selectedFloor];
        };

        $scope.addReview = function(){
            $location.url('/form');
        };

        var init = function(){
            restService.makeGETRequest('/getRoomRegistry',
                function(data) {
                    $scope.roomRegistry = data;
                },
                function(data, status){
                    console.log('Error in /getRoomRegistry. Error code ' + status);
                }
            );
        };

        init();

    }])

    .controller('roomInformationCtrl', ['$scope', 'restService', function($scope, restService){

        $scope.reviews = [{
                title: 'Review 1',
                review: 'Whatever, I lived here for a year. It was okay I guess.',
                getHeader: function(){ return this.title; },
                getReview: function() {return this.review; }
            }];


        $scope.getRoomTitle = function(){
            if($scope.roomInformation === undefined || $scope.roomInformation === null){
                return '';
            }

            return $scope.roomInformation.building + ' ' + $scope.roomInformation.room;
        };

        $scope.getImgSrc = function(){
            if($scope.roomInformation === undefined){
                return '';
            }

            return 'buildings/' + $scope.roomInformation.building + '/' + $scope.roomInformation.floor + '/floor_plan.jpg';
        };

        var init = function(){
            restService.registerOnRoomSelectedCallback(
                function(data){
                    $scope.roomInformation = data;
                },
                function(data, status){
                    console.log('Error in /getRoomInformation. Error code ' + status);
                }
            )
        };

        init();


    }])

    .controller('formCtrl', ['$scope', '$location', 'restService', function($scope, $location, restService){

        $scope.getBuildings = function() {
            if($scope.roomRegistry === null || $scope.roomRegistry === undefined){
                return [];
            }

            return Object.keys($scope.roomRegistry);
        };

        $scope.getFloors = function() {

            if($scope.roomRegistry === null || $scope.user === undefined ||  $scope.user.building === undefined){
                return [];
            }

            return Object.keys($scope.roomRegistry[$scope.user.building]);
        };

        $scope.getRooms = function() {
            if($scope.roomRegistry === null || $scope.user === undefined || $scope.user.building === undefined || $scope.user.floor === undefined){
                return [];
            }

            return ($scope.roomRegistry[$scope.user.building])[$scope.user.floor];
        };

        var years = [
            {
                text: 'Freshman',
                pointValue: 'N/A'
            },
            {
                text: 'Sophomore',
                pointValue: '10'
            },
            {
                text: 'Junior',
                pointValue: '20'
            },
            {
                text: 'Senior',
                pointValue: '30'
            }
        ];
        $scope.getYears = function(){
            return years;
        };

        $scope.cancel = function() {
            $location.url('/');
        };

        $scope.submitForm = function() {
            $scope.showValidationMessages = true;
            console.log($scope.user);
        };

        var init = function(){
            restService.makeGETRequest('/getRoomRegistry',
                function(data) {
                    $scope.roomRegistry = data;
                },
                function(data, status){
                    console.log('Error in /getRoomRegistry. Error code ' + status);
                }
            );
        };

        init();


    }]);

