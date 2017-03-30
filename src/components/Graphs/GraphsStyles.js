
import {white, purple600, purple500,grey400,grey700} from 'material-ui/styles/colors';
import {typography} from 'material-ui/styles';
const styles = {
  graphsContainer: {
      //minWidth: 320,
      //maxWidth: 500,
      height: 'auto',
      //position: 'absolute',
      top: '20%',
      left: 0,
      right: 0,
      margin: 'auto'
  },
  toggleDiv: {
      maxWidth: 300,
      marginTop: 40,
      marginBottom: 5
    },
    toggleLabel: {
      color: grey400,
      fontWeight: 100
    },
    buttons: {
      marginTop: 30,
      float: 'right'
    },
    saveButton: {
      marginLeft: 5
    },
    /*
    paper: {
      padding: 30,
      maxWidth:600,
      marginTop:20
    },*/
    clear: {
      clear: 'both'
    },
    paper: {
      //backgroundColor: purple500,
      height: 300,
      maxWidth:500,
      marginTop:20,
      marginLeft:30,
      display:"inline"
    },
    div: {
      height: 200,
      padding: '5px 15px 0 15px'
    },
    header: {
      fontSize: 24,
      fontWeight: typography.fontWeightLight,
      color: white,
      backgroundColor: grey700,
      padding: 10,
    }
};

export default styles;