import logo from './logo.svg';
import './App.css';
import Home from './Home';
import Navbar from './components/Navbar';
import { ThemeProvider } from '@emotion/react';
import { createTheme, Box } from '@mui/material';
import SideNav from './components/SideNav';

const theme = createTheme({
  typography: {
    button: {
      textTransform: 'none',
    },
    fontWeight: '600'
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SideNav />
      <Box marginLeft='240px'>
        <Navbar />
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <Home />
          <a
            className='App-link'
            href='https://reactjs.org'
            target='_blank'
            rel='noopener noreferrer'
          >
            Learn React
          </a>
        </header>
      </Box>
    </ThemeProvider>
  );
}

export default App;
