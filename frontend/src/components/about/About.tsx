import './About.css'

function About() {
  return (
    <div className="about-page">
      <h1>About Vacations</h1>
      <p>
        Vacations is a full-stack travel booking platform built with React, Node.js, MongoDB, and Docker.
        Browse destinations around the world, like your favourites, and get AI-powered travel recommendations.
      </p>

      <div className="about-tech">
        <div className="tech-card">
          <h3>Frontend</h3>
          <ul>
            <li>React 18 + TypeScript</li>
            <li>Redux Toolkit</li>
            <li>React Router v6</li>
            <li>Vite</li>
          </ul>
        </div>
        <div className="tech-card">
          <h3>Backend</h3>
          <ul>
            <li>Node.js + Express</li>
            <li>TypeScript</li>
            <li>JWT authentication</li>
            <li>Joi validation</li>
          </ul>
        </div>
        <div className="tech-card">
          <h3>Database & Infra</h3>
          <ul>
            <li>MongoDB + Mongoose</li>
            <li>Docker + Compose</li>
            <li>OpenAI GPT-4o-mini</li>
            <li>MCP protocol</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default About
