import './About.css'

function About() {
  return (
    <div className="about-page">
      <h1>About Vacations</h1>
      <p>
        Vacations is a full-stack travel booking platform where users can browse destinations around the world,
        like their favourites, and get AI-powered travel recommendations. Admins can manage the vacation
        catalogue, upload images, and download likes reports — all running in Docker.
      </p>

      <h2>Features</h2>
      <div className="about-features">
        <div className="feature-card">
          <span className="feature-icon">✈️</span>
          <h3>Browse Vacations</h3>
          <p>Paginated vacation cards with destination images, dates, and prices. Filter by liked, active, or upcoming trips.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">❤️</span>
          <h3>Like & Follow</h3>
          <p>Registered users can like destinations to save favourites. Like counts are shown on every card.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🛠️</span>
          <h3>Admin Panel</h3>
          <p>Admins can add, edit, and delete vacations including image uploads. A bar-chart report shows likes per destination with CSV export.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🤖</span>
          <h3>AI Recommendations</h3>
          <p>Get a GPT-4o-mini powered travel tip for any destination via the AI Tips page.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">💬</span>
          <h3>MCP Chat</h3>
          <p>Ask natural-language questions about available vacations. Answered by an MCP server that queries the live database.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🔐</span>
          <h3>Auth & Roles</h3>
          <p>JWT-based authentication with two roles: <strong>User</strong> and <strong>Admin</strong>. Routes are guarded per role.</p>
        </div>
      </div>

      <h2>Tech Stack</h2>
      <div className="about-tech">
        <div className="tech-card">
          <h3>Frontend</h3>
          <ul>
            <li>React 18 + TypeScript</li>
            <li>Redux Toolkit</li>
            <li>React Router v6</li>
            <li>Vite + nginx</li>
            <li>Recharts</li>
          </ul>
        </div>
        <div className="tech-card">
          <h3>Backend</h3>
          <ul>
            <li>Node.js + Express</li>
            <li>TypeScript</li>
            <li>JWT + bcryptjs</li>
            <li>Joi validation</li>
            <li>express-fileupload</li>
          </ul>
        </div>
        <div className="tech-card">
          <h3>Database & Infra</h3>
          <ul>
            <li>MongoDB 7 + Mongoose</li>
            <li>Docker + Compose</li>
            <li>OpenAI GPT-4o-mini</li>
            <li>MCP protocol server</li>
          </ul>
        </div>
      </div>

      <h2>Default Credentials</h2>
      <div className="about-credentials">
        <div className="cred-card">
          <span className="cred-role admin">Admin</span>
          <code>admin@vacations.com</code>
          <code>Admin1234</code>
        </div>
        <div className="cred-card">
          <span className="cred-role user">User</span>
          <code>user@vacations.com</code>
          <code>User1234</code>
        </div>
      </div>
    </div>
  )
}

export default About
