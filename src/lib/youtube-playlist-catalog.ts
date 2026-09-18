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
    { id: 'bee1-pce-1', lessonNumber: 1, title: 'Module 1: DC Circuits & Network Theorems (Full Playlist) - Perfect Computer Engineer', duration: 'Full Series', videoId: '', playlistId: 'PLPIwNooIb9vjC5Hz7xIUXJw54LkB2MG2i', youtubeUrl: 'https://youtube.com/playlist?list=PLPIwNooIb9vjC5Hz7xIUXJw54LkB2MG2i&si=ONirEgZpnE8pAGQ2' },
  ],

  'mod-bee-2': [
    { id: 'bee2-pce-1', lessonNumber: 1, title: 'Module 2: AC Circuits (Single Phase) (Full Playlist) - Perfect Computer Engineer', duration: 'Full Series', videoId: '', playlistId: 'PLPIwNooIb9vgYjKb1N14ITkmhX2oNrNi3', youtubeUrl: 'https://youtube.com/playlist?list=PLPIwNooIb9vgYjKb1N14ITkmhX2oNrNi3&si=sOtE-MRfEcECn-pB' },
    { id: 'bee2-ekeeda-1', lessonNumber: 2, title: 'Module 2: AC Circuits (Full Course) - Ekeeda', duration: 'Full Series', videoId: '', playlistId: 'PL4K9r9dYCOorFJYvPZ3VBLDJVpWA5p481', youtubeUrl: 'https://youtube.com/playlist?list=PL4K9r9dYCOorFJYvPZ3VBLDJVpWA5p481&si=jzOD6yA6KxHMEbbe' },
    { id: 'bee2-saurabh-1', lessonNumber: 3, title: 'Module 2: AC Fundamentals & Resonance - Saurabh Dahivadkar', duration: 'Full Series', videoId: '', playlistId: 'PLKS7ZMKnbPrQZP4zxS47bzkf8sGYlaIKM', youtubeUrl: 'https://youtube.com/playlist?list=PLKS7ZMKnbPrQZP4zxS47bzkf8sGYlaIKM&si=UOBk3HHNQ4uu-b2e' },
  ],

  'mod-bee-3': [
    { id: 'bee3-saurabh-1', lessonNumber: 1, title: 'Module 3: Three Phase AC Circuits - Saurabh Dahivadkar', duration: 'Full Series', videoId: '', playlistId: 'PLKS7ZMKnbPrSS6_Mk0UbOySQzDBY-uHJQ', youtubeUrl: 'https://youtube.com/playlist?list=PLKS7ZMKnbPrSS6_Mk0UbOySQzDBY-uHJQ&si=kJlmzuqGUhfI-vf2' },
    { id: 'bee3-ekeeda-1', lessonNumber: 2, title: 'Module 3: Three Phase AC Systems - Ekeeda', duration: 'Full Series', videoId: '', playlistId: 'PL4K9r9dYCOooO5s49HTN7Tavmg5q_Ufqn', youtubeUrl: 'https://youtube.com/playlist?list=PL4K9r9dYCOooO5s49HTN7Tavmg5q_Ufqn&si=9LC-HNMVs5wzUeoy' },
  ],

  'mod-bee-4': [
    { id: 'bee4-ekeeda-1', lessonNumber: 1, title: 'Module 4 (Part 1): Single Phase Transformers - Ekeeda', duration: 'Full Series', videoId: '', playlistId: 'PL4K9r9dYCOors6MRFwoIe9_iBzSzUp2Zi', youtubeUrl: 'https://youtube.com/playlist?list=PL4K9r9dYCOors6MRFwoIe9_iBzSzUp2Zi&si=aOD_gO13eU-Kion9' },
    { id: 'bee4-ekeeda-2', lessonNumber: 2, title: 'Module 4 (Part 2): Electrical Machines & Induction Motors - Ekeeda', duration: 'Full Series', videoId: '', playlistId: 'PL4K9r9dYCOooB-nXHA6uOBmaWMDYrhhLM', youtubeUrl: 'https://youtube.com/playlist?list=PL4K9r9dYCOooB-nXHA6uOBmaWMDYrhhLM&si=AKN0W2oKTUN31AK4' },
  ],

  // =========================================================================
  // SEMESTER 1: ENGINEERING DRAWING (316U06C105)
  // =========================================================================
  'mod-ed-1': [
    { id: 'ed1-tikle-1', lessonNumber: 1, title: 'Module 1: Orthographic Projections & Sectional Views (Full Playlist) - Tikle\'s Academy', duration: 'Full Series', videoId: '', playlistId: 'PLDN15nk5uLiBpnIOK5r3KXdfFOVzGHJSt', youtubeUrl: 'https://youtube.com/playlist?list=PLDN15nk5uLiBpnIOK5r3KXdfFOVzGHJSt&si=RwRN9EflwUAr0Pt7' },
  ],

  'mod-ed-2': [
    { id: 'ed2-tikle-1', lessonNumber: 1, title: 'Module 2 (Part 1): Projections of Straight Lines (Full Playlist) - Tikle\'s Academy', duration: 'Full Series', videoId: '', playlistId: 'PLDN15nk5uLiC9wFOTiDp8ekWAf40BwSct', youtubeUrl: 'https://youtube.com/playlist?list=PLDN15nk5uLiC9wFOTiDp8ekWAf40BwSct&si=Um3PX5FKCcGvNgYv' },
    { id: 'ed2-tikle-2', lessonNumber: 2, title: 'Module 2 (Part 2): Projections of Planes (Full Playlist) - Tikle\'s Academy', duration: 'Full Series', videoId: '', playlistId: 'PLDN15nk5uLiBVR22X01vcnvVCuQIklXGx', youtubeUrl: 'https://youtube.com/playlist?list=PLDN15nk5uLiBVR22X01vcnvVCuQIklXGx&si=cNFbH398QwhIhnBF' },
  ],

  'mod-ed-3': [
    { id: 'ed3-tikle-1', lessonNumber: 1, title: 'Module 3: Projections of Solids (Full Playlist) - Tikle\'s Academy', duration: 'Full Series', videoId: '', playlistId: 'PLDN15nk5uLiA9qy-OWuoEYoXsu7lsSaE9', youtubeUrl: 'https://youtube.com/playlist?list=PLDN15nk5uLiA9qy-OWuoEYoXsu7lsSaE9&si=HjUWflNeAWl7Z2Uw' },
  ],

  'mod-ed-4': [
    { id: 'ed4-tikle-1', lessonNumber: 1, title: 'Module 4: Sections & Lateral Development of Solids (Full Playlist) - Tikle\'s Academy', duration: 'Full Series', videoId: '', playlistId: 'PLDN15nk5uLiCxbMOdIIVDZ4i1IslzrT1W', youtubeUrl: 'https://youtube.com/playlist?list=PLDN15nk5uLiCxbMOdIIVDZ4i1IslzrT1W&si=DqvKa8KrKhi0ZBdm' },
  ],

  'mod-ed-5': [
    { id: 'ed5-tikle-1', lessonNumber: 1, title: 'Module 5: Isometric Projections & Views (Full Playlist) - Tikle\'s Academy', duration: 'Full Series', videoId: '', playlistId: 'PLDN15nk5uLiBrAkdOhEvkmVPs2UtwfGao', youtubeUrl: 'https://youtube.com/playlist?list=PLDN15nk5uLiBrAkdOhEvkmVPs2UtwfGao&si=4w1w9DycP7T85bXP' },
  ],

  // =========================================================================
  // SEMESTER 1: STRUCTURED PROGRAMMING METHODOLOGY (C/C++) (316U06C107)
  // =========================================================================
  'mod-spm-1': [
    { id: 'spm1-ab-initio', lessonNumber: 1, title: 'Programming & OST (Full Course) - Ab Initio (Kaustubh Sir)', duration: 'Full Series', videoId: '', playlistId: 'PLILyE8uN3CXMm2XkwNPKu3Y7qBSipP1R9', youtubeUrl: 'https://youtube.com/playlist?list=PLILyE8uN3CXMm2XkwNPKu3Y7qBSipP1R9&si=5oJ-9NrerRHEvbhI' },
    { id: 'spm1-cwh', lessonNumber: 2, title: 'Programming Tutorials in Hindi (Full Playlist) - CodeWithHarry', duration: 'Full Series', videoId: '', playlistId: 'PLu0W_9lII9agpFUAlPFe_VNSlXW5uE0YL', youtubeUrl: 'https://youtube.com/playlist?list=PLu0W_9lII9agpFUAlPFe_VNSlXW5uE0YL&si=hczkeMUtEYycxhAW' },
    { id: 'spm1-coderarmy', lessonNumber: 3, title: 'Complete Programming Course - Coder Army', duration: 'Full Series', videoId: '', playlistId: 'PLQEaRBV9gAFsdNoZYUcVG6ygpwd0lUrIH', youtubeUrl: 'https://youtube.com/playlist?list=PLQEaRBV9gAFsdNoZYUcVG6ygpwd0lUrIH&si=C-d85jKjoIZCbQ-a' },
  ],

  'mod-spm-2': [
    { id: 'spm2-ab-initio', lessonNumber: 1, title: 'Module 2: Control Structures & Loops - Ab Initio', duration: 'Full Series', videoId: '', playlistId: 'PLILyE8uN3CXMm2XkwNPKu3Y7qBSipP1R9', youtubeUrl: 'https://youtube.com/playlist?list=PLILyE8uN3CXMm2XkwNPKu3Y7qBSipP1R9&si=5oJ-9NrerRHEvbhI' },
    { id: 'spm2-cwh', lessonNumber: 2, title: 'Module 2: Conditionals & Loops - CodeWithHarry', duration: 'Full Series', videoId: '', playlistId: 'PLu0W_9lII9agpFUAlPFe_VNSlXW5uE0YL', youtubeUrl: 'https://youtube.com/playlist?list=PLu0W_9lII9agpFUAlPFe_VNSlXW5uE0YL&si=hczkeMUtEYycxhAW' },
  ],

  'mod-spm-3': [
    { id: 'spm3-ab-initio', lessonNumber: 1, title: 'Module 3: Arrays & Strings - Ab Initio', duration: 'Full Series', videoId: '', playlistId: 'PLILyE8uN3CXMm2XkwNPKu3Y7qBSipP1R9', youtubeUrl: 'https://youtube.com/playlist?list=PLILyE8uN3CXMm2XkwNPKu3Y7qBSipP1R9&si=5oJ-9NrerRHEvbhI' },
    { id: 'spm3-coderarmy', lessonNumber: 2, title: 'Module 3: Arrays & String Manipulation - Coder Army', duration: 'Full Series', videoId: '', playlistId: 'PLQEaRBV9gAFsdNoZYUcVG6ygpwd0lUrIH', youtubeUrl: 'https://youtube.com/playlist?list=PLQEaRBV9gAFsdNoZYUcVG6ygpwd0lUrIH&si=C-d85jKjoIZCbQ-a' },
  ],

  'mod-spm-4': [
    { id: 'spm4-ab-initio', lessonNumber: 1, title: 'Module 4: Functions, Pointers & Memory - Ab Initio', duration: 'Full Series', videoId: '', playlistId: 'PLILyE8uN3CXMm2XkwNPKu3Y7qBSipP1R9', youtubeUrl: 'https://youtube.com/playlist?list=PLILyE8uN3CXMm2XkwNPKu3Y7qBSipP1R9&si=5oJ-9NrerRHEvbhI' },
    { id: 'spm4-cwh', lessonNumber: 2, title: 'Module 4: Pointers & Dynamic Memory - CodeWithHarry', duration: 'Full Series', videoId: '', playlistId: 'PLu0W_9lII9agpFUAlPFe_VNSlXW5uE0YL', youtubeUrl: 'https://youtube.com/playlist?list=PLu0W_9lII9agpFUAlPFe_VNSlXW5uE0YL&si=hczkeMUtEYycxhAW' },
  ],

  // =========================================================================
  // SEMESTER 2: APPLIED MATHEMATICS – II (316U06C201)
  // =========================================================================
  'mod-m2-1': [
    { id: 'm2-1-pradeep', lessonNumber: 1, title: 'Module 1: Eigenvalues and Eigenvectors (Full Playlist) - Pradeep Giri', duration: 'Full Series', videoId: '', playlistId: 'PLVloHBWdUExc', youtubeUrl: 'https://youtube.com/playlist?list=PLVloHBWdUExc&si=YsRnVx8pLTscZ7fK' },
  ],
  'mod-m2-2': [
    { id: 'm2-2-pradeep', lessonNumber: 1, title: 'Module 2: Successive Differentiation & Expansion of Functions (Full Playlist) - Pradeep Giri', duration: 'Full Series', videoId: '', playlistId: 'PLGZl4p6vpALc', youtubeUrl: 'https://youtube.com/playlist?list=PLGZl4p6vpALc&si=F_rPd3vuYn_C5jTF' },
  ],
  'mod-m2-3': [
    { id: 'm2-3-pradeep', lessonNumber: 1, title: 'Module 3: Beta & Gamma Functions & DUIS (Full Playlist) - Pradeep Giri', duration: 'Full Series', videoId: '', playlistId: 'PLZlV12KqUIyc', youtubeUrl: 'https://youtube.com/playlist?list=PLZlV12KqUIyc&si=1iC-E89f0vgQOrLb' },
  ],
  'mod-m2-4': [
    { id: 'm2-4-mathmagix', lessonNumber: 1, title: 'Module 4: Rectification of Plane Curves (Full Playlist) - MathMagix', duration: 'Full Series', videoId: '', playlistId: 'PLMoHHTLiAvKU', youtubeUrl: 'https://youtube.com/playlist?list=PLMoHHTLiAvKU&si=JRPfBkWwFCogLHYR' },
  ],
  'mod-m2-5': [
    { id: 'm2-5-mix', lessonNumber: 1, title: 'Module 5: Multiple Integration & Applications (Full Playlist)', duration: 'Full Series', videoId: '', playlistId: 'PLD0wrDr01Qiw', youtubeUrl: 'https://youtube.com/playlist?list=PLD0wrDr01Qiw&si=toiT0vHVdDt490mu' },
  ],

  // =========================================================================
  // SEMESTER 2: OBJECT-ORIENTED PROGRAMMING (C++) (316U06C205)
  // =========================================================================
  'mod-oop-1': [
    { id: 'oop1-brocode', lessonNumber: 1, title: 'C++ Full Course (Classes & Objects) - BroCode', duration: 'Full Series', videoId: '', playlistId: 'PLKqZXXNji-5U', youtubeUrl: 'https://youtube.com/playlist?list=PLKqZXXNji-5U&si=yCRmZlY8TPBtLAB5' },
    { id: 'oop1-ab-initio', lessonNumber: 2, title: 'C++ OST (Full Course) - Ab Initio (Kaustubh Sir)', duration: 'Full Series', videoId: '', playlistId: 'PLILyE8uN3CXMm2XkwNPKu3Y7qBSipP1R9', youtubeUrl: 'https://youtube.com/playlist?list=PLILyE8uN3CXMm2XkwNPKu3Y7qBSipP1R9&si=5oJ-9NrerRHEvbhI' },
    { id: 'oop1-cwh', lessonNumber: 3, title: 'C++ Tutorials in Hindi (Full Playlist) - CodeWithHarry', duration: 'Full Series', videoId: '', playlistId: 'PLu0W_9lII9agpFUAlPFe_VNSlXW5uE0YL', youtubeUrl: 'https://youtube.com/playlist?list=PLu0W_9lII9agpFUAlPFe_VNSlXW5uE0YL&si=hczkeMUtEYycxhAW' },
    { id: 'oop1-coderarmy', lessonNumber: 4, title: 'C++ Complete Course - Coder Army', duration: 'Full Series', videoId: '', playlistId: 'PLQEaRBV9gAFsdNoZYUcVG6ygpwd0lUrIH', youtubeUrl: 'https://youtube.com/playlist?list=PLQEaRBV9gAFsdNoZYUcVG6ygpwd0lUrIH&si=C-d85jKjoIZCbQ-a' },
  ],
  'mod-oop-2': [
    { id: 'oop2-brocode', lessonNumber: 1, title: 'Constructors & Operator Overloading - BroCode', duration: 'Full Series', videoId: '', playlistId: 'PLKqZXXNji-5U', youtubeUrl: 'https://youtube.com/playlist?list=PLKqZXXNji-5U&si=yCRmZlY8TPBtLAB5' },
    { id: 'oop2-ab-initio', lessonNumber: 2, title: 'Constructors & Operator Overloading - Ab Initio', duration: 'Full Series', videoId: '', playlistId: 'PLILyE8uN3CXMm2XkwNPKu3Y7qBSipP1R9', youtubeUrl: 'https://youtube.com/playlist?list=PLILyE8uN3CXMm2XkwNPKu3Y7qBSipP1R9&si=5oJ-9NrerRHEvbhI' },
    { id: 'oop2-cwh', lessonNumber: 3, title: 'Constructors & Overloading in C++ - CodeWithHarry', duration: 'Full Series', videoId: '', playlistId: 'PLu0W_9lII9agpFUAlPFe_VNSlXW5uE0YL', youtubeUrl: 'https://youtube.com/playlist?list=PLu0W_9lII9agpFUAlPFe_VNSlXW5uE0YL&si=hczkeMUtEYycxhAW' },
  ],
  'mod-oop-3': [
    { id: 'oop3-brocode', lessonNumber: 1, title: 'Inheritance & Polymorphism - BroCode', duration: 'Full Series', videoId: '', playlistId: 'PLKqZXXNji-5U', youtubeUrl: 'https://youtube.com/playlist?list=PLKqZXXNji-5U&si=yCRmZlY8TPBtLAB5' },
    { id: 'oop3-ab-initio', lessonNumber: 2, title: 'Inheritance & Virtual Functions - Ab Initio', duration: 'Full Series', videoId: '', playlistId: 'PLILyE8uN3CXMm2XkwNPKu3Y7qBSipP1R9', youtubeUrl: 'https://youtube.com/playlist?list=PLILyE8uN3CXMm2XkwNPKu3Y7qBSipP1R9&si=5oJ-9NrerRHEvbhI' },
    { id: 'oop3-cwh', lessonNumber: 3, title: 'Inheritance & Polymorphism - CodeWithHarry', duration: 'Full Series', videoId: '', playlistId: 'PLu0W_9lII9agpFUAlPFe_VNSlXW5uE0YL', youtubeUrl: 'https://youtube.com/playlist?list=PLu0W_9lII9agpFUAlPFe_VNSlXW5uE0YL&si=hczkeMUtEYycxhAW' },
  ],
  'mod-oop-4': [
    { id: 'oop4-brocode', lessonNumber: 1, title: 'Templates, Pointers & STL - BroCode', duration: 'Full Series', videoId: '', playlistId: 'PLKqZXXNji-5U', youtubeUrl: 'https://youtube.com/playlist?list=PLKqZXXNji-5U&si=yCRmZlY8TPBtLAB5' },
    { id: 'oop4-ab-initio', lessonNumber: 2, title: 'Templates & STL - Ab Initio', duration: 'Full Series', videoId: '', playlistId: 'PLILyE8uN3CXMm2XkwNPKu3Y7qBSipP1R9', youtubeUrl: 'https://youtube.com/playlist?list=PLILyE8uN3CXMm2XkwNPKu3Y7qBSipP1R9&si=5oJ-9NrerRHEvbhI' },
    { id: 'oop4-coderarmy', lessonNumber: 3, title: 'STL & Advanced C++ - Coder Army', duration: 'Full Series', videoId: '', playlistId: 'PLQEaRBV9gAFsdNoZYUcVG6ygpwd0lUrIH', youtubeUrl: 'https://youtube.com/playlist?list=PLQEaRBV9gAFsdNoZYUcVG6ygpwd0lUrIH&si=C-d85jKjoIZCbQ-a' },
  ],

  // =========================================================================
  // SEMESTER 2: DIGITAL LOGIC DESIGN (316U06C203)
  // =========================================================================
  'mod-dld-1': [
    { id: 'dld-sudhakar', lessonNumber: 1, title: 'Digital Logic Design: Complete Course - Sudhakar Atchala', duration: 'Full Series', videoId: '', playlistId: 'PLXj4XH7LcRfBQXAd8FPZXmMzxZY-rViLP', youtubeUrl: 'https://youtube.com/playlist?list=PLXj4XH7LcRfBQXAd8FPZXmMzxZY-rViLP&si=tdTTFU6BtL4vIDad' },
    { id: 'dld-neso', lessonNumber: 2, title: 'Digital Electronics & Logic Design (Full Playlist) - Neso Academy', duration: 'Full Series', videoId: '', playlistId: 'PLBlnK6fEyqRjMH3mWf6kwqiTbT798eAOm', youtubeUrl: 'https://youtube.com/playlist?list=PLBlnK6fEyqRjMH3mWf6kwqiTbT798eAOm&si=29-KAx_-9bePTkuA' },
    { id: 'dld-aae', lessonNumber: 3, title: 'Digital Electronics (Complete Master Series) - All About Electronics', duration: 'Full Series', videoId: '', playlistId: 'PLwjK_iyK4LLBC_so3odA64E2MLgIRKafl', youtubeUrl: 'https://youtube.com/playlist?list=PLwjK_iyK4LLBC_so3odA64E2MLgIRKafl&si=cTbrzA9TYRr3lRC-' },
  ],
  'mod-dld-2': [
    { id: 'dld2-sudhakar', lessonNumber: 1, title: 'DLD: Complete Course - Sudhakar Atchala', duration: 'Full Series', videoId: '', playlistId: 'PLXj4XH7LcRfBQXAd8FPZXmMzxZY-rViLP', youtubeUrl: 'https://youtube.com/playlist?list=PLXj4XH7LcRfBQXAd8FPZXmMzxZY-rViLP&si=tdTTFU6BtL4vIDad' },
    { id: 'dld2-neso', lessonNumber: 2, title: 'Digital Electronics - Neso Academy', duration: 'Full Series', videoId: '', playlistId: 'PLBlnK6fEyqRjMH3mWf6kwqiTbT798eAOm', youtubeUrl: 'https://youtube.com/playlist?list=PLBlnK6fEyqRjMH3mWf6kwqiTbT798eAOm&si=29-KAx_-9bePTkuA' },
  ],
  'mod-dld-3': [
    { id: 'dld3-sudhakar', lessonNumber: 1, title: 'DLD: Complete Course - Sudhakar Atchala', duration: 'Full Series', videoId: '', playlistId: 'PLXj4XH7LcRfBQXAd8FPZXmMzxZY-rViLP', youtubeUrl: 'https://youtube.com/playlist?list=PLXj4XH7LcRfBQXAd8FPZXmMzxZY-rViLP&si=tdTTFU6BtL4vIDad' },
    { id: 'dld3-neso', lessonNumber: 2, title: 'Digital Electronics - Neso Academy', duration: 'Full Series', videoId: '', playlistId: 'PLBlnK6fEyqRjMH3mWf6kwqiTbT798eAOm', youtubeUrl: 'https://youtube.com/playlist?list=PLBlnK6fEyqRjMH3mWf6kwqiTbT798eAOm&si=29-KAx_-9bePTkuA' },
  ],
  'mod-dld-4': [
    { id: 'dld4-sudhakar', lessonNumber: 1, title: 'DLD: Complete Course - Sudhakar Atchala', duration: 'Full Series', videoId: '', playlistId: 'PLXj4XH7LcRfBQXAd8FPZXmMzxZY-rViLP', youtubeUrl: 'https://youtube.com/playlist?list=PLXj4XH7LcRfBQXAd8FPZXmMzxZY-rViLP&si=tdTTFU6BtL4vIDad' },
    { id: 'dld4-neso', lessonNumber: 2, title: 'Digital Electronics - Neso Academy', duration: 'Full Series', videoId: '', playlistId: 'PLBlnK6fEyqRjMH3mWf6kwqiTbT798eAOm', youtubeUrl: 'https://youtube.com/playlist?list=PLBlnK6fEyqRjMH3mWf6kwqiTbT798eAOm&si=29-KAx_-9bePTkuA' },
  ],
  'mod-dld-5': [
    { id: 'dld5-sudhakar', lessonNumber: 1, title: 'DLD: Complete Course - Sudhakar Atchala', duration: 'Full Series', videoId: '', playlistId: 'PLXj4XH7LcRfBQXAd8FPZXmMzxZY-rViLP', youtubeUrl: 'https://youtube.com/playlist?list=PLXj4XH7LcRfBQXAd8FPZXmMzxZY-rViLP&si=tdTTFU6BtL4vIDad' },
    { id: 'dld5-neso', lessonNumber: 2, title: 'Digital Electronics - Neso Academy', duration: 'Full Series', videoId: '', playlistId: 'PLBlnK6fEyqRjMH3mWf6kwqiTbT798eAOm', youtubeUrl: 'https://youtube.com/playlist?list=PLBlnK6fEyqRjMH3mWf6kwqiTbT798eAOm&si=29-KAx_-9bePTkuA' },
  ],
};
