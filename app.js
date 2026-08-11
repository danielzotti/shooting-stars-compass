/* ==========================================================================
   SHOOTING STARS COMPASS - APP LOGIC & ASTRONOMICAL CALCULATIONS (app.js)
   ========================================================================== */

/**
 * 1. DATABASE ASTRONOMICO OFFLINE (Sciami Meteorici Principali)
 * RA (Ascensione Retta) in ore decimali [0 - 24h]
 * Dec (Declinazione) in gradi decimali [-90° a +90°]
 */
const METEOR_SHOWERS = [
  {
    id: "quadrantids",
    name: "Quadrantidi (QUAD)",
    ra: 15.33,       // 15h 20m
    dec: 49.0,       // +49°
    peakMonth: 1,    // Gennaio
    peakDay: 3,
    activeSpan: "28 Dic - 12 Gen"
  },
  {
    id: "lyrids",
    name: "Liridi (LYR)",
    ra: 18.08,       // 18h 05m
    dec: 34.0,       // +34°
    peakMonth: 4,    // Aprile
    peakDay: 22,
    activeSpan: "14 Apr - 30 Apr"
  },
  {
    id: "eta_aquariids",
    name: "Eta Aquaridi (ETA)",
    ra: 22.53,       // 22h 32m
    dec: -1.0,       // -1°
    peakMonth: 5,    // Maggio
    peakDay: 6,
    activeSpan: "19 Apr - 28 Mag"
  },
  {
    id: "delta_aquariids",
    name: "Delta Aquaridi (SDA)",
    ra: 22.68,       // 22h 41m
    dec: -16.0,      // -16°
    peakMonth: 7,    // Luglio
    peakDay: 30,
    activeSpan: "12 Lug - 23 Ago"
  },
  {
    id: "perseids",
    name: "Perseidi (PER)",
    ra: 3.1,         // 03h 06m
    dec: 58.0,       // +58°
    peakMonth: 8,    // Agosto
    peakDay: 12,
    activeSpan: "17 Lug - 24 Ago"
  },
  {
    id: "orionids",
    name: "Orionidi (ORI)",
    ra: 6.33,        // 06h 20m
    dec: 16.0,       // +16°
    peakMonth: 10,   // Ottobre
    peakDay: 21,
    activeSpan: "02 Ott - 07 Nov"
  },
  {
    id: "leonids",
    name: "Leonidi (LEO)",
    ra: 10.2,        // 10h 12m
    dec: 22.0,       // +22°
    peakMonth: 11,   // Novembre
    peakDay: 17,
    activeSpan: "06 Nov - 30 Nov"
  },
  {
    id: "geminids",
    name: "Geminidi (GEM)",
    ra: 7.46,        // 07h 28m
    dec: 33.0,       // +33°
    peakMonth: 12,   // Dicembre
    peakDay: 14,
    activeSpan: "04 Dic - 20 Dic"
  },
  {
    id: "ursids",
    name: "Ursidi (URS)",
    ra: 14.48,       // 14h 29m
    dec: 76.0,       // +76°
    peakMonth: 12,   // Dicembre
    peakDay: 22,
    activeSpan: "17 Dic - 26 Dic"
  }
];

// Stato globale dell'applicazione
const state = {
  activeShower: null,
  userCoords: { lat: 41.9028, lon: 12.4964 }, // Roma come fallback standard
  hasGPS: false,
  deviceHeading: 0,   // Alpha/Heading del telefono (0° - 360°)
  devicePitch: 0,     // Beta (Inclinazione avanti/dietro: 0° orizzontale, 90° verticale)
  targetAzimuth: 0,   // Azimut calcolato del radiante
  targetAltitude: 0,  // Altitudine calcolata del radiante
  isLocked: false,
  lastVibrationTime: 0
};

