tableApp = angular.module('tableApp', ['tableApp.controllers', 'smart-table', 'ui.bootstrap']);

angular.module('tableApp.controllers', []).controller('testController', ['$scope', '$http', '$uibModal', function ($scope, $http, $modal) {
    $scope.loading = false;
    var modalInstance = null;
    $scope.orderByField = 'name';
    $scope.reverseSort = false;
    $scope.customFilter = {};

    $scope.getData = function () {
        $scope.loading = true;
        $http.get("/data.json")
            .then(function (response) {
                $scope.products = response.data;
                $scope.loading = false;
            });
    };

    $scope.viewRecord = function (id) {
        if (id > 0) {
            var item = getJsonObjectById($scope.products, id);
            if (typeof item !== 'undefined') {
                modalInstance = $modal.open({
                    animation: false,
                    templateUrl: 'viewItem.ejs',
                    controller: 'itemViewController',
                    scope: $scope,
                    size: '',
                    resolve: {
                        record: function () {
                            return item;
                        }
                    }
                });
                modalInstance.result.then(function () {
                }, function (res) {
                });
            }
        }
    };

    $scope.addRecord = function () {
        modalInstance = $modal.open({
            animation: false,
            templateUrl: 'addItem.ejs',
            controller: 'itemAddController',
            scope: $scope,
            size: '',
            resolve: {}
        });
        modalInstance.result.then(function () {
        }, function (res) {
        });
    };

    $scope.editRecord = function (id) {
        if (id > 0) {
            var item = getJsonObjectById($scope.products, id);
            if (typeof item !== 'undefined') {
                modalInstance = $modal.open({
                    animation: false,
                    templateUrl: 'editItem.ejs',
                    controller: 'itemEditController',
                    scope: $scope,
                    size: '',
                    resolve: {
                        record: function () {
                            return item;
                        }
                    }
                });
                modalInstance.result.then(function () {
                }, function (res) {
                });
            }
        }
    };

    $scope.cancelModal = function () {
        modalInstance.close(false);
    };

    $scope.sortBy = function (field) {
        if ($scope.orderByField === field) {
            $scope.reverseSort = !$scope.reverseSort;
        } else {
            $scope.orderByField = field;
            $scope.reverseSort = false;
        }
    };

    $scope.filterByPrice = function () {
        //Price from
        if ($scope.priceFrom == null || $scope.priceFrom === '') {
            delete $scope.customFilter['_priceFrom'];
        } else {
            $scope.customFilter['_priceFrom'] = true;
            $scope.products.forEach(function (item) {
                item['_priceFrom'] = item.price >= $scope.priceFrom;
            });
        }
        //Price to
        if ($scope.priceTo == null || $scope.priceTo === '') {
            delete $scope.customFilter['_priceTo'];
        } else {
            $scope.customFilter['_priceTo'] = true;
            $scope.products.forEach(function (item) {
                item['_priceTo'] = item.price <= $scope.priceTo;
            });
        }
    };

    $scope.saveRecord = function (item) {
        item.id = getDateId();
        $scope.products.push(item);
    };

    $scope.updateRecord = function (item) {
        var item_updated = getJsonObjectById($scope.products, item.id);
        item_updated.id = item.id;
        item_updated.name = item.name;
        item_updated.price = Number(item.price);
        item_updated.description = item.description;
        item_updated.manufacturer = item.manufacturer;
        item_updated.condition = item.condition;
        item_updated.category = item.category;
        item_updated.img = item.img;
    };

    $scope.deleteRecord = function (id) {
        if (confirm('Are you sure you want to delete this?')) {
            removeObject($scope.products, id);
        }
    };
    $scope.getData();
}]);

tableApp.controller('itemViewController', ['$scope', '$http', 'record', function ($scope, $http, record) {
    function init() {
        $scope.item = record;
    }

    init();
}]);

tableApp.controller('itemAddController', ['$scope', '$http', function ($scope, $http) {
    $scope.saveItem = function () {
        $scope.item = {};

        if (!angular.isDefined($scope.name) || $scope.name === '') {
            alert('Item name is empty');
            return;
        } else if (!angular.isDefined($scope.price) || $scope.price === '') {
            alert('Item price is empty');
            return;
        } else if (!angular.isDefined($scope.manufacturer) || $scope.manufacturer === '') {
            alert('Manufacturer is empty');
            return;
        } else if (!angular.isDefined($scope.condition) || $scope.condition === '') {
            alert('Condition is not selected');
            return;
        } else {
            $scope.item.name = $scope.name;
            $scope.item.price = $scope.price;
            $scope.item.description = $scope.description;
            $scope.item.manufacturer = $scope.manufacturer;
            $scope.item.condition = $scope.condition;
            $scope.item.category = $scope.category;
            $scope.item.img = $scope.img;
            if (!angular.isDefined($scope.img) || $scope.img === '') {
                $scope.item.img = 'img/noimg.jpg'
            }
        }
        $scope.cancelModal();
        $scope.saveRecord($scope.item);
    };

}]);

tableApp.controller('itemEditController', ['$scope', '$http', 'record', function ($scope, $http, record) {
    function init() {
        $scope.item = {};
        $scope.item.id = record.id;
        $scope.item.name = record.name;
        $scope.item.price = Number(record.price);
        $scope.item.description = record.description;
        $scope.item.manufacturer = record.manufacturer;
        $scope.item.condition = record.condition;
        $scope.item.category = record.category;
        $scope.item.img = record.img;
    }

    init();

    $scope.updateItem = function () {
        $scope.cancelModal();
        if (!angular.isDefined($scope.item.name) || $scope.item.name === '') {
            alert('Item name is empty');
            return;
        } else if (!angular.isDefined($scope.item.price) || $scope.item.price === '') {
            alert('Item price is empty');
            return;
        } else if (!angular.isDefined($scope.item.manufacturer) || $scope.item.manufacturer === '') {
            alert('Manufacturer is empty');
            return;
        } else if (!angular.isDefined($scope.item.condition) || $scope.item.condition === '') {
            alert('Condition is not selected');
            return;
        }
        $scope.updateRecord($scope.item);
    }
}]);

//Custom directive
tableApp.directive('tableDirective', function () {
    return {
        restrict: 'EA',
        scope: {
            items: '='
        },
        controller: 'testController',
        templateUrl: 'table.ejs'
    }
});