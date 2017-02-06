(function() {
    'use strict';

    angular
        .module('myappApp')
        .controller('ToCDialogController', ToCDialogController);

    ToCDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'ToC', 'Book'];

    function ToCDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, ToC, Book) {
        var vm = this;

        vm.toC = entity;
        vm.clear = clear;
        vm.save = save;
        vm.books = Book.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.toC.id !== null) {
                ToC.update(vm.toC, onSaveSuccess, onSaveError);
            } else {
                ToC.save(vm.toC, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('myappApp:toCUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
