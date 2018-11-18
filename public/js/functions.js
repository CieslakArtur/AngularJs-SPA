function getJsonObjectById(products, id_obj) {
    var obj;
    products.forEach(function (item) {
        if (item.id === id_obj) {
            obj = item;
        }
    })
    return obj;
}
function removeObject(products, id_obj) {
    var index;
    products.forEach(function (item, i) {
        if (item.id === id_obj) {
            index = i;
        }
    })
    if (index >= 0) {
        products.splice(index, 1);
    }
}

function getDateId() {
    var date = new Date();
    var id = '' + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds();
    console.log(id);
    return id;
}