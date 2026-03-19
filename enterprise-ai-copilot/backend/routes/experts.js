const express = require('express')
const router  = express.Router()

const EXPERTS = [
  {
    id: 'aiml', name: 'AI / ML Expert', role: 'Core Intelligence Layer',
    status: 'active', phase: 1, progress: 90,
    skills: ['LLMs', 'PyTorch', 'RAG', 'XAI', 'Fine-tuning', 'LangChain', 'Hugging Face', 'OpenAI API'],
    responsibilities: ['Decision model design', 'Scenario simulation engine', 'NLP pipelines', 'Explainability modules'],
    techStack: { framework: 'LangChain', model: 'GPT-4o + fine-tuned', vectorDb: 'ChromaDB', infra: 'Python FastAPI' },
  },
  {
    id: 'fullstack', name: 'Full Stack Developer', role: 'Application & UI Layer',
    status: 'active', phase: 1, progress: 80,
    skills: ['React', 'Node.js', 'FastAPI', 'PostgreSQL', 'WebSockets', 'TypeScript', 'Redis', 'GraphQL'],
    responsibilities: ['Web dashboard', 'REST API gateway', 'Real-time data streaming', 'Backend microservices'],
    techStack: { frontend: 'React + Vite', backend: 'Express + Node.js', database: 'PostgreSQL', cache: 'Redis' },
  },
  {
    id: 'data', name: 'Data Engineer', role: 'Data Pipeline & Storage',
    status: 'active', phase: 1, progress: 75,
    skills: ['Apache Spark', 'Kafka', 'dbt', 'Airflow', 'Snowflake', 'Python', 'Delta Lake', 'Fivetran'],
    responsibilities: ['ETL workflows', 'Data lake management', 'Real-time ingestion', 'Data quality checks'],
    techStack: { streaming: 'Apache Kafka', warehouse: 'Snowflake', orchestration: 'Apache Airflow', transform: 'dbt' },
  },
  {
    id: 'cloud', name: 'Cloud Architect', role: 'Infrastructure & Scalability',
    status: 'planned', phase: 2, progress: 12,
    skills: ['AWS / GCP', 'Terraform', 'Kubernetes', 'Docker', 'IAM', 'CI/CD', 'CloudWatch', 'VPC'],
    responsibilities: ['Multi-region deployment', 'Auto-scaling', 'IAM & security', 'CI/CD pipelines'],
    techStack: { provider: 'TBD (AWS/GCP)', iac: 'Terraform', orchestration: 'Kubernetes', cicd: 'GitHub Actions + ArgoCD' },
  },
]

// GET /api/experts
router.get('/', (req, res) => res.json({ experts: EXPERTS }))

// GET /api/experts/:id
router.get('/:id', (req, res) => {
  const expert = EXPERTS.find(e => e.id === req.params.id)
  if (!expert) return res.status(404).json({ error: 'Expert not found' })
  res.json(expert)
})

module.exports = router
