import React from 'react';
   import Navbar from './components/Navbar';

   export default function App() {
     return (
       <div style={{ fontFamily: 'system-ui, sans-serif', margin: 0, padding: 0 }}>
         <Navbar />
         <main style={{ padding: '2rem', textAlign: 'center' }}>
           <h2>Entorno React Inicializado</h2>
           <p>El lienzo está en blanco y listo para visualizar modelos de datos.</p>
         </main>
       </div>
     );
   }