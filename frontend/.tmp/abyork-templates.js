(function(module) {
try {
  module = angular.module('abyork');
} catch (e) {
  module = angular.module('abyork', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('modules/main/main.html',
    '<div class="exp-main" flex layout="row"><div layout="row" flex ng-if="!loading"><div class="start-container" ng-if="!playing" layout="row" flex><div flex></div><div layout="column"><div flex></div><md-button ng-if="!playing" ng-click="startGame()">Start</md-button><div flex></div></div><div flex></div></div><lunar-lander exp-score="user.score" exp-difficulty="difficulty" exp-current-level="user.currentLevel"></lunar-lander></div><div layout="row" class="loading-container" flex ng-if="loading"><div flex></div><div layout="column"><div flex></div><p>Loading</p><div flex></div></div><div flex></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('abyork');
} catch (e) {
  module = angular.module('abyork', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('directives/lunar-lander/lunar-lander.html',
    '<div class="lunar-lander-wrapper" layout="row" flex><div flex></div><div layout="column"><div flex></div><canvas id="lunarLander" width="800" height="600" class="lunar-lander-canvas"></canvas><div flex></div></div><div flex></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('abyork');
} catch (e) {
  module = angular.module('abyork', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('modules/root/root.html',
    '<div flex layout="row"><div ui-view flex layout="row"></div></div>');
}]);
})();
