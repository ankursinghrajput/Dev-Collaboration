const NetworkBackground = () => {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.6 }}>
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.1" />
            <stop offset="50%" stopColor="var(--accent-primary)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Animated Lines connecting nodes */}
        <g stroke="url(#lineGrad)" strokeWidth="2.5" fill="none">
          <path d="M 15vw 25vh Q 35vw 15vh 55vw 35vh T 85vw 25vh" className="path-anim" />
          <path d="M 10vw 65vh Q 30vw 85vh 50vw 55vh T 85vw 75vh" className="path-anim-2" />
          <path d="M 25vw 45vh L 45vw 65vh" className="path-anim-3" />
          <path d="M 55vw 35vh L 85vw 75vh" className="path-anim-4" />
          <path d="M 15vw 25vh L 10vw 65vh" className="path-anim-3" style={{ animationDelay: '2s' }} />
        </g>

        {/* Nodes (People) */}
        <g fill="var(--accent-primary)">
          {/* Node 1 */}
          <circle cx="15vw" cy="25vh" r="8" className="node-anim" />
          <text x="15vw" y="20vh" fill="var(--text-secondary)" fontSize="13" fontWeight="500" textAnchor="middle" opacity="0.8">Frontend Dev</text>

          {/* Node 2 */}
          <circle cx="55vw" cy="35vh" r="10" className="node-anim" style={{ animationDelay: '1s' }} />
          <text x="55vw" y="30vh" fill="var(--text-secondary)" fontSize="13" fontWeight="500" textAnchor="middle" opacity="0.8">Backend Dev</text>

          {/* Node 3 */}
          <circle cx="85vw" cy="25vh" r="7" className="node-anim" style={{ animationDelay: '2s' }} />
          <text x="85vw" y="20vh" fill="var(--text-secondary)" fontSize="13" fontWeight="500" textAnchor="middle" opacity="0.8">UI/UX Designer</text>

          {/* Node 4 */}
          <circle cx="10vw" cy="65vh" r="9" className="node-anim" style={{ animationDelay: '1.5s' }} />
          <text x="10vw" y="60vh" fill="var(--text-secondary)" fontSize="13" fontWeight="500" textAnchor="middle" opacity="0.8">Full Stack</text>

          {/* Node 5 */}
          <circle cx="45vw" cy="65vh" r="8" className="node-anim" style={{ animationDelay: '0.5s' }} />
          <text x="45vw" y="60vh" fill="var(--text-secondary)" fontSize="13" fontWeight="500" textAnchor="middle" opacity="0.8">DevOps</text>

          {/* Node 6 */}
          <circle cx="85vw" cy="75vh" r="9" className="node-anim" style={{ animationDelay: '2.5s' }} />
          <text x="85vw" y="70vh" fill="var(--text-secondary)" fontSize="13" fontWeight="500" textAnchor="middle" opacity="0.8">Data Scientist</text>
          
          {/* Node 7 */}
          <circle cx="25vw" cy="45vh" r="6" className="node-anim" style={{ animationDelay: '3s' }} />
          <text x="25vw" y="40vh" fill="var(--text-secondary)" fontSize="13" fontWeight="500" textAnchor="middle" opacity="0.8">Mobile Dev</text>
        </g>
      </svg>
    </div>
  );
};

export default NetworkBackground;
