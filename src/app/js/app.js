angular.module("zwiftWorkoutApp", [])
    .controller("appController", ["$scope", "stepsService", "xmlGeneratorService", function($scope, stepsService, xmlGeneratorService) {
        $scope.steps = stepsService.steps;

        $scope.workout = {
            author: "",
            title: "",
            description: ""
        };

        $scope.deleteStep = function(index) {
            stepsService.deleteStep(index);
        };

        $scope.addSteadyStateStep = function() {
            stepsService.addSteadyStateStep();
        };

        $scope.addWarmUp = function() {
            stepsService.addWarmUp();
        };

        $scope.addCoolDown = function() {
            stepsService.addCoolDown();
        };

        $scope.addDecreasingStep = function() {
            stepsService.addDecreasingStep();
        };

        $scope.addIncreasingStep = function() {
            stepsService.addIncreasingStep();
        };

        $scope.moveUp = function(index) {
            stepsService.moveUp(index);
        };

        $scope.moveDown = function(index) {
            stepsService.moveDown(index);
        };

        $scope.generateXmlOutput = function() {
            $scope.xml = xmlGeneratorService.generateXml($scope.workout, stepsService.steps);
        };
    }]);


