angular.module("zwiftWorkoutApp")
    .factory("stepsService", ["stepType", function(stepType) {
        return {
            steps: [],

            addStep: function(type) {
                var newStep = {
                    ftpPercentageStart: 100,
                    ftpPercentageEnd: 100,
                    timeSeconds: 60,
                    type: type
                };
                this.steps.push(newStep);
                return newStep;
            },
            
            addStepFromPreviousStep: function(type, endFtpMultiplier) {
                var prevStep = this.steps.length > 0 ? this.steps[this.steps.length - 1] : null;
                var newStep = this.addStep(type);
                if (prevStep) {
                    newStep.ftpPercentageStart = prevStep.ftpPercentageEnd;
                    newStep.ftpPercentageEnd = newStep.ftpPercentageStart * endFtpMultiplier;
                }
                return newStep;
            },

            addWarmUp: function() {
                var newStep = this.addStep(stepType.warmUp);
                newStep.ftpPercentageStart = 25;
                newStep.ftpPercentageEnd = 75;
            },

            addCoolDown: function() {
                var newStep = this.addStep(stepType.coolDown);
                newStep.ftpPercentageStart = 75;
                newStep.ftpPercentageEnd = 25;
            },

            addSteadyStateStep: function() {
                this.addStepFromPreviousStep(stepType.steadyState, 1);
            },

            addDecreasingStep: function() {
                if (this.steps.length > 0) {
                    this.addStepFromPreviousStep(stepType.ramp, 0.5);
                } else {
                    this.addCoolDown();
                }
            },

            addIncreasingStep: function() {
                if (this.steps.length > 0) {
                    this.addStepFromPreviousStep(stepType.ramp, 2);
                } else {
                    this.addWarmUp();
                }
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
    }]);
