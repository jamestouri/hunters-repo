import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Navbar from './components/Navbar';
import { ThemeProvider } from '@emotion/react';
import { Box, createTheme } from '@mui/material';
import NewBounty from './components/NewBounty';
import BountyDetails from './components/BountyDetails';
import ProjectSubmission from './components/ProjectSubmission';
import Submissions from './components/Submissions';
import Profile from './components/Profile';
import useWindowSize from './contexts/WindowSize';

const theme = createTheme({
  palette: {
    main: '#edf2f4',
    primary: { main: '#edf2f4', secondary: '#949494' },
    subColor: '#949494',
  },
  typography: {
    button: {
      textTransform: 'none',
    },
    fontWeight: '600',
  },
});

function App() {
  const size = useWindowSize();
  return (
    <Box backgroundColor='#0f041c' height={size.height} width={size.width}>
      <ThemeProvider theme={theme}>
        <Router>
          <Navbar />
          <Routes>
            <Route exact path='/' element={<Home />}></Route>
            <Route
              exact
              path='/profile/:walletAddress'
              element={<Profile />}
            ></Route>
            <Route exact path='/bounty/new/' element={<NewBounty />}></Route>
            <Route
              exact
              path='/bounty/:bountyId/'
              element={<BountyDetails />}
            ></Route>
            <Route
              exact
              path='/bounty/:bountyId/submit/'
              element={<ProjectSubmission />}
            ></Route>
            <Route
              exact
              path='/bounty/:bountyId/submissions/'
              element={<Submissions />}
            ></Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </Box>
  );
}

export default App;
