import React from 'react';
import './App.css';
import Settings from '../Settings'
import AppLayout from './AppLayout'
import AppBar from './AppBar'
import styled from 'styled-components'
import {AppProvider} from './AppProvider'

const MyButton = styled.div`
  color:green

`

function App() {
  return (
    <AppLayout>
      <AppProvider>
        <AppBar />
        <Settings />
        <MyButton>Hello</MyButton>
      </AppProvider>
      
    </AppLayout>
  );
}

export default App;
