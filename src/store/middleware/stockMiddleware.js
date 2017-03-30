import StockActions from "./../actions/stockActions";
import AuthMiddleware from "./authMiddleware";
import * as firebase from 'firebase';
import { instance } from "../../config/server"
export default class StockMiddleware {

    
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

   

   
    /// Get Store List Functions
    static getStoreList(token) {
        console.log("getStoreList ");
        return (dispatch) => {
            dispatch(StockActions.getStoreList())
            StockMiddleware.getStoreListFromDatabase(dispatch, token);
        }
    }

    static getStoreListFromDatabase(dispatch, token) {
        
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
        console.log("getProductList " , token);
        return (dispatch) => {
            dispatch(StockActions.getProductList())
            StockMiddleware.getProductListFromDatabase(dispatch, token);
        }
    }

    static getProductListFromDatabase(dispatch, token) {
        
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
        console.log(token);
        return (dispatch) => {
            dispatch(StockActions.getSalesList())
            StockMiddleware.getSalesListFromDatabase(dispatch, token);
        }
    }

    static getSalesListFromDatabase(dispatch,token) {
       
        instance.get("/getSales",instance.defaults.headers.token = token)
        .then(response => response.data)
        .then(body => {
            dispatch(StockActions.addSaleItemToList(body.data))
            console.log(body)
        })
        .catch(error => {
            console.log(error)
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
    
}