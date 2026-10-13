const fs = require('fs');
const path = require('path');
const https = require('https');

const images = {
  // Trainers (4 cards with high-res, professional gym portraits)
  'trainer_marcus.jpg': 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=800&q=80', // Head coach strength
  'trainer_aisha.jpg': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',  // Yoga & mobility specialist
  'trainer_danny.jpg': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',  // HIIT & conditioning coach
  'trainer_priya.jpg': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',  // Nutrition & PT coach

  // Transformations Before & After
  'trans_jordan_before.jpg': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
  'trans_jordan_after.jpg': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',

  'trans_sarah_before.jpg': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
  'trans_sarah_after.jpg': 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=800&q=80',

  'trans_david_before.jpg': 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80',
  'trans_david_after.jpg': 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=800&q=80',

  // Extra community/action shots for gallery
  'facility_members_action.jpg': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80',
  'facility_deadlift_focus.jpg': 'https://images.unsplash.com/photo-1521804906057-1df8fdb718b7?auto=format&fit=crop&w=900&q=80'
};

const outputDir = path.resolve(__dirname, '../assets/images');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function downloadImage(filename, url) {
  return new Promise((resolve, reject) => {
    const dest = path.join(outputDir, filename);
    const file = fs.createWriteStream(dest);

    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        https.get(response.headers.location, (res) => {
          res.pipe(file);
          file.on('finish', () => {
            file.close(() => {
              console.log(`Saved: ${filename} (${fs.statSync(dest).size} bytes)`);
              resolve();
            });
          });
        }).on('error', (err) => {
          fs.unlink(dest, () => {});
          reject(err);
        });
        return;
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log(`Saved: ${filename} (${fs.statSync(dest).size} bytes)`);
          resolve();
        });
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  for (const [name, url] of Object.entries(images)) {
    try {
      await downloadImage(name, url);
    } catch (e) {
      console.error(`Error downloading ${name}:`, e.message);
    }
  }
  console.log('All image downloads finished!');
}

run();