// Riferimenti agli elementi DOM
const dom = {
  startModal: document.getElementById('start-modal'),
  btnStart: document.getElementById('btn-start'),
  showerSelect: document.getElementById('shower-select'),
  activeBadge: document.getElementById('active-badge'),
  targetAz: document.getElementById('target-az'),
  targetAlt: document.getElementById('target-alt'),
  targetVisibility: document.getElementById('target-visibility'),
  compassRing: document.getElementById('compass-ring'),
  targetPointerContainer: document.getElementById('target-pointer-container'),
  targetRadiantMarker: document.getElementById('target-radiant-marker'),
  radiantLabelHud: document.getElementById('radiant-label-hud'),
  pitchTargetBar: document.getElementById('pitch-target-bar'),
  pitchCurrentBar: document.getElementById('pitch-current-bar'),
  guidanceText: document.getElementById('guidance-text'),
  angleOffsetText: document.getElementById('angle-offset-text'),
  gpsStatus: document.getElementById('gps-status'),
  compassStatus: document.getElementById('compass-status'),
  lstTime: document.getElementById('lst-time'),
  showerDatesInfo: document.getElementById('shower-dates-info')
};

/* ==========================================================================
   2. MATEMATICA ASTRONOMICA (Conversione da RA/Dec a Azimut/Altitudine)
   ========================================================================== */

/**
 * Calcola il Tempo Siderale Medio di Greenwich (GMST) in ore
 * Basato sul numero di giorni giuliani dal J2000.0 (1 Gen 2000, 12:00 UTC)
 */
function calculateGMST(date) {
  // Converte la data in Julian Date (JD)
  const time = date.getTime();
  const julianDate = (time / 86400000) + 2440587.5;
  const D = julianDate - 2451545.0; // Giorni da J2000.0

  // Formula approssimata standard per GMST (in ore decimali [0, 24])
  let gmst = 18.697374558 + 24.06570982441908 * D;
  gmst = gmst % 24;
  if (gmst < 0) gmst += 24;
  return gmst;
}

/**
 * Calcola il Tempo Siderale Locale (LST) in gradi decimali [0, 360]
 * LST = GMST + Longitudine (convertita in ore o gradi)
 */
function calculateLST(date, longitudeDeg) {
  const gmstHours = calculateGMST(date);
  const lonHours = longitudeDeg / 15.0;
  let lstHours = (gmstHours + lonHours) % 24;
  if (lstHours < 0) lstHours += 24;
  return lstHours * 15.0; // Converte ore in gradi
}

/**
 * Converte Coordinate Equatoriali (RA, Dec) in Coordinate Orizzontali Locali (Azimut, Altitudine)
 * @param {number} raHours - Ascensione Retta in ore (0-24)
 * @param {number} decDeg - Declinazione in gradi (-90 a +90)
 * @param {number} latDeg - Latitudine GPS dell'utente in gradi
 * @param {number} lonDeg - Longitudine GPS dell'utente in gradi
 * @param {Date} date - Data e ora attuale
 */
function equatorialToHorizontal(raHours, decDeg, latDeg, lonDeg, date) {
  const raDeg = raHours * 15.0;
  const lstDeg = calculateLST(date, lonDeg);
  
  // Angolo Orario (Hour Angle H) = LST - RA
  let H = (lstDeg - raDeg) % 360;
  if (H < 0) H += 360;

  // Conversione in Radianti per le funzioni Math di JavaScript
  const toRad = Math.PI / 180;
  const toDeg = 180 / Math.PI;

  const hRad = H * toRad;
  const decRad = decDeg * toRad;
  const latRad = latDeg * toRad;

  // 1. Calcolo dell'Altitudine (a): sin(a) = sin(Dec)*sin(Lat) + cos(Dec)*cos(Lat)*cos(H)
  const sinAlt = Math.sin(decRad) * Math.sin(latRad) + Math.cos(decRad) * Math.cos(latRad) * Math.cos(hRad);
  const altRad = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
  const altitude = altRad * toDeg;

  // 2. Calcolo dell'Azimut (A): cos(A) = (sin(Dec) - sin(Alt)*sin(Lat)) / (cos(Alt)*cos(Lat))
  const cosAlt = Math.cos(altRad);
  const cosLat = Math.cos(latRad);
  
  let azimut = 0;
  if (cosAlt * cosLat !== 0) {
    const cosAz = (Math.sin(decRad) - Math.sin(altRad) * Math.sin(latRad)) / (cosAlt * cosLat);
    const clampedCosAz = Math.max(-1, Math.min(1, cosAz));
    let azRad = Math.acos(clampedCosAz);
    
    // Se sin(H) > 0 allora Azimut è 360° - Az
    if (Math.sin(hRad) > 0) {
      azimut = 360 - (azRad * toDeg);
    } else {
      azimut = azRad * toDeg;
    }
  }

  return {
    azimuth: (azimut + 360) % 360,
    altitude: altitude
  };
}

