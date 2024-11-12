module.exports = {
  apps: [{
    name: "coze-nobel-prize",
    script: "npm",
    args: "start",
    env: {
      PORT: 3001,
      NODE_ENV: "production",
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env_production: {
      NODE_ENV: 'production'
    }
  }]
} 