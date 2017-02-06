(function() {
    'use strict';

    angular
        .module('myappApp')
        .controller('ToCDeleteController',ToCDeleteController);

    ToCDeleteController.$inject = ['$uibModalInstance', 'entity', 'ToC'];

    function ToCDeleteController($uibModalInstance, entity, ToC) {
        var vm = this;

        vm.toC = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            ToC.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