/* ==========================================================================
   3. SELEZIONE DELLO SCIAME E AGGIORNAMENTO CALCOLI
   ========================================================================== */

/**
 * Trova lo sciame meteorico più vicino al picco rispetto alla data corrente
 */
function findClosestPeakShower() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-12
  const currentDay = now.getDate();

  let closestShower = METEOR_SHOWERS[0];
  let minDiffDays = 999;

  METEOR_SHOWERS.forEach(shower => {
    // Calcola approssimativamente i giorni di distanza dal picco quest'anno
    const peakDate = new Date(now.getFullYear(), shower.peakMonth - 1, shower.peakDay);
    let diffMs = Math.abs(peakDate.getTime() - now.getTime());
    let diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffDays < minDiffDays) {
      minDiffDays = diffDays;
      closestShower = shower;
    }
  });

  return closestShower;
}

/**
 * Popola il menu a tendina e seleziona lo sciame attivo
 */
function initShowerSelector() {
  dom.showerSelect.innerHTML = '';
  const defaultShower = findClosestPeakShower();

  METEOR_SHOWERS.forEach(shower => {
    const option = document.createElement('option');
    option.value = shower.id;
    option.textContent = `${shower.name} (Picco: ${shower.peakDay}/${shower.peakMonth})`;
    if (shower.id === defaultShower.id) {
      option.selected = true;
    }
    dom.showerSelect.appendChild(option);
  });

  state.activeShower = defaultShower;
  updateShowerDetails();

  dom.showerSelect.addEventListener('change', (e) => {
    const selected = METEOR_SHOWERS.find(s => s.id === e.target.value);
    if (selected) {
      state.activeShower = selected;
      updateShowerDetails();
      recalculateTargetCoordinates();
    }
  });
}

function updateShowerDetails() {
  if (!state.activeShower) return;
  dom.showerDatesInfo.textContent = `Periodo di attività: ${state.activeShower.activeSpan} | RA: ${state.activeShower.ra}h Dec: ${state.activeShower.dec}°`;
  dom.radiantLabelHud.textContent = state.activeShower.name.split(' ')[0].toUpperCase();
}

/**
 * Ricalcola Azimut ed Altitudine del radiante attuale
 */
function recalculateTargetCoordinates() {
  if (!state.activeShower) return;

  const now = new Date();
  const coords = equatorialToHorizontal(
    state.activeShower.ra,
    state.activeShower.dec,
    state.userCoords.lat,
    state.userCoords.lon,
    now
  );

  state.targetAzimuth = coords.azimuth;
  state.targetAltitude = coords.altitude;

  // Aggiorna UI Valori Target
  dom.targetAz.textContent = `${Math.round(state.targetAzimuth)}°`;
  dom.targetAlt.textContent = `${Math.round(state.targetAltitude)}°`;

  if (state.targetAltitude < 0) {
    dom.targetVisibility.textContent = "SOTTO L'ORIZZONTE";
    dom.targetVisibility.style.color = "#883333";
  } else {
    dom.targetVisibility.textContent = "VISIBILE IN CIELO";
    dom.targetVisibility.style.color = "#00ff66";
  }

  // Aggiorna LST nella barra inferiore
  const lstDeg = calculateLST(now, state.userCoords.lon);
  const lstHours = Math.floor(lstDeg / 15);
  const lstMins = Math.floor((lstDeg % 15) * 4);
  dom.lstTime.textContent = `${String(lstHours).padStart(2, '0')}:${String(lstMins).padStart(2, '0')}`;
}

/* ==========================================================================
   4. INTEGRAZIONE SENSORI (GPS & DEVICE ORIENTATION / iOS & ANDROID)
   ========================================================================== */

/**
 * Inizializza Geolocalizzazione GPS
 */
