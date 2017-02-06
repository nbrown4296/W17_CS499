(function() {
    'use strict';

    angular
        .module('myappApp')
        .controller('ToCController', ToCController);

    ToCController.$inject = ['$scope', '$state', 'ToC'];

    function ToCController ($scope, $state, ToC) {
        var vm = this;

        vm.toCS = [];

        loadAll();

        function loadAll() {
            ToC.query(function(result) {
                vm.toCS = result;
                vm.searchQuery = null;
            });
        }
    }
})();
