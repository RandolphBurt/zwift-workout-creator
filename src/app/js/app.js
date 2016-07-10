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
    }])

    .factory("stepsService", function() {
        return {
            steps: [],

            createStep: function() {
                return {
                    ftpPercentageStart: 100,
                    ftpPercentageEnd: 100,
                    timeSeconds: 60
                };
            },

            addSteadyStateStep: function() {
                var newStep = this.createStep();
                if (this.steps.length > 0) {
                    newStep.ftpPercentageStart = this.steps[this.steps.length - 1].ftpPercentageEnd;
                    newStep.ftpPercentageEnd = newStep.ftpPercentageStart;
                }
                this.steps.push(newStep);
            },

            addDecreasingStep: function() {
                var newStep = this.createStep();
                if (this.steps.length > 0) {
                    newStep.ftpPercentageStart = this.steps[this.steps.length - 1].ftpPercentageEnd;
                    newStep.ftpPercentageEnd = newStep.ftpPercentageStart / 2;
                } else {
                    newStep.ftpPercentageEnd = 50;
                }
                this.steps.push(newStep);
            },

            addIncreasingStep: function() {
                var newStep = this.createStep();
                if (this.steps.length > 0) {
                    newStep.ftpPercentageStart = this.steps[this.steps.length - 1].ftpPercentageEnd;
                    newStep.ftpPercentageEnd = newStep.ftpPercentageStart * 2;
                } else {
                    newStep.ftpPercentageStart = 50;
                }
                this.steps.push(newStep);
            },

            deleteStep: function(index) {
                this.steps.splice(index, 1);
            },

            moveUp: function(index) {
                if (index > 0) {
                    var item = this.steps.splice(index, 1);
                    this.steps.splice(index - 1, 0, item[0]);
                }
            },
            
            moveDown: function(index) {
                if (index < this.steps.length - 1) {
                    var item = this.steps.splice(index, 1);
                    this.steps.splice(index + 1, 0, item[0]);
                }
            }
        }
    })

    .factory("xmlGeneratorService", [function() {
        return {
            warmUpXml: '\n    <Warmup Duration="##DURATION##" PowerLow="##POWERLOW##" PowerHigh="##POWERHIGH##"/>',
            coolDownXml: '\n    <Cooldown Duration="##DURATION##" PowerLow="##POWERLOW##" PowerHigh="##POWERHIGH##"/>',
            steadyStateXml: '\n    <SteadyState Duration="##DURATION##" Power="##POWERLOW##"/>',

            replaceXml: function(replacementXml, step) {
                return replacementXml
                    .replace("##DURATION##", step.timeSeconds)
                    .replace("##POWERLOW##", step.ftpPercentageStart)
                    .replace("##POWERHIGH##", step.ftpPercentageEnd);
            },

            generateXml: function(workout, steps) {
                var output = "<workout_file>" +
                    "\n  <author>" +
                    workout.author +
                    "</author>" +
                    "\n  <name>" +
                    workout.title +
                    "</name>" +
                    "\n  <description>" +
                    workout.description +
                    "</description>" +
                    "\n  <tags></tags>" +
                    "\n  <workout>";

                for (var i = 0; i < steps.length; i++) {
                    var step = steps[i];
                    if (step.ftpPercentageStart < step.ftpPercentageEnd) {
                        output = output + this.replaceXml(this.warmUpXml, step);
                    } else if (step.ftpPercentageStart > step.ftpPercentageEnd) {
                        output = output + this.replaceXml(this.coolDownXml, step);
                    } else {
                        output = output + this.replaceXml(this.steadyStateXml, step);
                    }
                }
                output = output + "\n  </workout>\n</workout_file>";

                return output;
            }
        }
    }]);
