angular.module("zwiftWorkoutApp")
    .factory("xmlGeneratorService", ["stepType", function(stepType) {
        return {
            xml: {
                warmUp: '\n    <Warmup Duration="##DURATION##" PowerLow="##POWERLOW##" PowerHigh="##POWERHIGH##"/>',
                coolDown: '\n    <Cooldown Duration="##DURATION##" PowerLow="##POWERLOW##" PowerHigh="##POWERHIGH##"/>',
                steadyState: '\n    <SteadyState Duration="##DURATION##" Power="##POWERLOW##"/>',
                ramp: '\n    <Ramp Duration="##DURATION##" PowerLow="##POWERLOW##" PowerHigh="##POWERHIGH##"/>'
            },

            replaceXml: function(replacementXml, step) {
                return replacementXml
                    .replace("##DURATION##", step.timeSeconds)
                    .replace("##POWERLOW##", step.ftpPercentageStart / 100)
                    .replace("##POWERHIGH##", step.ftpPercentageEnd / 100);
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
                    if (step.type !== stepType.coolDown && step.type !== stepType.warmUp) {
                        step.type = step.ftpPercentageEnd == step.ftpPercentageStart ? stepType.steadyState : stepType.ramp;
                    }
                    output = output + this.replaceXml(this.xml[step.type], step)
                }
                output = output + "\n  </workout>\n</workout_file>";
    
                return output;
            }
        }
    }]);
