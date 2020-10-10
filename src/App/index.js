import React from 'react';
import './App.css';
import Settings from '../Settings'
import AppLayout from './AppLayout'
import AppBar from './AppBar'
import styled from 'styled-components'
import {AppProvider} from './AppProvider'
import Content from '../Shared/Content'
import Dashboard from '../Dashboard'
const MyButton = styled.div`
  color:green

`

function App() {
  return (
    <AppLayout>
      <AppProvider>
        <AppBar />
        <Content>
          <Settings />
          <Dashboard />
        </Content>
      </AppProvider>
      
    </AppLayout>
  );
}

export default App;
