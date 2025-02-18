import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from 'styled-components';

import { Header } from './components/Header/Header';
import { REACT_APP_RECAPTCHA_KEY } from './config/config';
import { BookingPage } from './pages/Booking/Booking';
import { BountyPage } from './pages/bounty/Bounty';
import { BountyDone } from './pages/bounty/BountyDone';
import { InvitationPage } from './pages/bounty/Invitation';
import { MintPage } from './pages/bounty/Mint';
import { OnboardingPage } from './pages/Onboard/Onboard';
import { OnboardProfilePage } from './pages/OnboardProfile/OnboardProfile';
import { ExplorePage } from './pages/Explore/Explore';
import { HomePage } from './pages/Home/Home';
import { NotFoundPage } from './pages/NotFound/NotFound';
import { OrdersPage } from './pages/Orders/Orders';
import { SelectedOrderPage } from './pages/SelectedOrder/SelectedOrder';
import { theme } from './styles/theme';
import { BottomBar } from './components/BottomBar/BottomBar';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ThemeProvider theme={theme}>
        <GoogleReCaptchaProvider reCaptchaKey={REACT_APP_RECAPTCHA_KEY}>
          <ToastContainer />
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route index element={<HomePage />} />
              <Route path="explore" element={<ExplorePage />} />
              <Route path="bounty" element={<BountyPage />} />
              <Route path="onboarding/profile" element={<OnboardProfilePage />} />
              <Route path="bountyDone" element={<BountyDone />} />
              <Route path="invitation" element={<InvitationPage />} />
              <Route path="mint" element={<MintPage />} />
              <Route path="onboarding" element={<OnboardingPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="orders/:creator/:requestId" element={<SelectedOrderPage />} />
              <Route path="creator/:creatorId" element={<BookingPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <BottomBar />
          </BrowserRouter>
        </GoogleReCaptchaProvider>
      </ThemeProvider>
    </Web3ReactProvider>
  );
}

export default App;
