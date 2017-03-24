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

import { requestBooks } from '../actions';

class LibraryPage extends Component {
  static propTypes = {
    isLogged: PropTypes.bool
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.requestBooks(this.props.isAdmin)
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
            { isAdmin ? <TableHeaderColumn>Publisher</TableHeaderColumn> : <TableHeaderColumn>Status</TableHeaderColumn> }
            { isAdmin ? <TableHeaderColumn>In Store</TableHeaderColumn> : <div></div> }
            { isLogged ? <TableHeaderColumn>Actions</TableHeaderColumn> : <div style={{display: 'none'}}></div>}
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
    const { isLogged, isAdmin, books } = this.props

    return books.map( (book, index) => {
      let button = isLogged ? ( 
        <TableRowColumn>
          <FlatButton label={isAdmin ? "Buy" : "Lend"} primary={true} />
        </TableRowColumn>) :
        <div style={{display: 'none'}}></div>
      return (
        <TableRow key={index}>
          <TableRowColumn>
            {'#'+book.bookAddress.slice(0, 4)}
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
    books: state.books,
    isLogged: state.login.jwt !== null,
    ...ownProps
  }
}
/*
const mapDispatchToProps = (dispatch) => {
  return {
    requestBooks
  }
}*/

export default connect(mapStateToProps, { requestBooks })(LibraryPage)