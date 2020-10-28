import React from 'react';
import Routers from './routers';
import Navbar from '../components/navbar';

import 'toastr/build/toastr.min.js'

import 'bootswatch/dist/flatly/bootstrap.css'
import '../custom.css'
import 'toastr/build/toastr.css'

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';


class App extends React.Component {

  render() { 
    return(
      <>
        <Navbar />
        <div className="container">
          <Routers />
        </div>
      </>
    )

  }

}

export default App;
