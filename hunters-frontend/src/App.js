import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Navbar from './components/Navbar';
import { ThemeProvider } from '@emotion/react';
import { createTheme, Box } from '@mui/material';
import NewBounty from './components/NewBounty';
import BountyDetails from './components/BountyDetails';

const theme = createTheme({
  typography: {
    button: {
      textTransform: 'none',
    },
    fontWeight: '600',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path='/' element={<Home />}></Route>
          <Route exact path='/bounty/new/' element={<NewBounty />}></Route>
          <Route exact path='/bounty/:bountyId/' element={<BountyDetails />}></Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