function initGPS() {
  if (!('geolocation' in navigator)) {
    dom.gpsStatus.textContent = 'Non supportato';
    return;
  }

  dom.gpsStatus.textContent = 'Ricerca...';

  navigator.geolocation.watchPosition(
    (position) => {
      state.userCoords.lat = position.coords.latitude;
      state.userCoords.lon = position.coords.longitude;
      state.hasGPS = true;
      dom.gpsStatus.textContent = `${state.userCoords.lat.toFixed(2)}°, ${state.userCoords.lon.toFixed(2)}°`;
      recalculateTargetCoordinates();
    },
    (error) => {
      console.warn('GPS Error/Permission Denied:', error);
      dom.gpsStatus.textContent = 'Usa Default (Roma)';
      recalculateTargetCoordinates();
    },
    {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 10000
    }
  );
}

/**
 * Richiede ed attiva le API di orientamento del dispositivo (DeviceOrientation)
 * Gestisce la richiesta esplicita dei permessi per iOS 13+
 */
async function requestOrientationPermission() {
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const permissionState = await DeviceOrientationEvent.requestPermission();
      if (permissionState === 'granted') {
        window.addEventListener('deviceorientation', handleOrientation, true);
        dom.compassStatus.textContent = 'Attiva (iOS)';
      } else {
        dom.compassStatus.textContent = 'Negato (iOS)';
        alert('I permessi per la bussola sono stati negati. Abilitali nelle impostazioni di Safari/iOS.');
      }
    } catch (err) {
      console.error('DeviceOrientation permission error:', err);
      dom.compassStatus.textContent = 'Errore Permessi';
    }
  } else if ('ondeviceorientationabsolute' in window) {
    // Android Absolute Orientation se supportato
    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    dom.compassStatus.textContent = 'Attiva (Absolute)';
  } else if ('ondeviceorientation' in window) {
    // Fallback standard Android / Browser Desktop
    window.addEventListener('deviceorientation', handleOrientation, true);
    dom.compassStatus.textContent = 'Attiva (Standard)';
  } else {
    dom.compassStatus.textContent = 'Non supportato';
  }
}

/**
 * Callback di gestione evento DeviceOrientation
 * Compensazione delle differenze di Heading tra iOS (webkitCompassHeading) e Android (alpha)
 */
function handleOrientation(event) {
  let heading = 0;

  // 1. Caso iOS (Safari fornisce webkitCompassHeading diretto da 0° a 360° rispetto al Nord magnetico/vero)
  if (event.webkitCompassHeading !== undefined && event.webkitCompassHeading !== null) {
    heading = event.webkitCompassHeading;
  } 
  // 2. Caso Android con alpha assoluto
  else if (event.alpha !== null) {
    // In Android l'alpha gira in senso antiorario ed è relativo alla calibrazione
    heading = (360 - event.alpha) % 360;
  }

  // Pitch/Inclinazione del telefono (Beta)
  // Beta varia solitamente da -180° a 180°. 0° = orizzontale su tavolo, 90° = verticale in piedi.
  let pitch = event.beta !== null ? event.beta : 0;
  // Limitiamo il pitch per il mirino da 0° (orizzonte) a 90° (zenith verticale)
  pitch = Math.max(0, Math.min(90, pitch));

  state.deviceHeading = (heading + 360) % 360;
  state.devicePitch = pitch;

  renderHUDUpdates();
}

/* ==========================================================================
   5. RENDER DELL'INTERFACCIA GRAFICA (HUD & GUIDANCE)
   ========================================================================== */

/**
 * Aggiorna gli elementi grafici del mirino/bussola ad ogni frame sensoriel
 */
