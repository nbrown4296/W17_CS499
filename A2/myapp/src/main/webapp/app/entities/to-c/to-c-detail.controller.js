(function() {
    'use strict';

    angular
        .module('myappApp')
        .controller('ToCDetailController', ToCDetailController);

    ToCDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'ToC', 'Book'];

    function ToCDetailController($scope, $rootScope, $stateParams, previousState, entity, ToC, Book) {
        var vm = this;

        vm.toC = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('myappApp:toCUpdate', function(event, result) {
            vm.toC = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
