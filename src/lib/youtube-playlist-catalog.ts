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
    { id: 'm1-1', lessonNumber: 1, title: 'Introduction to Matrices, Hermitian & Skew-Hermitian Matrices', duration: '18:40', videoId: 'kYJzX4M-s6o', youtubeUrl: 'https://www.youtube.com/watch?v=kYJzX4M-s6o' },
    { id: 'm1-2', lessonNumber: 2, title: 'Row Echelon Form & Normal Form (Rank of Matrix)', duration: '24:15', videoId: 'G7j2P3l9M2w', youtubeUrl: 'https://www.youtube.com/watch?v=G7j2P3l9M2w' },
    { id: 'm1-3', lessonNumber: 3, title: 'Canonical Form & PAQ Reduction Method Step-by-Step', duration: '28:50', videoId: 'U9l1K5uQy8Y', youtubeUrl: 'https://www.youtube.com/watch?v=U9l1K5uQy8Y' },
    { id: 'm1-4', lessonNumber: 4, title: 'Consistency of Non-Homogeneous Linear Systems [AX = B]', duration: '22:10', videoId: '2-fN8r4sU-s', youtubeUrl: 'https://www.youtube.com/watch?v=2-fN8r4sU-s' },
    { id: 'm1-5', lessonNumber: 5, title: 'Homogeneous Linear Systems [AX = 0] & Trivial/Non-Trivial Solutions', duration: '19:35', videoId: '3-lQ4zWl4qQ', youtubeUrl: 'https://www.youtube.com/watch?v=3-lQ4zWl4qQ' },
    { id: 'm1-6', lessonNumber: 6, title: 'Gauss-Seidel & Jacobi Iteration Numerical Methods', duration: '31:20', videoId: 'wH2uY-n5_sQ', youtubeUrl: 'https://www.youtube.com/watch?v=wH2uY-n5_sQ' },
  ],

  'mod-m1-2': [
    { id: 'm2-1', lessonNumber: 1, title: 'Partial Differentiation Basics & First Order Derivatives', duration: '21:10', videoId: 'U9l1K5uQy8Y', youtubeUrl: 'https://www.youtube.com/watch?v=U9l1K5uQy8Y' },
    { id: 'm2-2', lessonNumber: 2, title: 'Higher Order Partial Derivatives & Symmetry Properties', duration: '19:45', videoId: '2-fN8r4sU-s', youtubeUrl: 'https://www.youtube.com/watch?v=2-fN8r4sU-s' },
    { id: 'm2-3', lessonNumber: 3, title: 'Composite Functions & Total Differential Chain Rule', duration: '25:30', videoId: '3-lQ4zWl4qQ', youtubeUrl: 'https://www.youtube.com/watch?v=3-lQ4zWl4qQ' },
    { id: 'm2-4', lessonNumber: 4, title: 'Jacobians of Two and Three Variables with Properties', duration: '33:15', videoId: 'G7j2P3l9M2w', youtubeUrl: 'https://www.youtube.com/watch?v=G7j2P3l9M2w' },
    { id: 'm2-5', lessonNumber: 5, title: 'Maxima and Minima of Functions of Two Variables', duration: '29:40', videoId: 'kYJzX4M-s6o', youtubeUrl: 'https://www.youtube.com/watch?v=kYJzX4M-s6o' },
    { id: 'm2-6', lessonNumber: 6, title: 'Lagrange’s Method of Undetermined Multipliers', duration: '36:00', videoId: 'wH2uY-n5_sQ', youtubeUrl: 'https://www.youtube.com/watch?v=wH2uY-n5_sQ' },
  ],

  'mod-m1-3': [
    { id: 'm3-1', lessonNumber: 1, title: 'Homogeneous Functions Definition & Degree Properties', duration: '15:20', videoId: '2-fN8r4sU-s', youtubeUrl: 'https://www.youtube.com/watch?v=2-fN8r4sU-s' },
    { id: 'm3-2', lessonNumber: 2, title: 'Euler’s Theorem Statement & Proof for Two Variables', duration: '22:45', videoId: '3-lQ4zWl4qQ', youtubeUrl: 'https://www.youtube.com/watch?v=3-lQ4zWl4qQ' },
    { id: 'm3-3', lessonNumber: 3, title: 'Euler’s Theorem for Composite Functions & Deductions', duration: '28:10', videoId: 'U9l1K5uQy8Y', youtubeUrl: 'https://www.youtube.com/watch?v=U9l1K5uQy8Y' },
    { id: 'm3-4', lessonNumber: 4, title: 'Second Order Euler’s Theorem Formula & Corollaries', duration: '31:15', videoId: 'G7j2P3l9M2w', youtubeUrl: 'https://www.youtube.com/watch?v=G7j2P3l9M2w' },
  ],

  'mod-m1-4': [
    { id: 'm4-1', lessonNumber: 1, title: 'Exact Differential Equations & Integrating Factors (Rules 1 to 4)', duration: '24:10', videoId: '3-lQ4zWl4qQ', youtubeUrl: 'https://www.youtube.com/watch?v=3-lQ4zWl4qQ' },
    { id: 'm4-2', lessonNumber: 2, title: 'Equations Reducible to Exact Form & Linear First Order ODEs', duration: '26:30', videoId: 'U9l1K5uQy8Y', youtubeUrl: 'https://www.youtube.com/watch?v=U9l1K5uQy8Y' },
    { id: 'm4-3', lessonNumber: 3, title: 'Higher Order Linear Differential Equations with Constant Coefficients', duration: '27:30', videoId: 'G7j2P3l9M2w', youtubeUrl: 'https://www.youtube.com/watch?v=G7j2P3l9M2w' },
    { id: 'm4-4', lessonNumber: 4, title: 'Particular Integral (PI) for Exponential, Sin, Cos & Polynomials', duration: '31:00', videoId: 'kYJzX4M-s6o', youtubeUrl: 'https://www.youtube.com/watch?v=kYJzX4M-s6o' },
    { id: 'm4-5', lessonNumber: 5, title: 'Method of Variation of Parameters for 2nd Order ODEs', duration: '35:40', videoId: 'wH2uY-n5_sQ', youtubeUrl: 'https://www.youtube.com/watch?v=wH2uY-n5_sQ' },
  ],

  'mod-m1-5': [
    { id: 'm5-1', lessonNumber: 1, title: 'Complex Numbers Algebra, Modulus & Amplitude Polar Forms', duration: '19:20', videoId: 'G7j2P3l9M2w', youtubeUrl: 'https://www.youtube.com/watch?v=G7j2P3l9M2w' },
    { id: 'm5-2', lessonNumber: 2, title: 'De Moivre’s Theorem Statement, Proof & Power Expansions', duration: '26:40', videoId: 'kYJzX4M-s6o', youtubeUrl: 'https://www.youtube.com/watch?v=kYJzX4M-s6o' },
    { id: 'm5-3', lessonNumber: 3, title: 'Roots of Complex Numbers & Polynomial Solutions', duration: '28:15', videoId: '2-fN8r4sU-s', youtubeUrl: 'https://www.youtube.com/watch?v=2-fN8r4sU-s' },
    { id: 'm5-4', lessonNumber: 4, title: 'Circular and Hyperbolic Functions Interrelation & Identities', duration: '23:50', videoId: '3-lQ4zWl4qQ', youtubeUrl: 'https://www.youtube.com/watch?v=3-lQ4zWl4qQ' },
    { id: 'm5-5', lessonNumber: 5, title: 'Logarithm of Complex Number: General & Principal Values', duration: '32:10', videoId: 'U9l1K5uQy8Y', youtubeUrl: 'https://www.youtube.com/watch?v=U9l1K5uQy8Y' },
  ],

  // =========================================================================
  // SEMESTER 1: ENGINEERING PHYSICS (316U06C102)
  // =========================================================================
  'mod-phy-1': [
    { id: 'phy1-1', lessonNumber: 1, title: 'Thin Film Interference (Parallel & Wedge-Shaped Films)', duration: '35:10', videoId: 'gT8wNlV_V_E', youtubeUrl: 'https://www.youtube.com/watch?v=gT8wNlV_V_E' },
    { id: 'phy1-2', lessonNumber: 2, title: 'Newton’s Rings Experiment & Wavelength Derivations', duration: '29:40', videoId: '0k52fM43d7s', youtubeUrl: 'https://www.youtube.com/watch?v=0k52fM43d7s' },
    { id: 'phy1-3', lessonNumber: 3, title: 'Fraunhofer Diffraction at Single Slit & Double Slit', duration: '32:15', videoId: 'yW6S4WzW62Y', youtubeUrl: 'https://www.youtube.com/watch?v=yW6S4WzW62Y' },
  ],

  'mod-phy-2': [
    { id: 'phy2-1', lessonNumber: 1, title: 'Laser Principles, Spontaneous & Stimulated Emission', duration: '28:10', videoId: '0k52fM43d7s', youtubeUrl: 'https://www.youtube.com/watch?v=0k52fM43d7s' },
    { id: 'phy2-2', lessonNumber: 2, title: 'Nd:YAG Laser & He-Ne Laser Construction & Working', duration: '31:40', videoId: 'yW6S4WzW62Y', youtubeUrl: 'https://www.youtube.com/watch?v=yW6S4WzW62Y' },
    { id: 'phy2-3', lessonNumber: 3, title: 'Numerical Aperture (NA) Derivation & Acceptance Angle', duration: '29:15', videoId: '8S_6h04n1fM', youtubeUrl: 'https://www.youtube.com/watch?v=8S_6h04n1fM' },
  ],

  'mod-phy-3': [
    { id: 'phy3-1', lessonNumber: 1, title: 'De-Broglie Hypothesis & Matter Wave Characteristics', duration: '26:40', videoId: 'yW6S4WzW62Y', youtubeUrl: 'https://www.youtube.com/watch?v=yW6S4WzW62Y' },
    { id: 'phy3-2', lessonNumber: 2, title: 'Time-Independent Schrödinger Wave Equation Derivation', duration: '35:20', videoId: '8S_6h04n1fM', youtubeUrl: 'https://www.youtube.com/watch?v=8S_6h04n1fM' },
  ],

  'mod-phy-4': [
    { id: 'phy4-1', lessonNumber: 1, title: 'Intrinsic and Extrinsic Semiconductors & Fermi Level', duration: '31:10', videoId: '8S_6h04n1fM', youtubeUrl: 'https://www.youtube.com/watch?v=8S_6h04n1fM' },
    { id: 'phy4-2', lessonNumber: 2, title: 'Maxwell’s Equations in Differential and Integral Forms', duration: '38:00', videoId: 'gT8wNlV_V_E', youtubeUrl: 'https://www.youtube.com/watch?v=gT8wNlV_V_E' },
  ],

  // =========================================================================
  // SEMESTER 1: ENGINEERING CHEMISTRY (316U06C103)
  // =========================================================================
  'mod-ch-1': [
    { id: 'ch1-1', lessonNumber: 1, title: 'Types of Hardness & EDTA Titration Method Principle', duration: '28:15', videoId: 'de9vwMGgTvg', youtubeUrl: 'https://www.youtube.com/watch?v=de9vwMGgTvg' },
    { id: 'ch1-2', lessonNumber: 2, title: 'Zeolite & Ion-Exchange Industrial Water Softening Processes', duration: '24:30', videoId: '9_H8XWz9J_g', youtubeUrl: 'https://www.youtube.com/watch?v=9_H8XWz9J_g' },
    { id: 'ch1-3', lessonNumber: 3, title: 'Reverse Osmosis (RO) & Desalination Technologies', duration: '20:30', videoId: '7O2sH_P5U48', youtubeUrl: 'https://www.youtube.com/watch?v=7O2sH_P5U48' },
  ],

  'mod-ch-2': [
    { id: 'ch2-1', lessonNumber: 1, title: 'Twelve Principles of Green Chemistry with Industrial Examples', duration: '35:20', videoId: '9_H8XWz9J_g', youtubeUrl: 'https://www.youtube.com/watch?v=9_H8XWz9J_g' },
    { id: 'ch2-2', lessonNumber: 2, title: 'Atom Economy & Environmental E-Factor Calculations', duration: '27:15', videoId: '7O2sH_P5U48', youtubeUrl: 'https://www.youtube.com/watch?v=7O2sH_P5U48' },
  ],

  'mod-ch-3': [
    { id: 'ch3-1', lessonNumber: 1, title: 'Gibbs Phase Rule Equation Statement & Definitions (P, C, F)', duration: '26:30', videoId: '7O2sH_P5U48', youtubeUrl: 'https://www.youtube.com/watch?v=7O2sH_P5U48' },
    { id: 'ch3-2', lessonNumber: 2, title: 'Two-Component Lead-Silver (Pb-Ag) Eutectic System', duration: '31:20', videoId: 'H74S9zRk-8M', youtubeUrl: 'https://www.youtube.com/watch?v=H74S9zRk-8M' },
  ],

  'mod-ch-4': [
    { id: 'ch4-1', lessonNumber: 1, title: 'Mechanism of Dry and Wet (Electrochemical) Corrosion', duration: '30:10', videoId: 'H74S9zRk-8M', youtubeUrl: 'https://www.youtube.com/watch?v=H74S9zRk-8M' },
    { id: 'ch4-2', lessonNumber: 2, title: 'Lithium-Ion Battery Working, Reactions & Supercapacitors', duration: '33:00', videoId: 'de9vwMGgTvg', youtubeUrl: 'https://www.youtube.com/watch?v=de9vwMGgTvg' },
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