function renderHUDUpdates() {
  // 1. Ruota l'anello della bussola esteriore
  // Se la bussola del telefono punta a `deviceHeading`, l'anello deve ruotare di `-deviceHeading`
  dom.compassRing.style.transform = `rotate(${-state.deviceHeading}deg)`;

  // 2. Ruota il puntatore del radiante sulla bussola
  // L'angolo relativo al radiante rispetto alla direzione del telefono è (TargetAz - DeviceHeading)
  const relativeAzimuth = (state.targetAzimuth - state.deviceHeading + 360) % 360;
  dom.targetPointerContainer.style.transform = `rotate(${relativeAzimuth}deg)`;

  // 3. Aggiorna la scala dell'inclinazione / Altitudine (Pitch Axis)
  // Mappa 0° - 90° su una percentuale di altezza della barra (0% - 100%)
  const pitchPercent = (state.devicePitch / 90) * 100;
  const targetPitchPercent = (Math.max(0, Math.min(90, state.targetAltitude)) / 90) * 100;

  dom.pitchCurrentBar.style.bottom = `${pitchPercent}%`;
  dom.pitchTargetBar.style.bottom = `${targetPitchPercent}%`;

  // 4. Calcola la differenza angolare (Azimut + Altitudine) per le istruzioni di guida
  let azDiff = state.targetAzimuth - state.deviceHeading;
  // Normalizza la differenza in un range da -180° a +180°
  while (azDiff > 180) azDiff -= 360;
  while (azDiff < -180) azDiff += 360;

  let altDiff = state.targetAltitude - state.devicePitch;

  const absAzDiff = Math.abs(azDiff);
  const absAltDiff = Math.abs(altDiff);

  // 5. Genera i messaggi di guida in tempo reale ("Girati a Sinistra/Destra", "Alza/Abbassa")
  updateGuidancePrompts(azDiff, altDiff, absAzDiff, absAltDiff);

  // 6. Controlla la condizione di TARGET LOCK (Margine di errore ±5 gradi su entrambi gli assi)
  const isCurrentlyLocked = absAzDiff <= 5 && absAltDiff <= 5;
  handleTargetLockState(isCurrentlyLocked);
}

/**
 * Aggiorna i testi di aiuto per il puntamento
 */
function updateGuidancePrompts(azDiff, altDiff, absAzDiff, absAltDiff) {
  let message = "";
  let subMessage = "";

  if (absAzDiff <= 5 && absAltDiff <= 5) {
    message = "🎯 RADIANTE PUNTATO!";
    subMessage = "Sei esattamente nel mirino dello sciame!";
  } else {
    // Guida Orizzontale (Azimut)
    let azText = "";
    if (absAzDiff > 5) {
      if (azDiff > 0) {
        azText = `Girati a DESTRA (${Math.round(absAzDiff)}°)`;
      } else {
        azText = `Girati a SINISTRA (${Math.round(absAzDiff)}°)`;
      }
    }

    // Guida Verticale (Altitudine)
    let altText = "";
    if (absAltDiff > 5) {
      if (altDiff > 0) {
        altText = `ALZA il telefono (${Math.round(absAltDiff)}°)`;
      } else {
        altText = `ABBASSA il telefono (${Math.round(absAltDiff)}°)`;
      }
    }

    if (azText && altText) {
      message = `${azText}`;
      subMessage = `e ${altText.toLowerCase()}`;
    } else if (azText) {
      message = azText;
      subMessage = "Altezza corretta";
    } else if (altText) {
      message = altText;
      subMessage = "Direzione azimutale corretta";
    }
  }

  dom.guidanceText.textContent = message;
  dom.angleOffsetText.textContent = subMessage;
}

/**
 * Gestisce lo stato di puntamento preciso (Lock On + Vibrazione)
 */
function handleTargetLockState(locked) {
  state.isLocked = locked;

  if (locked) {
    document.body.classList.add('target-locked');
    
    // Feedback con vibrazione (evita di vibrare in continuo in modo fastidioso)
    const now = Date.now();
    if (now - state.lastVibrationTime > 1200) {
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]); // Pulsazione vibrante doppia
      }
      state.lastVibrationTime = now;
    }
  } else {
    document.body.classList.remove('target-locked');
  }
}

/* ==========================================================================
   6. INIZIALIZZAZIONE PWA & SERVICE WORKER
   ========================================================================== */

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => console.log('[PWA] Service Worker registrato con successo:', reg.scope))
        .catch((err) => console.error('[PWA] Errore registrazione Service Worker:', err));
    });
  }
}

// Inizializzazione degli eventi dell'applicazione al caricamento del DOM
document.addEventListener('DOMContentLoaded', () => {
  initShowerSelector();
  recalculateTargetCoordinates();
  registerServiceWorker();

  // Timer per ricalcolare la posizione astronomica del radiante ogni 30 secondi (il cielo ruota lentamente)
  setInterval(() => {
    recalculateTargetCoordinates();
  }, 30000);

  // Click sul pulsante Inizia (Attiva sensori e nasconde overlay modal)
  dom.btnStart.addEventListener('click', async () => {
    dom.startModal.classList.add('hidden');
    initGPS();
    await requestOrientationPermission();
  });
});
