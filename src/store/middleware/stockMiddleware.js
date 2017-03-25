import StockActions from "./../actions/stockActions";
import AuthMiddleware from "./authMiddleware";
import * as firebase from 'firebase';
import { instance } from "../../config/server"
export default class StockMiddleware {

    // static formatStringForKey(obj,propertyToFormat,newProperty){
    //     obj[newProperty] = obj[propertyToFormat].toLowerCase().replace(/\s+/g, '');
    // }

    //Add Store
    static addStore(storeObj, token) {
        console.log("addStore ", storeObj);
        return (dispatch) => {
            dispatch(StockActions.addStore())
            StockMiddleware.addStoreOnDatabase(dispatch, storeObj, token);
        }
    }

    static addStoreOnDatabase(dispatch, storeObj, token) {
        console.log(token)
        // StockMiddleware.formatStringForKey(storeObj,"name","storeKey");
        // firebase.database().ref('/')
        //     .child(`stores`)
        //     .push(storeObj)
        //     .then(function (){
        //         dispatch(StockActions.addStoreSuccessful());
        //     })
        //     .catch(function (error){
        //         dispatch(StockActions.addStoreRejected(error));
        //     });
        instance.post("/addStores", { storeName: storeObj.name, location: storeObj.location }, instance.defaults.headers.token = token)
            .then(response => response.data)
            .then(body => {
                dispatch(StockActions.addStoreSuccessful());
                return (dispatch => { StockMiddleware.getStoreListFromDatabase(dispatch, token); })

            })
            .catch(error => {
                dispatch(StockActions.addStoreRejected(error));
            })
    }

    //Add Product
    static addProduct(productObj, token) {
        console.log("addProduct ", token);
        return (dispatch) => {
            dispatch(StockActions.addProduct())
            StockMiddleware.addProductOnDatabase(dispatch, productObj, token);
        }
    }

    static addProductOnDatabase(dispatch, productObj, token) {
        console.log("ADdddddddd", productObj)

        instance.post("/AddProduts", { name: productObj.name, manufacture: productObj.manufacturer, description: productObj.description, amount: productObj.amount, quantity: productObj.quantity, date: productObj.date }, instance.defaults.headers.token = token)
            .then(response => response.data)
            .then(body => {
                dispatch(StockActions.addProductSuccessful());
            })
            .catch(error => {
                dispatch(StockActions.addProductRejected(error));
            })
    }

    //Add Purchase Details
    static addPurchaseDetails(purchaseDetailsObj) {
        console.log("addPurchaseDetails ", purchaseDetailsObj);
        return (dispatch) => {
            dispatch(StockActions.addPurchaseDetails())
            StockMiddleware.addPurchaseDetailsOnFirebase(dispatch, purchaseDetailsObj);
        }
    }

    static addPurchaseDetailsOnFirebase(dispatch, purchaseDetailsObj) {
        //StockMiddleware.formatStringForKey(purchaseDetailsObj,"name","productKey");
        purchaseDetailsObj.type = "Purchase";
        firebase.database().ref('/')
            .child(`inventoryDetails`)
            .push(purchaseDetailsObj)
            .then(function () {
                //dispatch(StockActions.addPurchaseDetailsSuccessful());
                StockMiddleware.addStockCountOnFirebase(dispatch, purchaseDetailsObj);
            })
            .catch(function (error) {
                dispatch(StockActions.addPurchaseDetailsRejected(error));
            });
    }

    static addStockCountOnFirebase(dispatch, purchaseDetailsObj) {
        var countRef = firebase.database().ref('/')
            .child(`stockCounts/${purchaseDetailsObj.productKey}/${purchaseDetailsObj.storeKey}`);
        countRef.once('value')
            .then(function (count) {
                var countforProduct = 0;
                if (count && count.val()) {
                    countforProduct = count.val().count;
                }

                countRef.update({ count: countforProduct + purchaseDetailsObj.quantity })
                    .then(function () {
                        dispatch(StockActions.addPurchaseDetailsSuccessful());
                    })
                    .catch(function (error) {
                        dispatch(StockActions.addPurchaseDetailsRejected(error));
                    });
            });
    }


    //Add Sale Details
    static addSaleDetails(saleDetailsObj, token) {
        console.log("addSaleDetails ", saleDetailsObj);
        return (dispatch) => {
            dispatch(StockActions.addSaleDetails())
            StockMiddleware.addSaleDetailsOnDatabase(dispatch, saleDetailsObj, token);
        }
    }

    static addSaleDetailsOnDatabase(dispatch, saleDetailsObj,token) {
       
        var obj = { pid: saleDetailsObj.productKey, sid: saleDetailsObj.storeKey, saleDate: saleDetailsObj.date, quantity: saleDetailsObj.quantity, stockSold: saleDetailsObj.unitPrice };

        instance.post("/AddSales",obj,instance.defaults.headers.token = token )
        .then(response => response.data)
        .then(body => {
            dispatch(StockActions.addSaleDetailsSuccessful());
        })
        .catch(error => {
            dispatch(StockActions.addSaleDetailsRejected(error));
        })
    }

