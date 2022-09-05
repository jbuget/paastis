import sqlite3 from 'sqlite3'

//sqlite3.verbose()

let db
if (!db) {
  db = new sqlite3.Database('./dev.db')
}

function initializeDb() {
  db.serialize(() => {
    // Accounts
    db.run(`
CREATE TABLE IF NOT EXISTS accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT, 
  name TEXT NOT NULL, 
  email TEXT NOT NULL, 
  password TEXT NOT NULL 
)
`);
    db.get(`SELECT COUNT(*) AS count FROM accounts`, [], (err, row) => {
      if (err) throw err
      if (row.count < 1) {
        console.log('🌱 Seeding table "accounts"');
        [
          { name: 'John Doe', email: 'john@paastis.io', password: 'password' },
          { name: 'Jane Smith', email: 'jane@paastis.io', password: 'password' },
          { name: 'Bruce Wayne', email: 'brucee@paastis.io', password: 'password' },
        ].forEach(({ name, email, password }) => {
          db.run("INSERT INTO accounts (name, email, password) VALUES (?, ?, ?)", name, email, password)
        });
      } else {
        console.log('✅ Table "accounts" already seeded');
      }
    });

    // Providers
    db.run(`
CREATE TABLE IF NOT EXISTS providers (
  id INTEGER PRIMARY KEY AUTOINCREMENT, 
  name TEXT NOT NULL, 
  key TEXT NOT NULL, 
  url TEXT
)
`);
    db.get(`SELECT COUNT(*) AS count FROM providers`, [], (err, row) => {
      if (err) throw err
      if (row.count < 1) {
        console.log('🌱 Seeding table "providers"');
        [
          { name: 'CleverCloud', key: 'CLEVER_CLOUD', url: 'https://clever-cloud.com' },
          { name: 'DigitalOcean App Platform', key: 'DIGITAL_OCEAN', url: 'https://www.digitalocean.com' },
          { name: 'Google App Engine', key: 'GOOGLE', url: 'https://cloud.google.com/appengine' },
          { name: 'Heroku', key: 'HEROKU', url: 'https://heroku.com' },
          { name: 'Microsoft Azure App Service', key: 'AZURE', url: 'https://azure.microsoft.com' },
          { name: 'Platform.sh', key: 'PLATFORM_SH', url: 'https://platform.sh' },
          { name: 'Netlify', key: 'NETLIFY', url: 'https://netlify.com' },
          {
            name: 'RedHat OpenShift',
            key: 'OPEN_SHIFT',
            url: 'https://www.redhat.com/fr/technologies/cloud-computing/openshift'
          },
          { name: 'Render', key: 'RENDER', url: 'https://render.com' },
          { name: 'Scalingo', key: 'SCALINGO', url: 'https://scalingo.com' }
        ].forEach(({ name, key, url }) => {
          db.run("INSERT INTO providers (name, key, url) VALUES (?, ?, ?)", name, key, url)
        });
      } else {
        console.log('✅ Table "providers" already seeded');
      }
    });

    // Platforms
    db.run(`
CREATE TABLE IF NOT EXISTS platforms (
  id INTEGER PRIMARY KEY AUTOINCREMENT, 
  name TEXT NOT NULL, 
  description TEXT, 
  providerId INTEGER NOT NULL, 
  apiToken TEXT NOT NULL, 
  FOREIGN KEY(providerId) REFERENCES providers(id)
)
`);
    db.get(`SELECT COUNT(*) AS count FROM platforms`, [], (err, row) => {
      if (err) throw err
      if (row.count < 1) {
        console.log('🌱 Seeding table "platforms"');
        [
          {
            name: 'Scalingo perso',
            description: 'Incididunt veniam cupidatat reprehenderit aliqua veniam nisi reprehenderit qui ut mollit veniam. Eiusmod culpa commodo enim eiusmod occaecat magna ex esse officia veniam veniam cillum dolore ea ullamco. Minim labore enim ipsum ad fugiat aute enim ex culpa incididunt consequat consectetur veniam minim magna aute.',
            providerId: 3,
            apiToken: 'FF4FB016-2BE8-4AC5-A475-8E3408523427'
          },
          {
            name: 'Scalingo pro',
            description: 'Eiusmod nisi officia tempor laboris et voluptate laborum consequat nostrud occaecat exercitation exercitation irure amet velit laborum pariatur nisi. Commodo laborum laborum elit fugiat eu commodo laborum id laboris ea non sed ullamco reprehenderit magna fugiat.',
            providerId: 3,
            apiToken: '53F30D65-FF5A-45EE-B51F-7B76B3BBDABC'
          },
          {
            name: 'CleverCloud',
            description: 'In aute anim aliqua sit duis enim eu quis mollit deserunt laborum do laborum nisi sint. Amet qui ut irure consectetur exercitation pariatur incididunt proident labore veniam nostrud sed.',
            providerId: 1,
            apiToken: '7760DB5B-8EA6-422D-A880-41E1ACE9E961'
          },
          {
            name: 'Heroku',
            description: 'Eiusmod ut consequat consequat lorem veniam sint non veniam dolor ullamco id deserunt ullamco exercitation laborum enim tempor non qui. Fugiat reprehenderit proident nisi ad anim aliqua dolor duis laboris nulla.',
            providerId: 4,
            apiToken: '45586901-DCF9-4B08-A1E7-6B1511E719E8'
          },
          {
            name: 'Dokku',
            description: 'Officia reprehenderit id proident voluptate eiusmod do laborum irure occaecat ut mollit proident mollit. Nulla do eu labore aliqua eiusmod velit in consequat id nisi veniam nulla id.',
            providerId: 6,
            apiToken: '73E2A79C-2C7F-450C-ADF7-B9CA91A99068'
          }
        ].forEach(({ name, description, providerId, apiToken }) => {
          db.run(`INSERT INTO platforms (name, description, providerId, apiToken) VALUES (?, ?, ?, ?)`, name, description, providerId, apiToken)
        });
      } else {
        console.log('✅ Table "platforms" already seeded')
      }
    });
  });
}

function registerUser({ name, email, password }) {
  return new Promise((resolve, reject) => {
    db.run("INSERT INTO accounts (name, email, password) VALUES (?, ?, ?)", name, email, password, function(err) {
      if (err) reject(err);
      resolve();
    });
  });
}

function listAllPlatforms() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM platforms ORDER BY name`, [], function(err, rows) {
      if (err) reject(err)
      resolve(rows)
    })
  });
}

export {
  initializeDb, listAllPlatforms, registerUser
}
