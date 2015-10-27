'use strict';

(function() {
    function lunarLander($window, $document) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'directives/lunar-lander/lunar-lander.html',
            controller: lunarLanderController,
            link: lunarLanderLink,
            scope: {
                difficulty: '=expDifficulty',
                currentLevel: '=expCurrentLevel',
                score: '=expScore'
            }
        };
    }

    var keyboard = {};
    function lunarLanderLink(scope, element, attrs) {
        var running = false;
        var currentLog = [];
        //class declerations
        keyboard = {
            _pressed: {},

            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,
            SPACE: 32,

            isDown: function(keyCode) {
                return this._pressed[keyCode];
            },

            onKeyDown: function(event) {
                this._pressed[event.keyCode] = true;
            },

            onKeyUp: function(event) {
                delete this._pressed[event.keyCode];
            }
        }

        window.addEventListener('keyup', function(event) { 
            keyboard.onKeyUp(event);
        }, false);
        window.addEventListener('keydown', function(event) { 
            if (event.keyCode === 32) {
                if (interval) {
                    pause();
                } else if (running) {
                    unpause();
                }
            }
            keyboard.onKeyDown(event);
        }, false);

        function world(edge) {
            this.edge = edge;

            this.draw = function(ctx) {
                ctx.save();
                ctx.strokeStyle = '#FC3A51';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(this.edge[0], this.edge[1]);
                ctx.lineTo(this.edge[2], this.edge[0]);
                ctx.lineTo(this.edge[2], this.edge[3]);
                ctx.lineTo(this.edge[0], this.edge[3]);
                ctx.lineTo(this.edge[0], this.edge[1]);
                
                ctx.stroke();

                ctx.fillStyle = '#ffffff';
                ctx.font = "16px Arial";
                ctx.fillText("FUEL:  " + craft.fuel, 20, 35);

                ctx.fillStyle = '#ffffff';
                ctx.font = "16px Arial";
                ctx.fillText("SCORE:  " + score, 20, 55);

                ctx.restore();
            }
        }

        function landingPad(loc, len) {
            this.loc = loc
            this.len = len

            this.draw = function(ctx) {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(this.loc[0], this.loc[1]);
                ctx.lineTo(this.loc[0] + this.len, this.loc[1]);
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth=10;
                ctx.stroke();
                ctx.restore();
            }
        }

        function ship(startLoc, startRotation, startFuel) {
            this.ROTATION_SPEED = 2.5;
            this.FUEL_PER_THRUST = 2;
            this.THRUST_POWER = 0.0135;
            this.THRUST_DEGRADE = 1;
            this.SIZE = 2;
            this.DEBUG = false;

            this.rotation = startRotation;
            this.fuel = startFuel;
            this.loc = startLoc;
            this.vec = normalize([1, 0]);

            this.tick = function() {
                //air resistence
                //var normVel = normalize(this.vec);
                //this.vec[0] -= normVel[0] * 0.01;
                //this.vec[1] -= normVel[1] * 0.01;

                //gravity
                this.vec[0] += GRAVITY_DIR[0] * GRAVITY_SCALE;
                this.vec[1] += GRAVITY_DIR[1] * GRAVITY_SCALE;

                this.loc[0] += this.vec[0];
                this.loc[1] += this.vec[1];
            }

            this.rotate = function(direction) {
                var rot = Math.PI*2/360 * this.ROTATION_SPEED;
                if (direction === 'left') {
                    rot *= -1;
                }

                this.rotation += rot;
            }

            this.collidesWithWorld = function(world) {
                var collision = false;
                var rotVec = rotateVec([1, 0], this.rotation);

                if ((this.loc[0] - 5 * this.SIZE) < world.edge[0]
                    ) {
                    collision = true;
                } else if((this.loc[0] + 5 * this.SIZE) > world.edge[2]) {
                    collision = true;
                } else if((this.loc[1] - 5 * this.SIZE) < world.edge[1]) {
                    collision = true;
                } else if ((this.loc[1] + 5 * this.SIZE) > world.edge[3]) {

                    collision = true;
                }

                return collision;
            }

            this.landedOnPlatform = function(platform) {
                var rotInLimit;
                var rotationConverted = (this.rotation/(Math.PI*2))%1
                if (rotationConverted > 0) {
                    rotInLimit = Math.abs(rotationConverted - 0.75) < 0.1;
                } else {
                    rotInLimit = Math.abs(rotationConverted + 0.25) < 0.1;
                }
                return vecLen(this.vec) < 0.9 &&
                       rotInLimit;
            }

            this.touchingPlatform = function(platform) {
                var collision = true;
                var rotVec = rotateVec([1, 0], this.rotation);
                if (((this.loc[0] + 5 * this.SIZE) >= platform.loc[0] &&
                     (this.loc[0] - 5 * this.SIZE) <= platform.loc[0] + platform.len &&
                     (this.loc[1] + 5 * this.SIZE) >= platform.loc[1] - 5 && 
                     (this.loc[1] - 5 * this.SIZE) <= platform.loc[1] + 5)) {
                       return platform;
                   } else {
                       return false;
                   }
            }

            this.thrust = function() {
                if (this.fuel >= this.FUEL_PER_THRUST) {
                    this.fuel -= this.FUEL_PER_THRUST;
                    var rotationVec = normalize(rotateVec([1, 0], this.rotation));
                    this.vec = [
                        this.vec[0] + rotationVec[0] * this.THRUST_POWER,
                        this.vec[1] + rotationVec[1] * this.THRUST_POWER,
                    ];
                }
            }

            this.draw = function(ctx) {
                //ship center
                ctx.save();
                ctx.translate(this.loc[0], this.loc[1]);

                ctx.beginPath();
                ctx.fillStyle = "#E8D5B9"
                ctx.arc(0, 0, 5 * this.SIZE,0,2*Math.PI);
                ctx.fill();
                ctx.stroke();

                //ship legs 
                ctx.beginPath();
                var rotVec = rotateVec([1, 0], this.rotation + (Math.PI*2)*0.4);
                ctx.lineWidth = 4;
                ctx.strokeStyle = "#E8D5B9"
                ctx.moveTo(0, 0);
                ctx.lineTo(rotVec[0] * 7 * this.SIZE, rotVec[1] * 7 * this.SIZE);
                var rotVec = rotateVec([1, 0], this.rotation + (Math.PI*2)*0.6);
                ctx.lineTo(rotVec[0] * 7 * this.SIZE, rotVec[1] * 7 * this.SIZE);
                ctx.lineTo(0, 0);
                ctx.fill();

                ctx.lineWidth = 1;

                if (keyboard.isDown(keyboard.UP) && craft.fuel > 0) { 
                    var thrustVec = rotateVec([1, 0], this.rotation + (Math.PI*2)*0.5);
                    var thrustVecLeft = rotateVec([1, 0], this.rotation + (Math.PI*2)*0.4);
                    var thrustVecRight = rotateVec([1, 0], this.rotation + (Math.PI*2)*0.6);
                    ctx.beginPath();
                    ctx.strokeStyle = 'rgba(255, 255, 255, ' + getRandomInt(20, 90)/100 + ')';
                    var thrustLength = getRandomInt(9, 15);
                    ctx.moveTo(thrustVec[0] * thrustLength * this.SIZE, thrustVec[1] * thrustLength * this.SIZE);
                    ctx.lineTo(thrustVecLeft[0] * 6 * this.SIZE, thrustVecLeft[1] * 6 * this.SIZE);
                    ctx.lineTo(thrustVecRight[0] * 6 * this.SIZE, thrustVecRight[1] * 6 * this.SIZE);
                    ctx.lineTo(thrustVec[0] * thrustLength * this.SIZE, thrustVec[1] * thrustLength * this.SIZE);
                    ctx.stroke();
                }

                //ship vel vec
                if (this.DEBUG) {
                    ctx.beginPath();
                    ctx.strokeStyle = "#F5B349"
                    ctx.arc(this.vec[0] * 10 * this.SIZE, this.vec[1] * 10 * this.SIZE, 3 * this.SIZE, 0, 2*Math.PI);
                    ctx.stroke();
                }

                ctx.restore();
            }
        }

        //helper functions
        function vecLen(vec) {
            return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
        }

        function normalize(vec) {
            var len = vecLen(vec);
            return [vec[0]/len, vec[1]/len];
        }

        function rotateVec(vec, rot) {
            var newVec = [
                vec[0] * Math.cos(rot) - vec[1] * Math.sin(rot),
                vec[0] * Math.sin(rot) + vec[1] * Math.cos(rot)
            ]
            return newVec;
        }

        //game play variables
        var GRAVITY_DIR = [0, 1];
        var GRAVITY_SCALE = 0.01;

        //main code
        var c = document.getElementById('lunarLander');
        var ctx = c.getContext('2d');

        var interval = false;
        function start() {
            startLevel(scope.currentLevel);
        }

        function unpause() {
            if (!interval) {
                interval = setInterval(tick, 16);
            }
        }

        function stop(message, done) {
            if (interval) {
                window.clearInterval(interval);
                interval = false;

                ctx.clearRect(0, 0, c.width, c.height);
                world.draw(ctx);
                ctx.fillStyle = '#ffffff';
                ctx.font = "16px Arial";
                ctx.fillText(message, c.width/2 - 60, c.height/2);

                setTimeout(done, 1000);
            }
        }

        function levelSuccess(done) {
            if (interval) {
                window.clearInterval(interval);
                interval = false;
                var fuelScore = craft.fuel;
                var landingSpeedScore = Math.floor(100 * (1-vecLen(craft.vec)));
                var rotationScore = Math.floor(100 * (1-Math.abs(Math.abs((craft.rotation/(Math.PI*2))%1)-0.75)))
                var levelScore = fuelScore + landingSpeedScore + rotationScore;

                ctx.fillStyle = '#ffffff';
                ctx.font = "16px Arial";
                ctx.fillText("Fuel: +" + fuelScore, c.width/2 - 60, c.height/2+20);
                ctx.fillText("Landing Speed: +" + landingSpeedScore, c.width/2 - 60, c.height/2+40);
                ctx.fillText("Rotation: +" + rotationScore, c.width/2 - 60, c.height/2 + 60);

                ctx.fillText("Score: " + levelScore, c.width/2 -60, c.height/2+80);
                score += levelScore;
                scope.lunarLanderService.sendEvent(scope.lunarLanderService.NEW_SCORE, score);

                setTimeout(done, 1500);
            }
        }

        function pause() {
            if (interval) {
                window.clearInterval(interval);
                interval = false;

                ctx.fillStyle = '#ffffff';
                ctx.font = "16px Arial";
                ctx.fillText("paused", c.width/2 - 20, c.height/2);
            }
        }

        function tick() {
            if (!currentLevel.playTime) {
                currentLevel.playTime = 0;
            }
            currentLevel.playTime += 16;
            if (keyboard.isDown(keyboard.LEFT)) {
                craft.rotate('left');
            }
            if (keyboard.isDown(keyboard.RIGHT)) {
                craft.rotate('right');
            }
            if (keyboard.isDown(keyboard.UP)) { 
                craft.thrust();
            }
            craft.tick();
            if (craft.touchingPlatform(platforms[0])) {
                if(craft.landedOnPlatform(platforms[0])) {
                    levelSuccess(function() {
                        startLevel(nextLevel());
                    });
                } else {
                    stop("SHIP DESTROYED!", function() {
                        currentLevel.deaths++;
                        scope.lunarLanderService.sendEvent(scope.lunarLanderService.NEW_LOG, currentLevel);
                        startLevel(currentLevel);
                    });
                }
            } else if(craft.collidesWithWorld(world)) {
               stop("SHIP DESTROYED!", function() {
                   currentLevel.deaths++;
                   scope.lunarLanderService.sendEvent(scope.lunarLanderService.NEW_LOG, currentLevel);
                   startLevel(currentLevel);
               });
            } else {
                draw();
            }
        }

        function nextLevel() {
            //TODO do smart stuff
            var newLevel = {deaths: 0};
            if (scope.difficulty === 'traditional') {
                newLevel.number = currentLevel.number + 1;
                newLevel.width = currentLevel.width * 0.70;
                newLevel.deaths = 0;
                newLevel.attempts = [];
                newLevel.playTime = 0;
                newLevel.distance = 100;
                if (newLevel.width < 1.4) {
                    newLevel.width = 1.4;
                }
            } else if (scope.difficulty === 'adjust') {
                newLevel.number = currentLevel.number + 1;
                newLevel.width = calculateNewWidth(currentLevel);
                newLevel.distance = calculateNewDistance(currentLevel);
                newLevel.deaths = 0;
                newLevel.playTime = 0;
                newLevel.attempts = [];
                if (newLevel.width < 1.4) {
                    newLevel.width = 1.4;
                }
            }
            scope.lunarLanderService.sendEvent(scope.lunarLanderService.NEW_LEVEL, newLevel);
            currentLevel = newLevel;
            return newLevel;
        }

        function calculateNewDistance(oldLevel) {
            if (oldLevel.deaths === 0) {
                return oldLevel.distance * 0.4;
            } else if (oldLevel.deaths <= 2) {
                return oldLevel.distance * 0.95;
            } else {
                return Math.min(100, oldLevel.distance * 1.2);
            }
        }

        function calculateNewWidth(oldLevel) {
            if (oldLevel.deaths === 0) {
                return oldLevel.width * 0.4;
            } else if (oldLevel.deaths <= 2) {
                return oldLevel.width * 0.95;
            } else {
                return oldLevel.width * 1.2;
            }
        }

        function draw() {
            ctx.clearRect(0, 0, c.width, c.height);
            craft.draw(ctx);
            world.draw(ctx);
            platforms.forEach(function(platform) {
                platform.draw(ctx);
            });
        }


        var platforms = [
            new landingPad([200, 600-20], 80, 1000)
        ]

        var craft = new ship([100, 100], 0, 500);
        var world = new world([10, 10, 800-10, 600-10]);
        var score = 0;
        if (scope.score) {
            score = scope.score;
        }
        var currentLevel;
        var currentAttempt;

        function getRandomInt(min, max) {
              return Math.floor(Math.random() * (max - min)) + min;
        }

        function startLevel(level) {
            currentLevel = level;
            var platformWidth = (world.edge[2] - world.edge[0]) * (level.width/100);
            if (!currentLevel.platform) {
                currentLevel.platform = {loc: [getRandomInt(world.edge[0], world.edge[2]-platformWidth), 600-20],
                    width: platformWidth}
            }

            if (scope.difficulty === "adjust" && currentLevel.deaths >= 5) {
                currentLevel.width *= 1.1;
                if (currentLevel.width > 100) {
                    currentLevel.width = 100;
                }
                currentLevel.deaths = 0;
                platformWidth = (world.edge[2] - world.edge[0]) * (currentLevel.width/100);
                currentLevel.platform = {loc: [getRandomInt(world.edge[0], world.edge[2]-platformWidth), 600-20],
                    width: platformWidth}
            }

            craft = new ship([100, 100], Math.PI, 1000);
            platforms = [
                new landingPad(currentLevel.platform.loc, currentLevel.platform.width)
            ]
            showLevelNumber(level.number, function() {
                runLevel(level);
            });
        }

        function runLevel(level) {
            if (!interval) {
                running = true;
                interval = setInterval(tick, 16);
            }
        }

        function showLevelNumber(num, done) {
            ctx.clearRect(0, 0, c.width, c.height);
            world.draw(ctx);
            ctx.fillStyle = '#ffffff';
            ctx.font = "16px Arial";
            ctx.fillText("level " + num, c.width/2 - 20, c.height/2);
            setTimeout(done, 1000);
        }

        scope.lunarLanderService.setGame({
            startGame: start,
            pauseGame: pause
        });
    }

    function lunarLanderController($scope, lunarLanderService) {
        $scope.lunarLanderService = lunarLanderService;
    }

    angular.module('EXP')
    .directive('lunarLander', lunarLander);
})();
