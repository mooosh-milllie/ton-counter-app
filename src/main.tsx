import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { TonConnectUIProvider } from '@tonconnect/ui-react';

let manifestUrl = "https://mooosh-milllie.github.io/ton-counter-app/tonconnect-manifest.json";
// this manifest is used temporarily for development purposes
ReactDOM.createRoot(document.getElementById('root')!).render(
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <App />
    </TonConnectUIProvider>,
)
