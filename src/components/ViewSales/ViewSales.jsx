import React, { Component,PropTypes } from 'react';
import styles from './ViewSalesStyles';
import * as MUI from 'material-ui'
import {Link} from 'react-router';
import Formsy from 'formsy-react';
import { FormsyText,FormsyDate } from 'formsy-material-ui/lib';
import {Table, TableBody, TableHeader, TableHeaderColumn, 
        TableRow, TableRowColumn } from 'material-ui/Table';
import Paper  from 'material-ui/Paper';
import Divider  from 'material-ui/Divider';
import Moment from 'react-moment';


class ViewSales extends Component {

  // static contextTypes = {
  //   router: PropTypes.object.isRequired
  // }
  constructor(props){
    super();
    console.log("component props ",props);
 
  }


  // errorMessages = {
  //   wordsError: "Please only use letters"
  // }

  componentDidMount() {
    this.props.getSalesList(this.props.authUser.data.token);
  }
  componentWillReceiveProps(nextProps){
    setTimeout(()=> {
      if(this.props.isDetailUpdated){
        console.log("isDetailUpdated true");
        //this.context.router.push("/dashboard");
      }
    },0);
  }



  render() {
    this.props.salesList.map(saleItem=>{
    saleItem.map(datas => {
      console.log(datas)
    })
    })
    return (
      <div style={styles.viewSalesContainer}>
        <MUI.Paper style={styles.paper}>
          <h3 style={styles.title}>Sales</h3>

          
          <MUI.Divider style={{marginTop:30}}/>
          <Table>
            <TableHeader displaySelectAll={false}
                adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>Product Name</TableHeaderColumn>
                <TableHeaderColumn>Store</TableHeaderColumn>
                <TableHeaderColumn>Store Location</TableHeaderColumn>
                <TableHeaderColumn>Type</TableHeaderColumn>
                <TableHeaderColumn>Quantity</TableHeaderColumn>
               
                 <TableHeaderColumn>Sale Volume</TableHeaderColumn>
                <TableHeaderColumn>Date</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody
                displayRowCheckbox={false}
                showRowHover={true}
                stripedRows={true}
              >

              {
                this.props.salesList.map(saleItems=>{
                   return (
                     saleItems.map(saleItem=>{
                       return (<TableRow>              
                        <TableRowColumn>{saleItem.productName}</TableRowColumn>
                        <TableRowColumn>{saleItem.storeName}</TableRowColumn>
                        <TableRowColumn>{saleItem.storeLocation}</TableRowColumn>

                        <TableRowColumn>Sale</TableRowColumn>
                        <TableRowColumn>{saleItem.sale.quantity}</TableRowColumn>
                       
                        <TableRowColumn>{saleItem.sale.totalAmount}</TableRowColumn>
                        <TableRowColumn><Moment format="DD/MMM/YYYY">{saleItem.sale.date}</Moment></TableRowColumn>
                      </TableRow>)
                     })
                      
                   );
                })
              }
                           
            </TableBody>
          </Table>

          <div style={styles.clear}/>
        </MUI.Paper>
      </div>
    );
  }
}

export default ViewSales;
