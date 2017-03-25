import React, { Component, PropTypes } from 'react';
import styles from './ViewStockStyles';
import {
  Table, TableBody, TableHeader, TableHeaderColumn,
  TableRow, TableRowColumn
} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import { Link } from 'react-router';
import Formsy from 'formsy-react';
import { FormsyText } from 'formsy-material-ui/lib';
import Moment from 'react-moment';

class ViewStock extends Component {
  constructor(props) {
    super();
  }
  componentWillMount() {
    this.props.getProductList(this.props.authUser.data.token)
  }
  render() {

    this.props.productList.map(product => {
      product.map(data => { console.log(data) })
    })

    return (
      <div style={styles.viewStockContainer}>
        <Paper style={styles.paper}>
          <h3 style={styles.title}>Stock Details</h3>
          <Divider />
          <Table>
            <TableHeader displaySelectAll={false}
              adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>Product Name</TableHeaderColumn>
                <TableHeaderColumn>Manufacturer</TableHeaderColumn>
                <TableHeaderColumn>Quantity</TableHeaderColumn>
                <TableHeaderColumn>Price</TableHeaderColumn>
                <TableHeaderColumn>Date Of Purchased</TableHeaderColumn>
               
              </TableRow>
            </TableHeader>
            <TableBody
              displayRowCheckbox={false}
              showRowHover={true}
              stripedRows={true}
            >
            
             {this.props.productList.map(product => {
                  return (product.map(data => { return (<TableRow>   
                    <TableRowColumn>{data.name}</TableRowColumn>
                     <TableRowColumn>{data.manufacture}</TableRowColumn>
                      <TableRowColumn>{data.quantity}</TableRowColumn>
                       <TableRowColumn>{data.amount}</TableRowColumn> 
                        <TableRowColumn><Moment format="DD/MMM/YYYY">{data.date}</Moment></TableRowColumn>
                    
                    </TableRow> )  }))
                })}
            </TableBody>
          </Table>

          <div style={styles.clear} />
        </Paper>
      </div>
    );
  }
}

export default ViewStock;
