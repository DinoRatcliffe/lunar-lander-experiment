(function(module) {
try {
  module = angular.module('abyork');
} catch (e) {
  module = angular.module('abyork', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('modules/main/main.html',
    '<div class="exp-main" flex layout="row">\n' +
    '    <div layout="row" flex ng-if="!loading"> \n' +
    '        <div class="start-container" ng-if="!playing" layout="row" flex>\n' +
    '            <div flex></div>\n' +
    '            <div layout="column">\n' +
    '                <div flex></div>\n' +
    '                <md-button ng-if="!playing" ng-click="startGame()">Start</md-button>\n' +
    '                <div flex></div>\n' +
    '            </div>\n' +
    '            <div flex></div>\n' +
    '        </div>\n' +
    '        <lunar-lander exp-score="user.score" exp-difficulty="difficulty" exp-current-level="user.currentLevel"></lunar-lander>\n' +
    '    </div>\n' +
    '    <div layout="row" class="loading-container" flex ng-if="loading">\n' +
    '        <div flex></div>\n' +
    '        <div layout="column">\n' +
    '            <div flex></div>\n' +
    '            <p>Loading</p>\n' +
    '            <div flex></div>\n' +
    '        </div>\n' +
    '        <div flex></div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
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
    '<div class="lunar-lander-wrapper" layout="row" flex>\n' +
    '    <div flex></div>\n' +
    '    <div layout="column">\n' +
    '        <div flex></div>\n' +
    '        <canvas id="lunarLander" width="800" height="600" class="lunar-lander-canvas"></canvas>\n' +
    '        <div flex></div>\n' +
    '    </div>\n' +
    '    <div flex></div>\n' +
    '</div>\n' +
    '');
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
    '<div flex layout="row">\n' +
    '    <div ui-view flex layout="row"></div>\n' +
    '</div>\n' +
    '');
}]);
})();
