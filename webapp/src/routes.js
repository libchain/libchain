import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import LibraryPage from './containers/LibraryPage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={() => <LibraryPage isLogged={true} />} />
    <Route 
      path="/library"
      component={() => <LibraryPage isLogged={true} />} >
      <Route 
        path="/admin" 
        component={LibraryPage} >
        <Route 
          path="/admin/:bookId"
          component={LibraryPage}
          />
      </Route>
    </Route>
    <Route path="/book/:bookId" component={LibraryPage} />
  </Route>
);
