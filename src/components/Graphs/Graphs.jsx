import React, { Component,PropTypes } from 'react';
import styles from './GraphsStyles';
import * as MUI from 'material-ui'
import {Link} from 'react-router';
import Formsy from 'formsy-react';
import { FormsyText } from 'formsy-material-ui/lib';
import moment from 'moment';
import regression from 'regression'

import {LineChart, Line, ResponsiveContainer,CartesianGrid,XAxis,YAxis} from 'recharts';


class Graphs extends Component {


  constructor(props){
    super();
    console.log("component props ",props);
    this.state = {
        canSubmit:false,
        snackbarOpen: false,
        predictedValue : NaN,
    }
    

    
  }

 

  render() {
    var arr = [{name:"11/01/2016",uv:576},{name:"01/12/2017",uv:240000},{name:"02/01/2017",uv:316800},{name:"02/04/2017",uv:691200},{name:"03/01/2017",uv:2931420}]
    var reg = [{name:"11/01/2016",uv:590319.3846153846},{name:"01/12/2017",uv:1180638.7692307692},{name:"02/01/2017",uv:1770958.153846154},{name:"02/04/2017",uv:2361277.5384615385},{name:"03/01/2017",uv:2951596.923076923}]

    console.log(arr);


    return (
      <div style={styles.graphsContainer}>

        <MUI.Paper style={styles.paper}>
          <div style={{...styles.header}}>Sales Detail</div>
          <div style={styles.div}>
            <ResponsiveContainer >
                <LineChart
                    width={400}
                    height={400}
                    data={arr}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                  <XAxis dataKey="name" />
                  
                <CartesianGrid stroke="#f5f5f5" />
                <Line type="monotone" dataKey="name" stroke="#ff7300" yAxisId={0} />
                <Line type="monotone" dataKey="uv" stroke="#387908" yAxisId={1} />
                </LineChart>
            </ResponsiveContainer>
          </div>
        </MUI.Paper>

        <MUI.Paper style={styles.paper}>
          <div style={{...styles.header}}>Regression Chart</div>
          <div style={styles.div}>
            <ResponsiveContainer >
                <LineChart
                    width={400}
                    height={400}
                    data={reg}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                  <XAxis dataKey="name" />
                  
                <CartesianGrid stroke="#f5f5f5" />
                <Line type="monotone" dataKey="name" stroke="#ff7300" yAxisId={0} />
                <Line type="monotone" dataKey="uv" stroke="#387908" yAxisId={1} />
                </LineChart>
            </ResponsiveContainer>
          </div>
        </MUI.Paper>  
        <MUI.Divider/>
        <div style={{marginTop:20,marginRight:20,border:"2px solid black",padding:"20px",display:"inline-block"}}>
          <h2>Sales Data</h2>
          <MUI.List>
                {arr.map((item) =>
                  <MUI.ListItem
                    key={item.name}
                    primaryText={item.name}
                    secondaryText={item.uv}
                    >
                  </MUI.ListItem>
                  
                )}
                <MUI.Divider />
              </MUI.List>
        </div> 
        <div style={{marginTop:20,top:0,marginRight:20,width:"200px",float:"right",border:"2px solid black",padding:"20px",display:"inline-block"}}>
          <h2>PRODUCTS</h2>
          <MUI.List>
            {this.props.productList.map(product => {
                  return (product.map(data => { return (
                    <MUI.ListItem
                    key={data.id}
                    primaryText={data.name}
                    secondaryText={data.description}
                     />
                  )}))})}
                    
               
                
              </MUI.List>
        </div> 
        <MUI.Snackbar
          open={this.state.snackbarOpen}
          message="Something went wrong unable to Preditct Value"
          autoHideDuration={3000}
        />          
      </div>
    );
  }
}

export default Graphs;
