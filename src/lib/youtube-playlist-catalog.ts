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
    { id: 'm1-1', lessonNumber: 1, title: 'Introduction to Matrices, Hermitian & Skew-Hermitian Matrices', duration: '18:40', videoId: 'kYB8IZa55bM' },
    { id: 'm1-2', lessonNumber: 2, title: 'Row Echelon Form & Normal Form (Rank of Matrix)', duration: '24:15', videoId: 'kYB8IZa55bM' },
    { id: 'm1-3', lessonNumber: 3, title: 'Canonical Form & PAQ Reduction Method Step-by-Step', duration: '28:50', videoId: 'kYB8IZa55bM' },
    { id: 'm1-4', lessonNumber: 4, title: 'Consistency of Non-Homogeneous Linear Systems [AX = B]', duration: '22:10', videoId: 'kYB8IZa55bM' },
    { id: 'm1-5', lessonNumber: 5, title: 'Homogeneous Linear Systems [AX = 0] & Trivial/Non-Trivial Solutions', duration: '19:35', videoId: 'kYB8IZa55bM' },
    { id: 'm1-6', lessonNumber: 6, title: 'Gauss-Seidel & Jacobi Iteration Numerical Methods', duration: '31:20', videoId: 'kYB8IZa55bM' },
    { id: 'm1-7', lessonNumber: 7, title: 'Solved University Exam PYQs on Rank & Linear Systems', duration: '35:00', videoId: 'kYB8IZa55bM' },
  ],

  'mod-m1-2': [
    { id: 'm2-1', lessonNumber: 1, title: 'Partial Differentiation Basics & First Order Derivatives', duration: '21:10', videoId: 'F01VpGZtVbY' },
    { id: 'm2-2', lessonNumber: 2, title: 'Higher Order Partial Derivatives & Symmetry Properties', duration: '19:45', videoId: 'F01VpGZtVbY' },
    { id: 'm2-3', lessonNumber: 3, title: 'Composite Functions & Total Differential Chain Rule', duration: '25:30', videoId: 'F01VpGZtVbY' },
    { id: 'm2-4', lessonNumber: 4, title: 'Jacobians of Two and Three Variables with Properties', duration: '33:15', videoId: 'F01VpGZtVbY' },
    { id: 'm2-5', lessonNumber: 5, title: 'Maxima and Minima of Functions of Two Variables', duration: '29:40', videoId: 'F01VpGZtVbY' },
    { id: 'm2-6', lessonNumber: 6, title: 'Lagrange’s Method of Undetermined Multipliers', duration: '36:00', videoId: 'F01VpGZtVbY' },
  ],

  'mod-m1-3': [
    { id: 'm3-1', lessonNumber: 1, title: 'Homogeneous Functions Definition & Degree Properties', duration: '15:20', videoId: 'E6x7WJ8m5l0' },
    { id: 'm3-2', lessonNumber: 2, title: 'Euler’s Theorem Statement & Proof for Two Variables', duration: '22:45', videoId: 'E6x7WJ8m5l0' },
    { id: 'm3-3', lessonNumber: 3, title: 'Euler’s Theorem for Composite Functions & Deductions', duration: '28:10', videoId: 'E6x7WJ8m5l0' },
    { id: 'm3-4', lessonNumber: 4, title: 'Second Order Euler’s Theorem Formula & Corollaries', duration: '31:15', videoId: 'E6x7WJ8m5l0' },
    { id: 'm3-5', lessonNumber: 5, title: 'Solved University Exam Numericals on Euler’s Theorem', duration: '34:20', videoId: 'E6x7WJ8m5l0' },
  ],

  'mod-m1-4': [
    { id: 'm4-1', lessonNumber: 1, title: 'Exact Differential Equations & Integrating Factors (Rules 1 to 4)', duration: '24:10', videoId: '34dOqQ9kF10' },
    { id: 'm4-2', lessonNumber: 2, title: 'Equations Reducible to Exact Form & Linear First Order ODEs', duration: '26:30', videoId: '34dOqQ9kF10' },
    { id: 'm4-3', lessonNumber: 3, title: 'Higher Order Linear Differential Equations with Constant Coefficients', duration: '27:30', videoId: '34dOqQ9kF10' },
    { id: 'm4-4', lessonNumber: 4, title: 'Complementary Function (CF) - Real, Repeated & Complex Roots', duration: '22:15', videoId: '34dOqQ9kF10' },
    { id: 'm4-5', lessonNumber: 5, title: 'Particular Integral (PI) for Exponential, Sin, Cos & Polynomials', duration: '31:00', videoId: '34dOqQ9kF10' },
    { id: 'm4-6', lessonNumber: 6, title: 'Method of Variation of Parameters for 2nd Order ODEs', duration: '35:40', videoId: '34dOqQ9kF10' },
    { id: 'm4-7', lessonNumber: 7, title: 'Cauchy-Euler Homogeneous Differential Equations', duration: '29:50', videoId: '34dOqQ9kF10' },
  ],

  'mod-m1-5': [
    { id: 'm5-1', lessonNumber: 1, title: 'Complex Numbers Algebra, Modulus & Amplitude Polar Forms', duration: '19:20', videoId: 'kYB8IZa55bM' },
    { id: 'm5-2', lessonNumber: 2, title: 'De Moivre’s Theorem Statement, Proof & Power Expansions', duration: '26:40', videoId: 'kYB8IZa55bM' },
    { id: 'm5-3', lessonNumber: 3, title: 'Roots of Complex Numbers & Polynomial Solutions', duration: '28:15', videoId: 'kYB8IZa55bM' },
    { id: 'm5-4', lessonNumber: 4, title: 'Circular and Hyperbolic Functions Interrelation & Identities', duration: '23:50', videoId: 'kYB8IZa55bM' },
    { id: 'm5-5', lessonNumber: 5, title: 'Separation of Real & Imaginary Parts in Complex Expressions', duration: '30:10', videoId: 'kYB8IZa55bM' },
    { id: 'm5-6', lessonNumber: 6, title: 'Logarithm of Complex Number: General & Principal Values', duration: '32:10', videoId: 'kYB8IZa55bM' },
    { id: 'm5-7', lessonNumber: 7, title: 'Inverse Circular & Hyperbolic Functions Solved Problems', duration: '27:45', videoId: 'kYB8IZa55bM' },
  ],

  // =========================================================================
  // SEMESTER 1: ENGINEERING PHYSICS (316U06C102)
  // =========================================================================
  'mod-phy-1': [
    { id: 'phy1-1', lessonNumber: 1, title: 'Thin Film Interference (Parallel & Wedge-Shaped Films)', duration: '35:10', videoId: '9_j3i0c7P-s' },
    { id: 'phy1-2', lessonNumber: 2, title: 'Newton’s Rings Experiment & Wavelength Derivations', duration: '29:40', videoId: '9_j3i0c7P-s' },
    { id: 'phy1-3', lessonNumber: 3, title: 'Anti-Reflection Coatings & Determination of Refractive Index', duration: '24:30', videoId: '9_j3i0c7P-s' },
    { id: 'phy1-4', lessonNumber: 4, title: 'Fraunhofer Diffraction at Single Slit & Double Slit', duration: '32:15', videoId: '9_j3i0c7P-s' },
    { id: 'phy1-5', lessonNumber: 5, title: 'Plane Diffraction Grating & Resolving Power of Grating', duration: '28:50', videoId: '9_j3i0c7P-s' },
  ],

  'mod-phy-2': [
    { id: 'phy2-1', lessonNumber: 1, title: 'Laser Principles, Spontaneous & Stimulated Emission', duration: '28:10', videoId: '9_j3i0c7P-s' },
    { id: 'phy2-2', lessonNumber: 2, title: 'Population Inversion, Metastable States & Einstein Coefficients', duration: '34:00', videoId: '9_j3i0c7P-s' },
    { id: 'phy2-3', lessonNumber: 3, title: 'Nd:YAG Laser & He-Ne Laser Construction & Working', duration: '31:40', videoId: '9_j3i0c7P-s' },
    { id: 'phy2-4', lessonNumber: 4, title: 'Optical Fiber Total Internal Reflection & Acceptance Angle', duration: '26:50', videoId: '9_j3i0c7P-s' },
    { id: 'phy2-5', lessonNumber: 5, title: 'Numerical Aperture (NA) Derivation & Normalized Frequency V-Number', duration: '29:15', videoId: '9_j3i0c7P-s' },
    { id: 'phy2-6', lessonNumber: 6, title: 'Step Index vs. Graded Index Fibers & Attenuation Mechanisms', duration: '25:30', videoId: '9_j3i0c7P-s' },
  ],

  'mod-phy-3': [
    { id: 'phy3-1', lessonNumber: 1, title: 'De-Broglie Hypothesis & Matter Wave Characteristics', duration: '26:40', videoId: '9_j3i0c7P-s' },
    { id: 'phy3-2', lessonNumber: 2, title: 'Heisenberg Uncertainty Principle & Physical Significance', duration: '28:15', videoId: '9_j3i0c7P-s' },
    { id: 'phy3-3', lessonNumber: 3, title: 'Time-Independent Schrödinger Wave Equation Derivation', duration: '35:20', videoId: '9_j3i0c7P-s' },
    { id: 'phy3-4', lessonNumber: 4, title: 'Particle in a 1D Infinite Potential Well (Energy Quantization)', duration: '32:00', videoId: '9_j3i0c7P-s' },
  ],

  'mod-phy-4': [
    { id: 'phy4-1', lessonNumber: 1, title: 'Intrinsic and Extrinsic Semiconductors & Fermi Energy Level', duration: '31:10', videoId: '9_j3i0c7P-s' },
    { id: 'phy4-2', lessonNumber: 2, title: 'Hall Effect Derivation, Hall Coefficient & Applications', duration: '29:30', videoId: '9_j3i0c7P-s' },
    { id: 'phy4-3', lessonNumber: 3, title: 'Vector Calculus: Del, Gradient, Divergence, and Curl', duration: '33:45', videoId: '9_j3i0c7P-s' },
    { id: 'phy4-4', lessonNumber: 4, title: 'Maxwell’s Equations in Differential and Integral Forms', duration: '38:00', videoId: '9_j3i0c7P-s' },
  ],

  // =========================================================================
  // SEMESTER 1: ENGINEERING CHEMISTRY (316U06C103)
  // =========================================================================
  'mod-ch-1': [
    { id: 'ch1-1', lessonNumber: 1, title: 'Types of Hardness (Temporary vs Permanent) & Units of Hardness', duration: '28:15', videoId: '9_j3i0c7P-s' },
    { id: 'ch1-2', lessonNumber: 2, title: 'EDTA Titration Method: Principle, Reactions & Solved Numericals', duration: '32:40', videoId: '9_j3i0c7P-s' },
    { id: 'ch1-3', lessonNumber: 3, title: 'Zeolite & Ion-Exchange Industrial Water Softening Processes', duration: '24:30', videoId: '9_j3i0c7P-s' },
    { id: 'ch1-4', lessonNumber: 4, title: 'Boiler Troubles: Scale & Sludge, Priming & Foaming, Caustic Embrittlement', duration: '26:00', videoId: '9_j3i0c7P-s' },
    { id: 'ch1-5', lessonNumber: 5, title: 'BOD & COD Parameters in Industrial Effluent Treatment', duration: '22:45', videoId: '9_j3i0c7P-s' },
    { id: 'ch1-6', lessonNumber: 6, title: 'Reverse Osmosis (RO) & Electrodialysis Desalination', duration: '20:30', videoId: '9_j3i0c7P-s' },
  ],

  'mod-ch-2': [
    { id: 'ch2-1', lessonNumber: 1, title: 'Twelve Principles of Green Chemistry with Industrial Examples', duration: '35:20', videoId: '9_j3i0c7P-s' },
    { id: 'ch2-2', lessonNumber: 2, title: 'Atom Economy & Environmental E-Factor Calculations', duration: '27:15', videoId: '9_j3i0c7P-s' },
    { id: 'ch2-3', lessonNumber: 3, title: 'Supercritical CO2 & Ionic Liquids as Green Solvents', duration: '23:40', videoId: '9_j3i0c7P-s' },
    { id: 'ch2-4', lessonNumber: 4, title: 'Synthetic Polymers: Addition vs Condensation Polymerization', duration: '29:50', videoId: '9_j3i0c7P-s' },
    { id: 'ch2-5', lessonNumber: 5, title: 'Biodegradable Polymers: PLA and PHBV Synthesis & Applications', duration: '25:10', videoId: '9_j3i0c7P-s' },
  ],

  'mod-ch-3': [
    { id: 'ch3-1', lessonNumber: 1, title: 'Gibbs Phase Rule Equation Statement & Definitions (P, C, F)', duration: '26:30', videoId: '9_j3i0c7P-s' },
    { id: 'ch3-2', lessonNumber: 2, title: 'One-Component Water System Phase Diagram', duration: '28:00', videoId: '9_j3i0c7P-s' },
    { id: 'ch3-3', lessonNumber: 3, title: 'Two-Component Lead-Silver (Pb-Ag) Eutectic System', duration: '31:20', videoId: '9_j3i0c7P-s' },
    { id: 'ch3-4', lessonNumber: 4, title: 'Pattinson’s Process for Desilverization of Argentiferous Lead', duration: '22:15', videoId: '9_j3i0c7P-s' },
  ],

  'mod-ch-4': [
    { id: 'ch4-1', lessonNumber: 1, title: 'Mechanism of Dry and Wet (Electrochemical) Corrosion', duration: '30:10', videoId: '9_j3i0c7P-s' },
    { id: 'ch4-2', lessonNumber: 2, title: 'Galvanic and Differential Aeration Corrosion', duration: '27:40', videoId: '9_j3i0c7P-s' },
    { id: 'ch4-3', lessonNumber: 3, title: 'Corrosion Control: Sacrificial Anode & Impressed Current Cathodic', duration: '25:30', videoId: '9_j3i0c7P-s' },
    { id: 'ch4-4', lessonNumber: 4, title: 'Lithium-Ion Battery Working, Reactions & Supercapacitors', duration: '33:00', videoId: '9_j3i0c7P-s' },
  ],

  // =========================================================================
  // SEMESTER 1: BASIC ELECTRICAL ENGINEERING (316U06C104)
  // =========================================================================
  'mod-bee-1': [
    { id: 'bee1-1', lessonNumber: 1, title: 'DC Circuits Basics, Ohm’s Law & Kirchhoff’s Laws (KVL/KCL)', duration: '22:10', videoId: '34dOqQ9kF10' },
    { id: 'bee1-2', lessonNumber: 2, title: 'Mesh Analysis and Nodal Analysis with Independent/Dependent Sources', duration: '28:45', videoId: '34dOqQ9kF10' },
    { id: 'bee1-3', lessonNumber: 3, title: 'Source Transformation & Star-Delta Conversion Solved Numericals', duration: '25:15', videoId: '34dOqQ9kF10' },
    { id: 'bee1-4', lessonNumber: 4, title: 'Thevenin’s Theorem Step-by-Step Circuit Reduction', duration: '35:10', videoId: '34dOqQ9kF10' },
    { id: 'bee1-5', lessonNumber: 5, title: 'Norton’s Theorem Equivalent Current Source Method', duration: '29:30', videoId: '34dOqQ9kF10' },
    { id: 'bee1-6', lessonNumber: 6, title: 'Maximum Power Transfer Theorem for Resistive Networks', duration: '31:20', videoId: '34dOqQ9kF10' },
    { id: 'bee1-7', lessonNumber: 7, title: 'Superposition Theorem with Multiple Power Sources', duration: '33:40', videoId: '34dOqQ9kF10' },
  ],

  'mod-bee-2': [
    { id: 'bee2-1', lessonNumber: 1, title: 'AC Fundamentals: Generation of Sinusoidal AC, Frequency & Phase', duration: '24:00', videoId: '34dOqQ9kF10' },
    { id: 'bee2-2', lessonNumber: 2, title: 'RMS Value, Average Value, Form Factor & Peak Factor Derivations', duration: '26:30', videoId: '34dOqQ9kF10' },
    { id: 'bee2-3', lessonNumber: 3, title: 'Phasor Representation of AC Quantities', duration: '21:15', videoId: '34dOqQ9kF10' },
    { id: 'bee2-4', lessonNumber: 4, title: 'Series R-L, R-C, and R-L-C Circuit Impedance & Power Triangle', duration: '36:00', videoId: '34dOqQ9kF10' },
    { id: 'bee2-5', lessonNumber: 5, title: 'Series and Parallel Resonance Conditions, Q-Factor & Bandwidth', duration: '34:00', videoId: '34dOqQ9kF10' },
  ],

  'mod-bee-3': [
    { id: 'bee3-1', lessonNumber: 1, title: 'Advantages of 3-Phase Systems & Phase Sequence', duration: '23:40', videoId: '34dOqQ9kF10' },
    { id: 'bee3-2', lessonNumber: 2, title: 'Balanced Star (Y) Connected System: Line vs Phase Relations', duration: '29:10', videoId: '34dOqQ9kF10' },
    { id: 'bee3-3', lessonNumber: 3, title: 'Balanced Delta (Δ) Connected System: Line vs Phase Relations', duration: '27:30', videoId: '34dOqQ9kF10' },
    { id: 'bee3-4', lessonNumber: 4, title: 'Power Measurement in 3-Phase Circuits using Two-Wattmeter Method', duration: '38:15', videoId: '34dOqQ9kF10' },
  ],

  'mod-bee-4': [
    { id: 'bee4-1', lessonNumber: 1, title: 'Single Phase Transformer Principle, Construction & Types', duration: '30:20', videoId: '34dOqQ9kF10' },
    { id: 'bee4-2', lessonNumber: 2, title: 'EMF Equation of Transformer & Transformation Ratio', duration: '28:00', videoId: '34dOqQ9kF10' },
    { id: 'bee4-3', lessonNumber: 3, title: 'Transformer on No-Load and On-Load Phasor Diagrams', duration: '34:10', videoId: '34dOqQ9kF10' },
    { id: 'bee4-4', lessonNumber: 4, title: 'Core Losses, Copper Losses & Efficiency Calculation', duration: '40:20', videoId: '34dOqQ9kF10' },
    { id: 'bee4-5', lessonNumber: 5, title: 'Three Phase Induction Motor Working Principle & Rotating Magnetic Field', duration: '36:45', videoId: '34dOqQ9kF10' },
  ],

  // =========================================================================
  // SEMESTER 1: ENGINEERING DRAWING (316U06C105)
  // =========================================================================
  'mod-ed-1': [
    { id: 'ed1-1', lessonNumber: 1, title: 'Principles of Engineering Drawing, Bureau of Indian Standards (BIS)', duration: '24:10', videoId: 'E6x7WJ8m5l0' },
    { id: 'ed1-2', lessonNumber: 2, title: 'First Angle vs Third Angle Projection Methods', duration: '28:00', videoId: 'E6x7WJ8m5l0' },
    { id: 'ed1-3', lessonNumber: 3, title: 'Orthographic Projections: Front View, Top View & Side View', duration: '38:45', videoId: 'E6x7WJ8m5l0' },
    { id: 'ed1-4', lessonNumber: 4, title: 'Full Sectional and Half Sectional Orthographic Views', duration: '32:20', videoId: 'E6x7WJ8m5l0' },
  ],

  'mod-ed-2': [
    { id: 'ed2-1', lessonNumber: 1, title: 'Projections of Points in Four Quadrants', duration: '22:30', videoId: 'E6x7WJ8m5l0' },
    { id: 'ed2-2', lessonNumber: 2, title: 'Projection of Straight Lines Inclined to HP and VP (True Length & Angles)', duration: '36:10', videoId: 'E6x7WJ8m5l0' },
    { id: 'ed2-3', lessonNumber: 3, title: 'Traces of a Straight Line (HT and VT)', duration: '27:40', videoId: 'E6x7WJ8m5l0' },
    { id: 'ed2-4', lessonNumber: 4, title: 'Projections of Regular Geometric Planes (Triangle, Square, Pentagon, Circle)', duration: '29:40', videoId: 'E6x7WJ8m5l0' },
  ],

  'mod-ed-3': [
    { id: 'ed3-1', lessonNumber: 1, title: 'Projections of Prisms and Pyramids with Axis Inclined', duration: '35:00', videoId: 'E6x7WJ8m5l0' },
    { id: 'ed3-2', lessonNumber: 2, title: 'Projections of Cylinders and Cones', duration: '30:20', videoId: 'E6x7WJ8m5l0' },
    { id: 'ed3-3', lessonNumber: 3, title: 'Lateral Surface Development of Prisms, Cylinders & Cones', duration: '31:15', videoId: 'E6x7WJ8m5l0' },
    { id: 'ed3-4', lessonNumber: 4, title: 'Development of Truncated Solids & Transition Pieces', duration: '28:50', videoId: 'E6x7WJ8m5l0' },
  ],

  'mod-ed-4': [
    { id: 'ed4-1', lessonNumber: 1, title: 'Isometric Scale Construction & Isometric View vs Projection', duration: '25:30', videoId: 'E6x7WJ8m5l0' },
    { id: 'ed4-2', lessonNumber: 2, title: 'Isometric Projections of Simple Machine Blocks', duration: '34:50', videoId: 'E6x7WJ8m5l0' },
    { id: 'ed4-3', lessonNumber: 3, title: 'Four-Center Method for Isometric Circles and Cylinders', duration: '31:00', videoId: 'E6x7WJ8m5l0' },
  ],

  // =========================================================================
  // SEMESTER 1: STRUCTURED PROGRAMMING METHODOLOGY (C) (316U06C107)
  // =========================================================================
  'mod-spm-1': [
    { id: 'spm1-1', lessonNumber: 1, title: 'Problem Solving Concepts: Algorithms, Flowcharts & Pseudo-code', duration: '24:10', videoId: 'kYB8IZa55bM' },
    { id: 'spm1-2', lessonNumber: 2, title: 'Basic C Program Structure, Data Types, Variables & Constants', duration: '26:30', videoId: 'kYB8IZa55bM' },
    { id: 'spm1-3', lessonNumber: 3, title: 'Formatted I/O Functions (printf, scanf, getchar, putchar)', duration: '22:00', videoId: 'kYB8IZa55bM' },
    { id: 'spm1-4', lessonNumber: 4, title: 'Operators in C: Arithmetic, Relational, Logical, Bitwise & Precedence', duration: '29:15', videoId: 'kYB8IZa55bM' },
  ],

  'mod-spm-2': [
    { id: 'spm2-1', lessonNumber: 1, title: 'Conditional Branching: if, if-else, nested if & switch-case', duration: '28:30', videoId: 'kYB8IZa55bM' },
    { id: 'spm2-2', lessonNumber: 2, title: 'Iteration: while, do-while, and for loop control statements', duration: '31:15', videoId: 'kYB8IZa55bM' },
    { id: 'spm2-3', lessonNumber: 3, title: 'Jump Statements: break, continue, and goto', duration: '18:45', videoId: 'kYB8IZa55bM' },
    { id: 'spm2-4', lessonNumber: 4, title: 'Pattern Printing Programs & Number Theory Questions in C', duration: '34:00', videoId: 'kYB8IZa55bM' },
  ],

  'mod-spm-3': [
    { id: 'spm3-1', lessonNumber: 1, title: '1D Array Declaration, Initialization, Traversal & Search Algorithms', duration: '29:30', videoId: 'kYB8IZa55bM' },
    { id: 'spm3-2', lessonNumber: 2, title: '2D Array Matrix Operations (Addition, Multiplication, Transpose)', duration: '35:40', videoId: 'kYB8IZa55bM' },
    { id: 'spm3-3', lessonNumber: 3, title: 'String Handling: Character Arrays, null character \'\\0\' & gets/puts', duration: '24:00', videoId: 'kYB8IZa55bM' },
    { id: 'spm3-4', lessonNumber: 4, title: 'Standard String Functions (strlen, strcpy, strcat, strcmp, strrev)', duration: '27:50', videoId: 'kYB8IZa55bM' },
  ],

  'mod-spm-4': [
    { id: 'spm4-1', lessonNumber: 1, title: 'User Defined Functions: Function Prototype, Definition & Return', duration: '25:20', videoId: 'kYB8IZa55bM' },
    { id: 'spm4-2', lessonNumber: 2, title: 'Parameter Passing: Call by Value vs Call by Reference', duration: '28:10', videoId: 'kYB8IZa55bM' },
    { id: 'spm4-3', lessonNumber: 3, title: 'Recursion in C: Factorial, Fibonacci & Tower of Hanoi', duration: '33:20', videoId: 'kYB8IZa55bM' },
    { id: 'spm4-4', lessonNumber: 4, title: 'Pointers Basics: Address-of Operator (&), Dereference (*), Pointer Types', duration: '38:00', videoId: 'kYB8IZa55bM' },
    { id: 'spm4-5', lessonNumber: 5, title: 'Pointer Arithmetic & Array-Pointer Equivalence', duration: '32:45', videoId: 'kYB8IZa55bM' },
    { id: 'spm4-6', lessonNumber: 6, title: 'Dynamic Memory Allocation: malloc(), calloc(), realloc(), and free()', duration: '56:20', videoId: 'kYB8IZa55bM' },
  ],

  // =========================================================================
  // SEMESTER 2: APPLIED MATHEMATICS – II (316U06C201)
  // =========================================================================
  'mod-m2-1': [
    { id: 'm2sub1-1', lessonNumber: 1, title: 'Exact First Order ODEs, Integrating Factors & Orthogonal Trajectories', duration: '29:10', videoId: '34dOqQ9kF10' },
    { id: 'm2sub1-2', lessonNumber: 2, title: 'Linear First Order ODEs & Bernoulli’s Equations', duration: '26:40', videoId: '34dOqQ9kF10' },
  ],
  'mod-m2-2': [
    { id: 'm2sub2-1', lessonNumber: 1, title: 'Higher Order Linear ODEs, Cauchy-Euler & Variation of Parameters', duration: '34:20', videoId: '34dOqQ9kF10' },
    { id: 'm2sub2-2', lessonNumber: 2, title: 'Legendre’s Linear Equations & Simultaneous Differential Equations', duration: '31:15', videoId: '34dOqQ9kF10' },
  ],
  'mod-m2-3': [
    { id: 'm2sub3-1', lessonNumber: 1, title: 'Beta & Gamma Functions Standard Properties & Transformations', duration: '28:40', videoId: '34dOqQ9kF10' },
    { id: 'm2sub3-2', lessonNumber: 2, title: 'Duplication Formula & Error Function (erf)', duration: '25:30', videoId: '34dOqQ9kF10' },
  ],
  'mod-m2-4': [
    { id: 'm2sub4-1', lessonNumber: 1, title: 'Differentiation Under Integral Sign (DUIS) One & Two Parameters', duration: '32:15', videoId: '34dOqQ9kF10' },
  ],
  'mod-m2-5': [
    { id: 'm2sub5-1', lessonNumber: 1, title: 'Double Integrals in Cartesian and Polar Coordinates', duration: '36:00', videoId: '34dOqQ9kF10' },
    { id: 'm2sub5-2', lessonNumber: 2, title: 'Change of Order of Integration & Area Calculations', duration: '38:30', videoId: '34dOqQ9kF10' },
  ],
  'mod-m2-6': [
    { id: 'm2sub6-1', lessonNumber: 1, title: 'Triple Integrals, Volume & Vector Calculus Flux Theorems', duration: '41:10', videoId: '34dOqQ9kF10' },
  ],

  // =========================================================================
  // SEMESTER 2: OBJECT-ORIENTED PROGRAMMING (C++) (316U06C205)
  // =========================================================================
  'mod-oop-1': [
    { id: 'oop1-1', lessonNumber: 1, title: 'Classes, Objects & Data Encapsulation Principles in C++', duration: '31:20', videoId: 'kYB8IZa55bM' },
    { id: 'oop1-2', lessonNumber: 2, title: 'Access Specifiers (public, private, protected) & Member Functions', duration: '25:40', videoId: 'kYB8IZa55bM' },
  ],
  'mod-oop-2': [
    { id: 'oop2-1', lessonNumber: 1, title: 'Constructors, Parameterized & Copy Constructors', duration: '27:45', videoId: 'kYB8IZa55bM' },
    { id: 'oop2-2', lessonNumber: 2, title: 'Destructors, Dynamic Initialization & this Pointer', duration: '24:10', videoId: 'kYB8IZa55bM' },
  ],
  'mod-oop-3': [
    { id: 'oop3-1', lessonNumber: 1, title: 'Unary and Binary Operator Overloading Step-by-Step', duration: '33:10', videoId: 'kYB8IZa55bM' },
    { id: 'oop3-2', lessonNumber: 2, title: 'Overloading Stream Operators (<< and >>) using Friend Functions', duration: '29:00', videoId: 'kYB8IZa55bM' },
  ],
  'mod-oop-4': [
    { id: 'oop4-1', lessonNumber: 1, title: 'Single, Multilevel & Multiple Inheritance Hierarchies', duration: '36:00', videoId: 'kYB8IZa55bM' },
    { id: 'oop4-2', lessonNumber: 2, title: 'Hierarchical, Hybrid Inheritance & Virtual Base Classes', duration: '32:30', videoId: 'kYB8IZa55bM' },
  ],
  'mod-oop-5': [
    { id: 'oop5-1', lessonNumber: 1, title: 'Virtual Functions, Pure Virtual & Runtime Polymorphism', duration: '29:50', videoId: 'kYB8IZa55bM' },
    { id: 'oop5-2', lessonNumber: 2, title: 'Abstract Classes & Virtual Destructors', duration: '23:15', videoId: 'kYB8IZa55bM' },
  ],
  'mod-oop-6': [
    { id: 'oop6-1', lessonNumber: 1, title: 'Function/Class Templates, Exception Handling & STL Containers', duration: '42:15', videoId: 'kYB8IZa55bM' },
  ],

  // =========================================================================
  // SEMESTER 2: ENVIRONMENTAL SCIENCE (316U06C204)
  // =========================================================================
  'mod-evs-1': [
    { id: 'evs1-1', lessonNumber: 1, title: 'Ecosystem Dynamics, Food Chains, Food Webs & Ecological Pyramids', duration: '26:10', videoId: 'E6x7WJ8m5l0' },
    { id: 'evs1-2', lessonNumber: 2, title: 'Biodiversity Hotspots, Values & In-situ/Ex-situ Conservation', duration: '28:40', videoId: 'E6x7WJ8m5l0' },
  ],
  'mod-evs-2': [
    { id: 'evs2-1', lessonNumber: 1, title: 'Air, Water & Soil Pollution: Sources, Effects & Control Technologies', duration: '29:40', videoId: 'E6x7WJ8m5l0' },
    { id: 'evs2-2', lessonNumber: 2, title: 'Noise Pollution, Thermal Pollution & Environmental Standards (CPCB)', duration: '24:15', videoId: 'E6x7WJ8m5l0' },
  ],
  'mod-evs-3': [
    { id: 'evs3-1', lessonNumber: 1, title: 'Solid Waste Management, Hazardous Waste & E-Waste Recycling', duration: '27:30', videoId: 'E6x7WJ8m5l0' },
    { id: 'evs3-2', lessonNumber: 2, title: 'Circular Economy, Waste-to-Energy & 5R Environmental Principles', duration: '25:00', videoId: 'E6x7WJ8m5l0' },
  ],
  'mod-evs-4': [
    { id: 'evs4-1', lessonNumber: 1, title: 'Climate Change Mitigation, Global Warming & Carbon Footprint', duration: '32:00', videoId: 'E6x7WJ8m5l0' },
    { id: 'evs4-2', lessonNumber: 2, title: 'Renewable Energy Systems (Solar, Wind) & Green Building Audits', duration: '30:45', videoId: 'E6x7WJ8m5l0' },
  ],
};
