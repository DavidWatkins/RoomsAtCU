'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', ['ngMaterial', 'ngRoute'])

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
                when('/', {
                    template: '',
                    controller: function() {}
                }).
                when('/review', {
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

    .service('roomService', ['$http', '$location', function($http, $location){

        var self = this;

        this.roomRegistry = {};
        this.selectedRoom = null;
        this.roomInformation = null;

        this.years = [ { text: 'Freshman', pointValue: 'N/A' }, { text: 'Sophomore', pointValue: '10' }, { text: 'Junior', pointValue: '20'}, { text: 'Senior', pointValue: '30'} ];


        var loadRoomRegistry = function(){
            $http.get('/getRoomRegistry')
                .success(function(data, status, headers, config) {
                    self.roomRegistry = data;
                }).
                error(function(data, status, headers, config) {
                    console.log('Failed to load room registry. Received error code ' + status);
                });
        };

        var loadRoomInformation = function(){

            if(self.selectedRoom === undefined || self.selectedRoom === null ||
                self.selectedRoom.building === undefined || self.selectedRoom.floor === undefined ||
                self.selectedRoom.room === undefined){
                console.log('loadRoomInformation called when selected room was ' + self.selectedRoom);
            }

            $http.post('/getRoomInformation', self.selectedRoom)
                .success(function(data, status, headers, config) {
                    self.roomInformation = data;
                    $location.url('/review');
                }).
                error(function(data, status, headers, config) {
                    console.log('Failed to load room informaation. Received error code ' + status);
                });
        };

        this.startReview = function(){
            $location.url('/form');
        };

        this.housekeeping = function(){
            $location.url('/');
        };

        this.submitForm = function(form){

            $http.post('/addReview', form)
                .success(function(data, status, headers, config) {
                    self.loadRoomRegistry();
                }).
                error(function(data, status, headers, config) {
                    console.log('Failed to submit form. Received error code ' + status);
                });
        };

        this.setSelectedRoom = function(building, floor, room){
            this.selectedRoom = {
                building: building,
                floor: floor,
                room: room
            };
            loadRoomInformation();
        };


        loadRoomRegistry();

    }])

    .controller('sidenavCtrl', ['$scope','roomService', function($scope, roomService){

        var isDefined = function(obj){
            return ((obj === undefined || obj === null) ? false : true);
        };

        $scope.getBuildings = function(){
            return isDefined(roomService.roomRegistry) ? Object.keys(roomService.roomRegistry) : [];
        };

        $scope.buildingSelected = function(){
            $scope.selectedFloor = undefined;
            $scope.selectedRoom = undefined;
        };

        $scope.getFloors = function(){
            return (isDefined(roomService.roomRegistry) && isDefined($scope.selectedBuilding)) ?
                Object.keys(roomService.roomRegistry[$scope.selectedBuilding]) : [];
        };

        $scope.floorSelected = function(){
            $scope.selectedRoom = undefined;
        };

        $scope.getRooms = function(){
            return (isDefined(roomService.roomRegistry) && isDefined($scope.selectedBuilding) && isDefined($scope.selectedFloor)) ?
                (roomService.roomRegistry[$scope.selectedBuilding])[$scope.selectedFloor] : [];
        };

        $scope.roomSelected = function(){
            if( isDefined($scope.selectedBuilding) && isDefined($scope.selectedFloor) && isDefined($scope.selectedRoom)) {
                roomService.setSelectedRoom($scope.selectedBuilding, $scope.selectedFloor, $scope.selectedRoom);
            }
        };

        $scope.addReview = function(){
            roomService.startReview();
        };

    }])

    .controller('roomInformationCtrl', ['$scope', 'roomService', function($scope, roomService){

        var isDefined = function(obj){
            return ((obj === undefined || obj === null) ? false : true);
        };

        $scope.getRoomTitle = function(){
            if(!isDefined(roomService.roomInformation)){

                return '';
            }

            return roomService.roomInformation.building + ' ' + roomService.roomInformation.room;
        };

        $scope.getImgSrc = function(){
            if($scope.roomInformation === undefined){
                return '';
            }

            return 'floor_plans/' + $scope.roomInformation.building + '-' + $scope.roomInformation.floor + '.jpg';
        };

        if(roomService.roomInformation == null){
            roomService.housekeeping();
        }


    }])

    .controller('formCtrl', ['$scope', '$location', 'roomService', function($scope, $location, roomService){

        var isDefined = function(obj){
            return ((obj === undefined || obj === null) ? false : true);
        };

        $scope.getBuildings = function(){
            return isDefined(roomService.roomRegistry) ? Object.keys(roomService.roomRegistry) : [];
        };

        $scope.getFloors = function(){
            return (isDefined(roomService.roomRegistry) && isDefined($scope.form.building)) ?
                Object.keys(roomService.roomRegistry[$scope.form.building]) : [];
        };

        $scope.getRooms = function(){
            return (isDefined(roomService.roomRegistry) && isDefined($scope.form.building) && isDefined($scope.form.floor)) ?
                (roomService.roomRegistry[$scope.building])[$scope.floor] : [];
        };

        $scope.getYears = function(){
            return roomService.years;
        };

        $scope.cancel = function() {
            $location.url('/');
        };

        var formIsValid = function(){
            return false;
        };

        $scope.submitForm = function() {
            if(!formIsValid()){
                $scope.displayErrors = true;
                return;
            }
            roomService.submitForm($scope.form);
        };

        $scope.form = {};
        $scope.displayErrors = false;

    }]);

