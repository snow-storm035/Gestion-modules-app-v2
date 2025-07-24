// // import React from 'react';
// import { useState } from 'react';
// // import './Dashboard.css';

// const Dashboard = () => {
//   const [darkMode, setDarkMode] = useState(false);

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//   };

//   return (
//     <div className={`dashboard ${darkMode ? 'dark-mode' : ''}`}>
//       {/* Sidebar */}
//       <div className="sidebar">
//         <h1>Dashboard</h1>
//         <ul className="menu">
//           <li className="active">Home</li>
//           <li>stats modules</li>
//           <li>avancements</li>
//           <li>groupes</li>
//           <li>filières</li>
//           <li>clerts</li>
//         </ul>
//         <div className="sidebar-footer">
//           <button className="logout-btn">Logout</button>
//           <button className="dark-mode-toggle" onClick={toggleDarkMode}>
//             Dark mode
//           </button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="main-content">
//         {/* Stats Cards */}
//         <div className="stats-row">
//           <div className="stat-card">
//             <h2>15</h2>
//             <p>modules presque finis</p>
//           </div>
//           <div className="stat-card">
//             <h2>5</h2> {/* Assuming a number for modules en retards */}
//             <p>modules en retards</p>
//           </div>
//         </div>

//         {/* Progress Section */}
//         <div className="progress-section">
//           <h2>Progrès des modules</h2>
//           <div className="progress-bars">
//             <div className="progress-item">
//               <span>filière 1 : 75%</span>
//               <div className="progress-bar">
//                 <div className="progress-fill" style={{ width: '75%' }}></div>
//               </div>
//             </div>
//             <div className="progress-item">
//               <span>filière 2 : 30%</span>
//               <div className="progress-bar">
//                 <div className="progress-fill" style={{ width: '30%' }}></div>
//               </div>
//             </div>
//             <div className="progress-item">
//               <span>filière 3 : 55%</span>
//               <div className="progress-bar">
//                 <div className="progress-fill" style={{ width: '55%' }}></div>
//               </div>
//             </div>
//           </div>
//           <button className="details-btn">Détails &gt;&gt;</button>
//         </div>

//         {/* Module States Section */}
//         <div className="module-states">
//           <h2>Etats modules</h2>
//           {/* This would likely contain a chart or table component */}
//           <div className="placeholder-chart"></div>
//         </div>

//         {/* EFMS Dates Section */}
//         <div className="dates-section">
//           <h2>DATES EFMS RÉGIONAUX</h2>
//           <ul className="date-list">
//             <li>DEVOWFS &gt; M205 : 20/11/2024</li>
//             <li>ID &gt; M103 : 20/11/2024</li>
//             <li>GEOGC &gt; M201 : 15/01/2025</li>
//             <li>AA &gt; M107 : 05/03/2025</li>
//             <li>DD &gt; M108 : 15/05/2025</li>
//           </ul>
//           <button className="details-btn">Détails &gt;&gt;</button>
//         </div>

//         {/* Import Button */}
//         <button className="import-btn">Importer les avancements</button>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;