    static subtractStockCountOnFirebase(dispatch, saleDetailsObj) {
        var countRef = firebase.database().ref('/')
            .child(`stockCounts/${saleDetailsObj.productKey}/${saleDetailsObj.storeKey}`);
        countRef.once('value')
            .then(function (count) {
                var countforProduct = 0;
                if (count && count.val()) {
                    countforProduct = count.val().count;
                }
                var newCount = countforProduct - saleDetailsObj.quantity;
                StockMiddleware.updateNotificationOnFirebase(dispatch, newCount, saleDetailsObj);
                countRef.update({ count: newCount })
                    .then(function () {
                        dispatch(StockActions.addSaleDetailsSuccessful());
                    })
                    .catch(function (error) {
                        dispatch(StockActions.addSaleDetailsRejected(error));
                    });
            });
    }

    static updateNotificationOnFirebase(dispatch, newCount, detailsObj) {
        if (newCount < 5) {
            firebase.database().ref('/')
                .child(`notifications/${detailsObj.storeKey}|${detailsObj.productKey}`)
                .set(({ productName: detailsObj.product, storeName: detailsObj.store, quantity: newCount }))
                .then(function () {
                    //StockMiddleware.subtractStockCountOnFirebase(dispatch,saleDetailsObj);
                    //dispatch(StockActions.addSaleDetailsSuccessful());
                })
                .catch(function (error) {
                    //dispatch(StockActions.addSaleDetailsRejected(error));
                });
        }
    }
    /// Get Store List Functions
    static getStoreList(token) {
        console.log("getStoreList ");
        return (dispatch) => {
            dispatch(StockActions.getStoreList())
            StockMiddleware.getStoreListFromDatabase(dispatch, token);
        }
    }

    static getStoreListFromDatabase(dispatch, token) {
        // const storeListRef = firebase.database().ref('/')
        //                     .child("stores")
        // storeListRef.on("child_added",function (snapshot){
        //     dispatch(StockActions.addStoreItemToList(snapshot.val()))
        // })
        instance.get("/getStores", instance.defaults.headers.token = token)
            .then(response => response.data)
            .then(body => {
                dispatch(StockActions.addStoreItemToList(body.data))
            })
            .catch(error => {
                AuthMiddleware.logout()
            })
    }


    /// Get Product List Functions
    static getProductList(token) {
        console.log("getProductList ");
        return (dispatch) => {
            dispatch(StockActions.getProductList())
            StockMiddleware.getProductListFromDatabase(dispatch, token);
        }
    }

    static getProductListFromDatabase(dispatch, token) {
        // const productListRef = firebase.database().ref('/')
        //                     .child("products")
        // productListRef.on("child_added",function (snapshot){
        //     dispatch(StockActions.addProductItemToList(snapshot.val()))
        // })
        instance.get("/getProducts", instance.defaults.headers.token = token)
            .then(response => response.data)
            .then(body => {
                dispatch(StockActions.addProductItemToList(body.data))
            })
            .catch(error => {
                AuthMiddleware.logout()
            })
    }


    /// Get Sales List Functions
    static getSaleList(token) {
        console.log("getSaleList ");
        return (dispatch) => {
            dispatch(StockActions.getSalesList())
            // StockMiddleware.getSalesListFromFirebase(dispatch, startDate, endDate);
        }
    }

    static getSalesListFromFirebase(dispatch, startDate, endDate) {
        const salesListRef = firebase.database().ref('/')
            .child("inventoryDetails")
            .orderByChild("date")
            //.equalTo("Sale")
            .startAt(startDate).endAt(endDate);
        salesListRef.on("child_added", function (snapshot) {
            if (snapshot.val().type === "Sale") {
                dispatch(StockActions.addSaleItemToList(snapshot.val()))
            }
        })
    }

    /// Get Purchase List Functions
    static getPurchaseList(startDate, endDate) {
        console.log("getPurchaseList ");
        return (dispatch) => {
            dispatch(StockActions.getPurchaseList())
            StockMiddleware.getPurchaseListFromFirebase(dispatch, startDate, endDate);
        }
    }

    static getPurchaseListFromFirebase(dispatch, startDate, endDate) {
        const purchaseListRef = firebase.database().ref('/')
            .child("inventoryDetails")
            .orderByChild("type").equalTo("Purchase");
        purchaseListRef.on("child_added", function (snapshot) {
            dispatch(StockActions.addPurchaseItemToList(snapshot.val()))
        })
    }

    //Get Stock Counts
    static getStockCounts() {
        console.log("getStockCounts");
        return (dispatch) => {
            dispatch(StockActions.getStockCount())
            StockMiddleware.getStockCountFromFirebase(dispatch);
        }
    }

    static getStockCountFromFirebase(dispatch) {
        firebase.database().ref('/')
            .child(`stockCounts`)
            .on("value", function (snapshot) {
                console.log(snapshot.val());
                dispatch(StockActions.getStockCountSuccessful(snapshot.val()));
            });
    }
}