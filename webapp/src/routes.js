import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import LibraryPage from './containers/LibraryPage';
import StatisticsPage from './containers/StatisticsPage';

export default (
  <Route 
    path="/" 
    component={App}
  >
    <IndexRoute component={() => <LibraryPage isAdmin={false} />} />
    <Route 
      path="/library"
      component={() => <LibraryPage isAdmin={false}/>} 
    />
    <Route 
      path="/library/admin" 
      component={() => <LibraryPage isAdmin={true} />} 
    />
    <Route 
      path="/library/:bookId"
      component={() => <LibraryPage isAdmin={false} />}
    />  
    <Route
      path="/statistics"
      component={() => <StatisticsPage />}
    />
  </Route>
);
