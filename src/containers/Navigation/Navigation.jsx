import React, { Component , PropTypes} from 'react';
import './Navigation.css';
import * as MUI from 'material-ui'
import {Link} from 'react-router';
import { connect } from 'react-redux';
import Avatar from 'material-ui/Avatar';
import Assessment from 'material-ui/svg-icons/action/assessment';
import Web from 'material-ui/svg-icons/av/web';
import { AuthMiddleware } from '../../store'
import {grey800,white} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

function mapStateToProps(state) {
    return {
        isAuthenticated: state.AuthReducer.isAuthenticated,
        authUser: state.AuthReducer.authUser
    };
}

function mapDispatchToProps(dispatch) {
    return {
        logout: () => dispatch(AuthMiddleware.logout())
    };
}

class Navigation extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  componentWillReceiveProps(nextProps){
    setTimeout(()=> {
      if(!this.props.isAuthenticated){
        console.log("Logout true");
          this.context.router.push("/login");
      }
    },0);
  }

  /*
  handelSignin() {
    this.props.logout();
  }*/
  drawerMenu(){

    return (
      <div>
          <div className="navigation-avatar-div">
            <Avatar src="https://addons.cdn.mozilla.net/user-media/userpics/0/0/45.png"
                    size={70}
                    className="navigation-icon"/>
            <span className="navigation-span">{this.props.isAuthenticated?<h4>{this.props.authUser.data.user.name}</h4>:""}</span>
          </div>
          <MUI.MenuItem
              className="navigation-menuItem"
              primaryText="Dashboard"
              leftIcon={<Assessment  style={{fill:white}}/>}
              containerElement={<Link to="/dashboard"/>}
            />
            <MUI.Divider />
          <MUI.MenuItem
              className="navigation-menuItem"
              primaryText="Add Store" 
              leftIcon={<Web style={{fill:white}}/>}
              containerElement={<Link to="/addstore"/>}
            />
            <MUI.Divider />
          <MUI.MenuItem
              className="navigation-menuItem"
              primaryText="Add Product" 
             leftIcon={<Web style={{fill:white}}/>}
              containerElement={<Link to="/addproduct"/>}
            />
            <MUI.Divider />
          {/*<MUI.MenuItem
              className="navigation-menuItem"
              primaryText="Add Purchase Detail" 
              leftIcon={<Web/>}
              containerElement={<Link to="/purchaseproduct"/>}
            />*/}
          <MUI.MenuItem
              className="navigation-menuItem"
              primaryText="Add Sale Detail" 
              leftIcon={<Web style={{fill:white}}/>}
              containerElement={<Link to="/saleproduct"/>}
            />
            <MUI.Divider />
          <MUI.MenuItem
              className="navigation-menuItem"
              primaryText="View Stock" 
              leftIcon={<Web style={{fill:white}}/>}
              containerElement={<Link to="/viewstock"/>}
            />
            <MUI.Divider />
          <MUI.MenuItem
              className="navigation-menuItem"
              primaryText="View Sales" 
              leftIcon={<Web style={{fill:white}}/>}
              containerElement={<Link to="/viewsales"/>}
            />

            <MUI.Divider />
          <div className="lastLine">
          <MUI.Divider />
            <h5>@CopyRight 2017 </h5>
            </div>
      </div>
    );
  }

  render() {
    const muiTheme = getMuiTheme({
  palette: {
    canvasColor: grey800,
    textColor:white,
     alternateTextColor: white,
  },
  appBar: {
    height: 50,
  },

});
    return (
      <div className="navigation-container">
        
        <MUI.AppBar style={this.props.styles} title="Inventory Management System"
              onLeftIconButtonTouchTap={this.props.drawerToggle}
              iconElementRight={<MUI.FlatButton label="Sign out" onTouchTap={this.props.logout}/>}
              onRightIconButtonTouchTap={()=>this.context.router.push("/login")}
              />
             
               <MuiThemeProvider muiTheme={muiTheme}>
        <MUI.Drawer open={this.props.drawerOpen} docked={true}
            onRequestChange={this.props.drawerToggle}>
          {this.drawerMenu()}
        </MUI.Drawer>
         </MuiThemeProvider>
      </div>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Navigation);
