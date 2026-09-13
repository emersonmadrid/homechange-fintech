import React from 'react'
import ReactDOM from 'react-dom/client'
import LandingPage from './LandingPage.tsx'
import App from './App.tsx'
import SeleccionPerfil from './SeleccionPerfil.tsx'
import Login from './Login.tsx'
import Transacciones from './Transacciones.tsx'
import PanelControl from './PanelControl.tsx'
import MisCuentasBancarias from './MisCuentasBancarias.tsx'
import CambiarAhora from './CambiarAhora.tsx'
import EditarCliente from './EditarCliente.tsx'
import OrdenCliente from './OrdenCliente.tsx'
import RegistrarCliente from './RegistrarCliente.tsx'
import PanelGerente from './PanelGerente.tsx'
import './index.css'

const mount = (id: string, Component: React.ComponentType) => {
  const root = document.getElementById(id);
  if (root) {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <Component />
      </React.StrictMode>,
    );
  }
};

mount('root', App);
mount('ContenedorSeleccionPerfil', SeleccionPerfil);
mount('ContenedorLogin', Login);
mount('ContenedorTransacciones', Transacciones);
mount('ContenedorPanelControl', PanelControl);
mount('ContenedorMisCuentasBancarias', MisCuentasBancarias);
mount('ContenedorCambiarAhora', CambiarAhora);
mount('ContenedorEditarCliente', EditarCliente);
mount('ContenedorOrdenCliente', OrdenCliente);
mount('ContenedorRegistrarCliente', RegistrarCliente);
mount('ContenedorPanelGerente', PanelGerente);


const landingRoot = document.getElementById('LandingRoot');
if (landingRoot) {
  ReactDOM.createRoot(landingRoot).render(
    <React.StrictMode>
      <LandingPage />
    </React.StrictMode>,
  )
}
