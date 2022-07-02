import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Navbar from './components/Navbar';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';
import BountyDetails from './components/BountyDetails';
import ProjectSubmission from './components/ProjectSubmission';
import Submissions from './components/Submissions';
import Profile from './components/Profile';
import BountyForm from './components/bounty-components/BountyForm';
import Footer from './components/Footer';

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
  return (
    <ThemeProvider theme={theme}>
      <Router basename='/unwall/' >
        <Navbar />
        <Routes>
          <Route exact path='/' element={<Home />}></Route>
          <Route
            exact
            path='/profile/:walletAddress'
            element={<Profile />}
          ></Route>
          <Route exact path='/bounty/new/' element={<BountyForm />}></Route>
          <Route
            exact
            path='/bounty/:bountyId/'
            element={<BountyDetails />}
          ></Route>
          <Route
            exact
            path='/bounty/:bountyId/edit/'
            element={<BountyForm />}
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
      <Footer />
    </ThemeProvider>
  );
}

export default App;
