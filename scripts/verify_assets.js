const http = require('http');

const urls = [
  '/',
  '/assets/css/styles.css',
  '/assets/js/main.js',
  '/assets/images/hero.jpg',
  '/assets/images/about.jpg',
  '/assets/images/facility_strength.jpg',
  '/assets/images/facility_cardio.jpg',
  '/assets/images/facility_turf.jpg',
  '/assets/images/facility_group_class.jpg',
  '/assets/images/facility_recovery_sauna.jpg',
  '/assets/images/facility_smoothie_bar.jpg',
  '/assets/images/facility_spin_studio.jpg',
  '/assets/images/facility_boxing_zone.jpg',
  '/assets/images/facility_locker_room.jpg',
  '/assets/images/facility_reception.jpg',
  '/assets/images/facility_yoga_studio.jpg',
  '/assets/images/trainer_marcus.jpg',
  '/assets/images/trainer_aisha.jpg',
  '/assets/images/trainer_danny.jpg',
  '/assets/images/trainer_priya.jpg',
  '/assets/images/trans_jordan_before.jpg',
  '/assets/images/trans_jordan_after.jpg',
  '/assets/images/trans_sarah_before.jpg',
  '/assets/images/trans_sarah_after.jpg',
  '/assets/images/trans_david_before.jpg',
  '/assets/images/trans_david_after.jpg'
];

async function checkUrl(u) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${u}`, (res) => {
      let size = 0;
      res.on('data', chunk => size += chunk.length);
      res.on('end', () => {
        resolve({ url: u, status: res.statusCode, size });
      });
    }).on('error', err => {
      resolve({ url: u, status: 'ERROR', error: err.message });
    });
  });
}

async function verifyAll() {
  console.log('Verifying all server endpoints and assets...');
  let failed = 0;
  for (const u of urls) {
    const res = await checkUrl(u);
    if (res.status === 200 && res.size > 0) {
      console.log(`[PASS] ${res.url} - ${res.status} (${res.size} bytes)`);
    } else {
      console.error(`[FAIL] ${res.url} - ${res.status}`);
      failed++;
    }
  }
  if (failed === 0) {
    console.log('SUCCESS: All 26 assets verified and served with HTTP 200 OK!');
  } else {
    console.error(`FAILURE: ${failed} assets failed!`);
  }
}

verifyAll();
