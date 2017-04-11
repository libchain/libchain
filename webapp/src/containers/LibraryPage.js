import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import shallowCompare from 'react-addons-shallow-compare';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';
import Subheader from 'material-ui/Subheader';
import {
  Table, 
  TableBody, 
  TableHeader, 
  TableHeaderColumn, 
  TableRow, 
  TableRowColumn
} from 'material-ui/Table';

import { requestBooks, buyBook, borrowBook, returnBook, requestView, requestBookStatistics } from '../actions';

class LibraryPage extends Component {
  static propTypes = {
    isLogged: PropTypes.bool
  }

  state = {
    showBookInfo: false
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.requestBooks(this.props.isAdmin)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.permissions.length !== nextProps.permissions.length) {
      let bookAddress = nextProps.permissions[nextProps.permissions.length-1]
      let permittedBook = this.props.books.filter(book => book.bookAddress === bookAddress)[0]
      console.log(bookAddress)
      console.log(nextProps)
      console.log(this.props.books.filter(book => book.bookAddress === bookAddress))
      console.log(permittedBook)
      window.location.replace(permittedBook.url)
    }
  }

  handleAction(bookAddress, publisherAddress) {
    const { isAdmin } = this.props
    if (isAdmin) {
      this.props.buyBook(bookAddress, publisherAddress);
      this.props.requestBooks(this.props.isAdmin);
      return;
    }

    this.props.borrowBook(bookAddress);
    this.props.requestBooks(this.props.isAdmin);
  }

  handleReturn(bookAddress) {
    this.props.returnBook(bookAddress)
  }

  handleView(bookAddress) {
    this.props.requestView(bookAddress)
  }

  getTableColumnsNumber() {
    const { isLogged, isAdmin } = this.props
    let base = 0;
    if (isAdmin) {
      return (4 + (isLogged ? 1 : 0));
    }

    return (3 + (isLogged ? 1 : 0));
  }

  renderTableHeader() {
    const { isLogged, isAdmin } = this.props
    console.log(isAdmin)
    let adminRow = null
    if (isAdmin) {
      adminRow = (
      <TableRow>
        <TableHeaderColumn colSpan={this.getTableColumnsNumber()} tooltip="Admin" style={{textAlign: 'center', fontWeight: 400, fontSize: 20}}>
          Admin
        </TableHeaderColumn>
      </TableRow>
      );
    }
    let headerColumns = null;
    if (isAdmin) {
      headerColumns = (
          <TableRow>
            <TableHeaderColumn>Book ID</TableHeaderColumn>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Publisher</TableHeaderColumn>
            <TableHeaderColumn>In Store</TableHeaderColumn>
            { isLogged ? <TableHeaderColumn>Actions</TableHeaderColumn> : <div style={{display: 'none'}}></div>}
          </TableRow> 
        )
    } else {
      headerColumns = (
          <TableRow>
            <TableHeaderColumn>Book ID</TableHeaderColumn>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Status</TableHeaderColumn>
            { isLogged ? <TableHeaderColumn>Actions</TableHeaderColumn> : <div style={{display: 'none'}}></div>}
          </TableRow> 
        )
    }

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

  getBookStatus(book) {
    const { borrowedBooks } = this.props;

    let found = borrowedBooks.filter(borrowedBook => borrowedBook.bookAddress === book.bookAddress)

    if (found.length > 0) {
      return 'Borrowed';
    } else if (book.availableInstances > 0) {
      return 'Available';
    } else {
      return 'Booked out';
    }
  }

  renderActionButtons(book) {
    const { isAdmin, borrowedBooks } = this.props
    let isBorrowed = !isAdmin && borrowedBooks.map(borrowedBook => borrowedBook.bookAddress).indexOf(book.bookAddress) !== -1 
    let infoButton = <FlatButton label={"Info"} primary={true} onClick={this.handleOpenBookInfo.bind(this)} />
    let buyLendButton = <FlatButton label={isAdmin ? "Buy" : "Lend"} primary={true} onClick={this.handleAction.bind(this, book.bookAddress, book.publisherAddress)}/> 
    let viewButton = <FlatButton label={"View"} primary={true} onClick={this.handleView.bind(this, book.bookAddress)} />
    let returnButton =  isBorrowed ?
            <FlatButton label={"Return"} primary={true} onClick={this.handleReturn.bind(this, book.bookAddress)} /> :
            <div></div>
    let mainActionButton = isBorrowed ? viewButton : buyLendButton;

    let buttons = (
        <div>
          { mainActionButton }
          { infoButton }
          { returnButton }
        </div>
      )
    return buttons
  }

  renderTableRows() {
    const { isLogged, isAdmin, books, borrowedBooks } = this.props

    return books.map( (book, index) => {
      let button = isLogged ? ( 
        <TableRowColumn>
          { this.renderActionButtons(book) }
        </TableRowColumn>) :
        <div style={{display: 'none'}}></div>
      return (
        <TableRow key={index}>
          <TableRowColumn>
            {'#'+book.bookAddress.slice(0, 6)}
          </TableRowColumn>
          <TableRowColumn>
            {book.name}
          </TableRowColumn>
          { isAdmin ?
              <TableRowColumn>
                {book.publisherName}
              </TableRowColumn> :
              <TableRowColumn>
                {this.getBookStatus(book)}
              </TableRowColumn>
          }
          { isAdmin ? 
            <TableRowColumn>
              {book.libraryBalance}
            </TableRowColumn> :
            <div style={{display: 'none'}}></div>
          }
          {button}
        </TableRow>
        )
    }) 
  }

  handleOpenBookInfo() {
    this.requestBookStatistics()
    this.setState({ showBookInfo: true })
  }

  handleCloseBookInfo() {
    this.setState({ showBookInfo: false })
  }

  render() {
    const { info, isLoading } = this.props

    return (
        <div>          
          <Dialog
            title={info.name}
            actions={<FlatButton label="Close" primary={true} keyboardFocused={true} onTouchTap={this.handleCloseBookInfo.bind(this)} />}
            modal={false}
            open={this.state.showBookInfo}
            style={{padding: 0}}
            onRequestClose={this.handleCloseBookInfo.bind(this)}
          >
            <Table
              fixedHeader={true}
              selectable
            >
              <TableHeader
                adjustForCheckbox={false}
                displaySelectAll={false}
              >
                <TableRow>
                  <TableHeaderColumn colSpan="2" tooltip="Publisher statistics" style={{textAlign: 'center'}}>
                    Book { info.name }
                  </TableHeaderColumn>
                </TableRow>
              </TableHeader>
              
                { isLoading ? 
                  <TableBody
                    showRowHover={true}
                    displayRowCheckbox={false}
                  >
                    <TableRow>
                      <TableRowColumn colSpan="2" style={{textAlign: 'center'}}>
                        <CircularProgress />
                      </TableRowColumn>
                    </TableRow> 
                  </TableBody>  :
                  <TableBody
                    showRowHover={true}
                    displayRowCheckbox={false}
                  >
                    <TableRow>
                      <TableRowColumn>
                        Units sold to libraries
                      </TableRowColumn>
                      <TableRowColumn>
                        { info.soldInstances }
                      </TableRowColumn>                  
                    </TableRow>                
                    <TableRow>
                      <TableRowColumn>
                        Units lent
                      </TableRowColumn>
                      <TableRowColumn>
                        { info.loans }
                      </TableRowColumn>                  
                    </TableRow> 
                  </TableBody>}          
            </Table>
          </Dialog>
          <Table
            fixedHeader={true}
            selectable
          >
            { this.renderTableHeader() }
            <TableBody
              showRowHover={true}
              displayRowCheckbox={false}
            >
              { isLoading ? 
                  <TableRow>
                    <TableRowColumn colSpan="2" style={{textAlign: 'center'}}>
                      <CircularProgress />
                    </TableRowColumn>
                  </TableRow> :
                  this.renderTableRows() } 
            </TableBody>
          </Table>
        </div>
      );
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log(ownProps)
  const info = state.infoFromBook

  return {
    books: state.books,
    isLogged: state.login.jwt !== null,
    borrowedBooks: state.borrowedBooks,
    isLoading: state.loading.isLoading,
    permissions: state.permissions,
    info,
    ...ownProps
  }
}

export default connect(mapStateToProps, { requestBooks, borrowBook, buyBook, returnBook, requestView, requestBookStatistics })(LibraryPage)