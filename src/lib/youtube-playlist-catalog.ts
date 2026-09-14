export interface ModuleLectureItem {
  id: string;
  lessonNumber: number;
  title: string;
  duration: string;
  videoId: string;
  playlistId?: string;
  youtubeUrl?: string;
}

export const MODULE_PLAYLIST_CATALOG: Record<string, ModuleLectureItem[]> = {
  // =========================================================================
  // SEMESTER 1: APPLIED MATHEMATICS – I (316U06C101)
  // =========================================================================
  'mod-m1-1': [
    { id: 'm1-pl-1', lessonNumber: 1, title: 'Module 1: Matrices & System of Linear Equations (Full Playlist) - Pradeep Giri', duration: 'Full Series', videoId: '', playlistId: 'PLQ2Js_nO99cE', youtubeUrl: 'https://youtube.com/playlist?list=PLQ2Js_nO99cE&si=ZG3ReSPGqzrbhOyU' },
  ],

  'mod-m1-2': [
    { id: 'm2-pl-1', lessonNumber: 1, title: 'Module 2: Partial Differentiation & Applications (Full Playlist) - Pradeep Giri', duration: 'Full Series', videoId: '', playlistId: 'PLL1NiXsy4ZgU', youtubeUrl: 'https://youtube.com/playlist?list=PLL1NiXsy4ZgU&si=MWbMo9FPPWlgAVdd' },
  ],

  'mod-m1-3': [
    { id: 'm3-pl-1', lessonNumber: 1, title: 'Module 3: Homogeneous Functions & Euler’s Theorem (Full Playlist) - Pradeep Giri', duration: 'Full Series', videoId: '', playlistId: 'PLYVfNY_bT6yY', youtubeUrl: 'https://youtube.com/playlist?list=PLYVfNY_bT6yY&si=4doJAzEiYHiLHmRF' },
  ],

  'mod-m1-4': [
    { id: 'm4-pl-1', lessonNumber: 1, title: 'Module 4: Linear Differential Equations (LDE) (Full Playlist) - Pradeep Giri', duration: 'Full Series', videoId: '', playlistId: 'PLdXnNp9HebAo', youtubeUrl: 'https://youtube.com/playlist?list=PLdXnNp9HebAo&si=O-pR4nvnJAf9e8NZ' },
  ],

  'mod-m1-5': [
    { id: 'm5-pl-1', lessonNumber: 1, title: 'Module 5: Complex Numbers & Hyperbolic Functions (Full Playlist) - Saurabh Dahivadkar', duration: 'Full Series', videoId: '', playlistId: 'PLKS7ZMKnbPrSsOQDQOpYrDUp-4zQO8YFX', youtubeUrl: 'https://youtube.com/playlist?list=PLKS7ZMKnbPrSsOQDQOpYrDUp-4zQO8YFX&si=EyY0uXHV8wx3rqfL' },
  ],

  // =========================================================================
  // SEMESTER 1: ENGINEERING PHYSICS (316U06C102)
  // =========================================================================
  'mod-phy-1': [
    { id: 'phy1-jessy-1', lessonNumber: 1, title: 'Interference of Light (Full Playlist) - Physics Jessy', duration: 'Full Series', videoId: '', playlistId: 'PLm5sdXlz-wPmZa-W5Wku5ygnMi5psSN5s', youtubeUrl: 'https://youtube.com/playlist?list=PLm5sdXlz-wPmZa-W5Wku5ygnMi5psSN5s&si=tKmYP5q-Catm0Wa2' },
    { id: 'phy1-jessy-2', lessonNumber: 2, title: 'Diffraction of Light (Full Playlist) - Physics Jessy', duration: 'Full Series', videoId: '', playlistId: 'PLm5sdXlz-wPmF6vuhF_nXbRZ-JtozOiV3', youtubeUrl: 'https://youtube.com/playlist?list=PLm5sdXlz-wPmF6vuhF_nXbRZ-JtozOiV3&si=_8cCu23bHbrQjEDX' },
    { id: 'phy1-sanjiv-1', lessonNumber: 3, title: 'Diffraction of Light (Full Playlist) - Engineering Physics by Sanjiv', duration: 'Full Series', videoId: '', playlistId: 'PLQzUXa8lZVq_HKqpeG-UeZrFmDz1m0_SW', youtubeUrl: 'https://youtube.com/playlist?list=PLQzUXa8lZVq_HKqpeG-UeZrFmDz1m0_SW&si=cG1pml1KNyLCKzf-' },
    { id: 'phy1-sanjiv-2', lessonNumber: 4, title: 'Interference of Light (Full Playlist) - Engineering Physics by Sanjiv', duration: 'Full Series', videoId: '', playlistId: 'PLQzUXa8lZVq-tbELniG9R_NHKm7OQVUk9', youtubeUrl: 'https://youtube.com/playlist?list=PLQzUXa8lZVq-tbELniG9R_NHKm7OQVUk9&si=VgOjceep4J5TF-V3' },
  ],

  'mod-phy-2': [
    { id: 'phy2-jessy-1', lessonNumber: 1, title: 'Lasers & Einstein Coefficients (Full Playlist) - Physics Jessy', duration: 'Full Series', videoId: '', playlistId: 'PLm5sdXlz-wPkAloYGB-rwfvjPqz5sr-Hk', youtubeUrl: 'https://youtube.com/playlist?list=PLm5sdXlz-wPkAloYGB-rwfvjPqz5sr-Hk&si=qMP1NkRSF8U5isjU' },
    { id: 'phy2-jessy-2', lessonNumber: 2, title: 'Optical Fiber & Numerical Aperture (Full Playlist) - Physics Jessy', duration: 'Full Series', videoId: '', playlistId: 'PLm5sdXlz-wPkJXmwlwWe5VwgzkZhjJV_1', youtubeUrl: 'https://youtube.com/playlist?list=PLm5sdXlz-wPkJXmwlwWe5VwgzkZhjJV_1&si=TAwM3kXJAXN6ljmN' },
    { id: 'phy2-sanjiv-1', lessonNumber: 3, title: 'Lasers & Applications (Full Playlist) - Engineering Physics by Sanjiv', duration: 'Full Series', videoId: '', playlistId: 'PLQzUXa8lZVq-tYb-kl0_1hU_ICJtXKj2J', youtubeUrl: 'https://youtube.com/playlist?list=PLQzUXa8lZVq-tYb-kl0_1hU_ICJtXKj2J&si=x6S3vJ8un8PDEe_s' },
    { id: 'phy2-sanjiv-2', lessonNumber: 4, title: 'Optical Fiber Cable (Full Playlist) - Engineering Physics by Sanjiv', duration: 'Full Series', videoId: '', playlistId: 'PLQzUXa8lZVq8ej59AUl6bk78kMGVsT5nS', youtubeUrl: 'https://youtube.com/playlist?list=PLQzUXa8lZVq8ej59AUl6bk78kMGVsT5nS&si=kXXh31QRU7aycaoZ' },
  ],

  'mod-phy-3': [
    { id: 'phy3-jessy-1', lessonNumber: 1, title: 'Quantum Mechanics & Schrödinger Equation (Full Playlist) - Physics Jessy', duration: 'Full Series', videoId: '', playlistId: 'PLm5sdXlz-wPnYiytC0i9XP2tu48lgrMiN', youtubeUrl: 'https://youtube.com/playlist?list=PLm5sdXlz-wPnYiytC0i9XP2tu48lgrMiN&si=iBJMnSQEkBS2LeTl' },
    { id: 'phy3-sanjiv-1', lessonNumber: 2, title: 'Quantum Mechanics (Full Playlist) - Engineering Physics by Sanjiv', duration: 'Full Series', videoId: '', playlistId: 'PLQzUXa8lZVq8Zciw0MsOdPJ1t-bpPKV6_', youtubeUrl: 'https://youtube.com/playlist?list=PLQzUXa8lZVq8Zciw0MsOdPJ1t-bpPKV6_&si=sxowV_VwvhPP-ZgB' },
  ],

  'mod-phy-4': [
    { id: 'phy4-jessy-1', lessonNumber: 1, title: 'Semiconductor Physics & Fermi Level (Full Playlist) - Physics Jessy', duration: 'Full Series', videoId: '', playlistId: 'PLm5sdXlz-wPnadJGAui9KWK86cFLKNF0t', youtubeUrl: 'https://youtube.com/playlist?list=PLm5sdXlz-wPnadJGAui9KWK86cFLKNF0t&si=MNAYRk7mDx4GtKPb' },
    { id: 'phy4-jessy-2', lessonNumber: 2, title: 'Electrodynamics & Maxwell’s Equations (Full Playlist) - Physics Jessy', duration: 'Full Series', videoId: '', playlistId: 'PLm5sdXlz-wPnF73Q-AAnC8FtO92Jpc9JA', youtubeUrl: 'https://youtube.com/playlist?list=PLm5sdXlz-wPnF73Q-AAnC8FtO92Jpc9JA&si=EA67b3yg-VKNzebt' },
    { id: 'phy4-sanjiv-1', lessonNumber: 3, title: 'Semiconductor Physics (Full Playlist) - Engineering Physics by Sanjiv', duration: 'Full Series', videoId: '', playlistId: 'PLQzUXa8lZVq8lfZN5836sohUpRCt2b6oB', youtubeUrl: 'https://youtube.com/playlist?list=PLQzUXa8lZVq8lfZN5836sohUpRCt2b6oB&si=uLGns6Q_ppWDujv9' },
    { id: 'phy4-sanjiv-2', lessonNumber: 4, title: 'Electrodynamics & Maxwell Laws (Full Playlist) - Engineering Physics by Sanjiv', duration: 'Full Series', videoId: '', playlistId: 'PLQzUXa8lZVq97DPn9B7MlIm5CgTW6mMAc', youtubeUrl: 'https://youtube.com/playlist?list=PLQzUXa8lZVq97DPn9B7MlIm5CgTW6mMAc&si=vSlLZ4wSce1slZfo' },
  ],

  // =========================================================================
  // SEMESTER 1: ENGINEERING CHEMISTRY (316U06C103)
  // =========================================================================
  'mod-ch-1': [
    { id: 'ch1-avani-1', lessonNumber: 1, title: 'Module 1: Water Treatment & Hardness (Full Playlist) - Science by Avani', duration: 'Full Series', videoId: '', playlistId: 'PL2xHbdoT5bU8eQGswUpK8-223kHBuiCqz', youtubeUrl: 'https://youtube.com/playlist?list=PL2xHbdoT5bU8eQGswUpK8-223kHBuiCqz&si=5-qXIVwIlrqFbCk-' },
  ],

  'mod-ch-2': [
    { id: 'ch2-anjali-1', lessonNumber: 1, title: 'Module 2: Green Chemistry (Full Playlist) - Chemistry by Dr. Anjali Saxena', duration: 'Full Series', videoId: '', playlistId: 'PLLf6O8XdGj03fkukqcW7HOTSK8u_up7nJ', youtubeUrl: 'https://youtube.com/playlist?list=PLLf6O8XdGj03fkukqcW7HOTSK8u_up7nJ&si=t1rKVL-dCPZQ7v8M' },
  ],

  'mod-ch-3': [
    { id: 'ch3-mix-1', lessonNumber: 1, title: 'Module 3: Engineering Chemistry Tutorials (Full Playlist)', duration: 'Full Series', videoId: '', playlistId: 'PLE-8tLvduWGQ9eV3LJ0E2EtzmXUJ7ZqBz', youtubeUrl: 'https://youtube.com/playlist?list=PLE-8tLvduWGQ9eV3LJ0E2EtzmXUJ7ZqBz&si=ECQVb8tOb4vpbmht' },
  ],

  'mod-ch-4': [
    { id: 'ch4-anjali-1', lessonNumber: 1, title: 'Module 4 (Part 1): Electrochemistry (Full Playlist) - Chemistry by Dr. Anjali Saxena', duration: 'Full Series', videoId: '', playlistId: 'PLLf6O8XdGj03pNhe069q3fHouzq64Vvsm', youtubeUrl: 'https://youtube.com/playlist?list=PLLf6O8XdGj03pNhe069q3fHouzq64Vvsm&si=HwEpVQm5voAVhvYK' },
    { id: 'ch4-anjali-2', lessonNumber: 2, title: 'Module 4 (Part 2): Corrosion Science (Full Playlist) - Chemistry by Dr. Anjali Saxena', duration: 'Full Series', videoId: '', playlistId: 'PLLf6O8XdGj00lVydanLfC6bcT4aXGJN4V', youtubeUrl: 'https://youtube.com/playlist?list=PLLf6O8XdGj00lVydanLfC6bcT4aXGJN4V&si=ffsTRur_-oJ9llk6' },
  ],

  // =========================================================================
  // SEMESTER 1: BASIC ELECTRICAL ENGINEERING (316U06C104)
  // =========================================================================
  'mod-bee-1': [
    { id: 'bee1-1', lessonNumber: 1, title: 'DC Circuits Basics, Ohm’s Law & Kirchhoff’s Laws (KVL/KCL)', duration: '22:10', videoId: '0h3jP26-q5k', youtubeUrl: 'https://www.youtube.com/watch?v=0h3jP26-q5k' },
    { id: 'bee1-2', lessonNumber: 2, title: 'Thevenin’s Theorem Step-by-Step Circuit Reduction', duration: '35:10', videoId: '0h3jP26-q5k', youtubeUrl: 'https://www.youtube.com/watch?v=0h3jP26-q5k' },
    { id: 'bee1-3', lessonNumber: 3, title: 'Norton’s Theorem Equivalent Current Source Method', duration: '29:30', videoId: '0h3jP26-q5k', youtubeUrl: 'https://www.youtube.com/watch?v=0h3jP26-q5k' },
    { id: 'bee1-4', lessonNumber: 4, title: 'Maximum Power Transfer Theorem for Resistive Networks', duration: '31:20', videoId: '0h3jP26-q5k', youtubeUrl: 'https://www.youtube.com/watch?v=0h3jP26-q5k' },
  ],

  'mod-bee-2': [
    { id: 'bee2-1', lessonNumber: 1, title: 'AC Fundamentals: Generation of Sinusoidal AC, Frequency & Phase', duration: '24:00', videoId: 'ZtI9z-V3P_U', youtubeUrl: 'https://www.youtube.com/watch?v=ZtI9z-V3P_U' },
    { id: 'bee2-2', lessonNumber: 2, title: 'RMS Value, Average Value, Form Factor & Peak Factor Derivations', duration: '26:30', videoId: 'ZtI9z-V3P_U', youtubeUrl: 'https://www.youtube.com/watch?v=ZtI9z-V3P_U' },
    { id: 'bee2-3', lessonNumber: 3, title: 'Series R-L, R-C, and R-L-C Circuit Impedance & Resonance', duration: '36:00', videoId: 'ZtI9z-V3P_U', youtubeUrl: 'https://www.youtube.com/watch?v=ZtI9z-V3P_U' },
  ],

  'mod-bee-3': [
    { id: 'bee3-1', lessonNumber: 1, title: 'Balanced Star (Y) & Delta (Δ) Connected 3-Phase Systems', duration: '29:10', videoId: 'UfG1zTj0j8M', youtubeUrl: 'https://www.youtube.com/watch?v=UfG1zTj0j8M' },
    { id: 'bee3-2', lessonNumber: 2, title: 'Power Measurement in 3-Phase Circuits using Two-Wattmeter Method', duration: '38:15', videoId: 'UfG1zTj0j8M', youtubeUrl: 'https://www.youtube.com/watch?v=UfG1zTj0j8M' },
  ],

  'mod-bee-4': [
    { id: 'bee4-1', lessonNumber: 1, title: 'Single Phase Transformer Principle, Construction & EMF Equation', duration: '30:20', videoId: '0h3jP26-q5k', youtubeUrl: 'https://www.youtube.com/watch?v=0h3jP26-q5k' },
    { id: 'bee4-2', lessonNumber: 2, title: 'Transformer Losses, Efficiency & 3-Phase Induction Motor Basics', duration: '34:10', videoId: '0h3jP26-q5k', youtubeUrl: 'https://www.youtube.com/watch?v=0h3jP26-q5k' },
  ],

  // =========================================================================
  // SEMESTER 1: ENGINEERING DRAWING (316U06C105)
  // =========================================================================
  'mod-ed-1': [
    { id: 'ed1-1', lessonNumber: 1, title: 'First Angle vs Third Angle Projection Methods', duration: '28:00', videoId: 'gT8wNlV_V_E', youtubeUrl: 'https://www.youtube.com/watch?v=gT8wNlV_V_E' },
    { id: 'ed1-2', lessonNumber: 2, title: 'Orthographic Projections: Front View, Top View & Side View', duration: '38:45', videoId: 'gT8wNlV_V_E', youtubeUrl: 'https://www.youtube.com/watch?v=gT8wNlV_V_E' },
  ],

  'mod-ed-2': [
    { id: 'ed2-1', lessonNumber: 1, title: 'Projections of Straight Lines Inclined to HP and VP', duration: '36:10', videoId: '0k52fM43d7s', youtubeUrl: 'https://www.youtube.com/watch?v=0k52fM43d7s' },
    { id: 'ed2-2', lessonNumber: 2, title: 'Projections of Regular Geometric Planes', duration: '29:40', videoId: '0k52fM43d7s', youtubeUrl: 'https://www.youtube.com/watch?v=0k52fM43d7s' },
  ],

  'mod-ed-3': [
    { id: 'ed3-1', lessonNumber: 1, title: 'Projections of Solids (Prisms, Pyramids, Cylinders, Cones)', duration: '35:00', videoId: 'yW6S4WzW62Y', youtubeUrl: 'https://www.youtube.com/watch?v=yW6S4WzW62Y' },
    { id: 'ed3-2', lessonNumber: 2, title: 'Lateral Surface Development of Truncated Solids', duration: '31:15', videoId: 'yW6S4WzW62Y', youtubeUrl: 'https://www.youtube.com/watch?v=yW6S4WzW62Y' },
  ],

  'mod-ed-4': [
    { id: 'ed4-1', lessonNumber: 1, title: 'Isometric Scale Construction & Machine Block Views', duration: '34:50', videoId: '8S_6h04n1fM', youtubeUrl: 'https://www.youtube.com/watch?v=8S_6h04n1fM' },
  ],

  // =========================================================================
  // SEMESTER 1: STRUCTURED PROGRAMMING METHODOLOGY (C) (316U06C107)
  // =========================================================================
  'mod-spm-1': [
    { id: 'spm1-1', lessonNumber: 1, title: 'Problem Solving Concepts: Algorithms, Flowcharts & Pseudo-code', duration: '24:10', videoId: 'YXcgD8hRHYY', youtubeUrl: 'https://www.youtube.com/watch?v=YXcgD8hRHYY' },
    { id: 'spm1-2', lessonNumber: 2, title: 'Basic C Program Structure, Data Types, Variables & Constants', duration: '26:30', videoId: 'YXcgD8hRHYY', youtubeUrl: 'https://www.youtube.com/watch?v=YXcgD8hRHYY' },
  ],

  'mod-spm-2': [
    { id: 'spm2-1', lessonNumber: 1, title: 'Conditional Branching: if, if-else, nested if & switch-case', duration: '28:30', videoId: 'YXcgD8hRHYY', youtubeUrl: 'https://www.youtube.com/watch?v=YXcgD8hRHYY' },
    { id: 'spm2-2', lessonNumber: 2, title: 'Iteration: while, do-while, and for loop control statements', duration: '31:15', videoId: 'YXcgD8hRHYY', youtubeUrl: 'https://www.youtube.com/watch?v=YXcgD8hRHYY' },
  ],

  'mod-spm-3': [
    { id: 'spm3-1', lessonNumber: 1, title: '1D Array Declaration, Initialization, Traversal & Search Algorithms', duration: '29:30', videoId: 'YXcgD8hRHYY', youtubeUrl: 'https://www.youtube.com/watch?v=YXcgD8hRHYY' },
    { id: 'spm3-2', lessonNumber: 2, title: '2D Array Matrix Operations & String Handling in C', duration: '35:40', videoId: 'YXcgD8hRHYY', youtubeUrl: 'https://www.youtube.com/watch?v=YXcgD8hRHYY' },
  ],

  'mod-spm-4': [
    { id: 'spm4-1', lessonNumber: 1, title: 'User Defined Functions & Call by Value vs Reference', duration: '25:20', videoId: 'YXcgD8hRHYY', youtubeUrl: 'https://www.youtube.com/watch?v=YXcgD8hRHYY' },
    { id: 'spm4-2', lessonNumber: 2, title: 'Pointers Basics, Pointer Arithmetic & Dynamic Memory (malloc, free)', duration: '38:00', videoId: 'YXcgD8hRHYY', youtubeUrl: 'https://www.youtube.com/watch?v=YXcgD8hRHYY' },
  ],

  // =========================================================================
  // SEMESTER 2: APPLIED MATHEMATICS – II (316U06C201)
  // =========================================================================
  'mod-m2-1': [
    { id: 'm2sub1-1', lessonNumber: 1, title: 'Exact First Order ODEs, Integrating Factors & Orthogonal Trajectories', duration: '29:10', videoId: '3-lQ4zWl4qQ', youtubeUrl: 'https://www.youtube.com/watch?v=3-lQ4zWl4qQ' },
  ],
  'mod-m2-2': [
    { id: 'm2sub2-1', lessonNumber: 1, title: 'Higher Order Linear ODEs, Cauchy-Euler & Variation of Parameters', duration: '34:20', videoId: 'U9l1K5uQy8Y', youtubeUrl: 'https://www.youtube.com/watch?v=U9l1K5uQy8Y' },
  ],
  'mod-m2-3': [
    { id: 'm2sub3-1', lessonNumber: 1, title: 'Beta & Gamma Functions Standard Properties & DUIS', duration: '28:40', videoId: '2-fN8r4sU-s', youtubeUrl: 'https://www.youtube.com/watch?v=2-fN8r4sU-s' },
  ],
  'mod-m2-4': [
    { id: 'm2sub4-1', lessonNumber: 1, title: 'Double Integrals & Area Calculations in Cartesian/Polar Coordinates', duration: '36:00', videoId: 'G7j2P3l9M2w', youtubeUrl: 'https://www.youtube.com/watch?v=G7j2P3l9M2w' },
  ],

  // =========================================================================
  // SEMESTER 2: OBJECT-ORIENTED PROGRAMMING (C++) (316U06C205)
  // =========================================================================
  'mod-oop-1': [
    { id: 'oop1-1', lessonNumber: 1, title: 'Classes, Objects & Data Encapsulation Principles in C++', duration: '31:20', videoId: 'z9bZufPHFLU', youtubeUrl: 'https://www.youtube.com/watch?v=z9bZufPHFLU' },
  ],
  'mod-oop-2': [
    { id: 'oop2-1', lessonNumber: 1, title: 'Constructors, Destructors & Operator Overloading in C++', duration: '27:45', videoId: 'z9bZufPHFLU', youtubeUrl: 'https://www.youtube.com/watch?v=z9bZufPHFLU' },
  ],
  'mod-oop-3': [
    { id: 'oop3-1', lessonNumber: 1, title: 'Inheritance Types, Virtual Functions & Polymorphism', duration: '36:00', videoId: 'z9bZufPHFLU', youtubeUrl: 'https://www.youtube.com/watch?v=z9bZufPHFLU' },
  ],
  'mod-oop-4': [
    { id: 'oop4-1', lessonNumber: 1, title: 'Templates, Exception Handling & Standard Template Library (STL)', duration: '42:15', videoId: 'z9bZufPHFLU', youtubeUrl: 'https://www.youtube.com/watch?v=z9bZufPHFLU' },
  ],

  // =========================================================================
  // SEMESTER 2: ENVIRONMENTAL SCIENCE (316U06C204)
  // =========================================================================
  'mod-evs-1': [
    { id: 'evs1-1', lessonNumber: 1, title: 'Ecosystem Dynamics, Biodiversity & Conservation', duration: '26:10', videoId: 'de9vwMGgTvg', youtubeUrl: 'https://www.youtube.com/watch?v=de9vwMGgTvg' },
  ],
  'mod-evs-2': [
    { id: 'evs2-1', lessonNumber: 1, title: 'Pollution Control Technologies & Environmental Laws', duration: '29:40', videoId: '9_H8XWz9J_g', youtubeUrl: 'https://www.youtube.com/watch?v=9_H8XWz9J_g' },
  ],
};
