import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import FlatButton from 'material-ui/FlatButton';
import Subheader from 'material-ui/Subheader';
import {
  Table, 
  TableBody, 
  TableHeader, 
  TableHeaderColumn, 
  TableRow, 
  TableRowColumn
} from 'material-ui/Table';

class LibraryPage extends Component {
  static propTypes = {
    isLogged: PropTypes.bool
  }

  state = {
    books: [
      {id: '23dfas23sf253gdf6', name: 'From the stars', status: 'booked out'},
      {id: '6673dfg2dfgyjkbnv', name: 'The elements of style', status: 'available'},
      {id: 'hfgj88erf3df43gfe', name: 'The design of everyday things', status: 'available'},
      {id: 'qwe536fg35nbvb455', name: 'Thinking fast and slow', status: 'booked out'},
      {id: 'cv2346283sjjsdf32', name: 'The psychoanalist', status: 'available'}
    ]
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    /* fetch books */ 
  }

  renderTableHeader() {
    const { isLogged, isAdmin } = this.props
    console.log(isAdmin)
    let adminRow = null
    if (isAdmin) {
      adminRow = (
      <TableRow>
        <TableHeaderColumn colSpan={isLogged ? "4" : "3"} tooltip="Admin" style={{textAlign: 'center', fontWeight: 400, fontSize: 20}}>
          Admin
        </TableHeaderColumn>
      </TableRow>
      );
    }

    let headerColumns = (
          <TableRow>
            <TableHeaderColumn>Book ID</TableHeaderColumn>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Status</TableHeaderColumn>
            { isLogged ? <TableHeaderColumn></TableHeaderColumn> : <div style={{display: 'none'}}></div>}
          </TableRow>
            )

    let header = (
        <TableHeader
          adjustForCheckbox={false}
          displaySelectAll={false}
        >
          {adminRow}
          {headerColumns}
        </TableHeader>
        )       

    return header; 
  }

  renderTableRows() {
    const { books } = this.state
    const { isLogged, isAdmin } = this.props

    return books.map( (book, index) => {
      let button = isLogged ? ( 
        <TableRowColumn>
          <FlatButton label={isAdmin ? "Buy" : "Lend"} primary={true} />
        </TableRowColumn>) :
        <div style={{display: 'none'}}></div>
      return (
        <TableRow key={index}>
          <TableRowColumn>
            {'#'+book.id.slice(0, 4)}
          </TableRowColumn>
          <TableRowColumn>
            {book.name}
          </TableRowColumn>
          <TableRowColumn>
            {book.status}
          </TableRowColumn>
          {button}
        </TableRow>
        )
    }) 
  }

  render() {
    return (          
        <Table
          fixedHeader={true}
          selectable
        >
          { this.renderTableHeader() }
          <TableBody
            showRowHover={true}
            displayRowCheckbox={false}
          >
            { this.renderTableRows() } 
          </TableBody>
        </Table>
      );
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log(ownProps)
  return {
    isLogged: state.login.jwt !== null,
    ...ownProps
  }
}

export default connect(mapStateToProps)(LibraryPage)