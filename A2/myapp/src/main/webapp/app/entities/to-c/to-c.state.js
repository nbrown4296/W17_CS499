(function() {
    'use strict';

    angular
        .module('myappApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('to-c', {
            parent: 'entity',
            url: '/to-c',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'myappApp.toC.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/to-c/to-cs.html',
                    controller: 'ToCController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('toC');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('to-c-detail', {
            parent: 'to-c',
            url: '/to-c/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'myappApp.toC.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/to-c/to-c-detail.html',
                    controller: 'ToCDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('toC');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'ToC', function($stateParams, ToC) {
                    return ToC.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'to-c',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('to-c-detail.edit', {
            parent: 'to-c-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/to-c/to-c-dialog.html',
                    controller: 'ToCDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['ToC', function(ToC) {
                            return ToC.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('to-c.new', {
            parent: 'to-c',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/to-c/to-c-dialog.html',
                    controller: 'ToCDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                chapters: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('to-c', null, { reload: 'to-c' });
                }, function() {
                    $state.go('to-c');
                });
            }]
        })
        .state('to-c.edit', {
            parent: 'to-c',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/to-c/to-c-dialog.html',
                    controller: 'ToCDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['ToC', function(ToC) {
                            return ToC.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('to-c', null, { reload: 'to-c' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('to-c.delete', {
            parent: 'to-c',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/to-c/to-c-delete-dialog.html',
                    controller: 'ToCDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['ToC', function(ToC) {
                            return ToC.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('to-c', null, { reload: 'to-c' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
