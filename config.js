var config = {
  development: {
    server: {
      port: 3001,
    },
    database: {
      url: 'mongodb://localhost/localdebt-dev'
    }
  },
  testing: {
    server: {
      port: 3001
    },
    database: {
      url: 'mongodb://localhost/localdebt_test'
    }
  },
  production: {
    server: {
      port: 8080
    },
    database: {
      url: 'mongodb://localhost/localdebt'
    }
  }
};

module.exports = config[process.env.NODE_ENV || 'development'];
