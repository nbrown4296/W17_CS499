(function() {
    'use strict';
    angular
        .module('myappApp')
        .factory('ToC', ToC);

    ToC.$inject = ['$resource'];

    function ToC ($resource) {
        var resourceUrl =  'api/to-cs/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
