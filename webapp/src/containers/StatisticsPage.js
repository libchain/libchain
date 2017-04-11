import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import {
  Table, 
  TableBody, 
  TableHeader, 
  TableHeaderColumn, 
  TableRow, 
  TableRowColumn
} from 'material-ui/Table';

import Paper from 'material-ui/Paper';

import { requestLibraryAndPublisherStatistics } from '../actions';


class StatisticsPage extends Component {
  static PropTypes = {
    library: PropTypes.object,
    publisher: PropTypes.array
  }

  componentDidMount() {
    this.requestLibraryAndPublisherStatistics();
  }

  constructor() {
    super();
  }

  render() {
    return (
        <div>
          { this.props.publishers.map(publisher => {
            return <Paper style={{margin: 40}}>
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
                    Publisher { publisher.name }
                  </TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody
                showRowHover={true}
                displayRowCheckbox={false}
              >
                <TableRow>
                  <TableRowColumn>
                    Unit sold
                  </TableRowColumn>
                  <TableRowColumn>
                    { publisher.soldInstances }
                  </TableRowColumn>                  
                </TableRow>                
                <TableRow>
                  <TableRowColumn>
                    Published works
                  </TableRowColumn>
                  <TableRowColumn>
                    { publisher.books }
                  </TableRowColumn>                  
                </TableRow>                
              </TableBody>
            </Table>
          </Paper>
          })}
          <Paper style={{margin: 40}}>
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
                    Library { /* library.name */ }
                  </TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody
                showRowHover={true}
                displayRowCheckbox={false}
              >
                <TableRow>
                  <TableRowColumn>
                    Bought units
                  </TableRowColumn>
                  <TableRowColumn>
                    {/*library.boughtInstances*/}
                  </TableRowColumn>                  
                </TableRow>                
                <TableRow>
                  <TableRowColumn>
                    Loaned units
                  </TableRowColumn>
                  <TableRowColumn>
                    {/*library.loans*/}
                  </TableRowColumn>                  
                </TableRow>                         
                <TableRow>
                  <TableRowColumn>
                    Returned units
                  </TableRowColumn>
                  <TableRowColumn>
                    {/*library.returns*/}
                  </TableRowColumn>                  
                </TableRow>                
              </TableBody>
            </Table>
          </Paper>
        </div>
      );
  }
}

const mapStateToProps = (state, ownProps) => {
  const library = {};
  const publishers = [{ name: 'TU Berlin', soldInstances: 5, books: 10 }, { name: 'HU Berlin', soldInstances: 10, books: 5 }];
  return {
    library: state.statistics.library,
    publishers: state.statistics.publishers,
    ...ownProps
  }
}

export default connect(mapStateToProps, { requestLibraryAndPublisherStatistics })(StatisticsPage)