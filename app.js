/* ==========================================================================
   SHOOTING STARS - APP LOGIC & ASTRONOMICAL CALCULATIONS (app.js)
   ========================================================================== */

/**
 * 1. DATABASE ASTRONOMICO OFFLINE (Sciami Meteorici Principali)
 * RA (Ascensione Retta) in ore decimali [0 - 24h]
 * Dec (Declinazione) in gradi decimali [-90° a +90°]
 */
/**
 * 1. DATABASE ASTRONOMICO OFFLINE (Sciami Meteorici Principali)
 * RA (Ascensione Retta) in ore decimali [0 - 24h]
 * Dec (Declinazione) in gradi decimali [-90° a +90°]
 */
const METEOR_SHOWERS = [
  {
    id: "quadrantids",
    name: { it: "Quadrantidi (QUAD)", en: "Quadrantids (QUAD)" },
    ra: 15.33,       // 15h 20m
    dec: 49.0,       // +49°
    peakMonth: 1,    // Gennaio / January
    peakDay: 3,
    activeSpan: { it: "28 Dic - 12 Gen", en: "Dec 28 - Jan 12" }
  },
  {
    id: "lyrids",
    name: { it: "Liridi (LYR)", en: "Lyrids (LYR)" },
    ra: 18.08,       // 18h 05m
    dec: 34.0,       // +34°
    peakMonth: 4,    // Aprile / April
    peakDay: 22,
    activeSpan: { it: "14 Apr - 30 Apr", en: "Apr 14 - Apr 30" }
  },
  {
    id: "eta_aquariids",
    name: { it: "Eta Aquaridi (ETA)", en: "Eta Aquariids (ETA)" },
    ra: 22.53,       // 22h 32m
    dec: -1.0,       // -1°
    peakMonth: 5,    // Maggio / May
    peakDay: 6,
    activeSpan: { it: "19 Apr - 28 Mag", en: "Apr 19 - May 28" }
  },
  {
    id: "delta_aquariids",
    name: { it: "Delta Aquaridi (SDA)", en: "Delta Aquariids (SDA)" },
    ra: 22.68,       // 22h 41m
    dec: -16.0,      // -16°
    peakMonth: 7,    // Luglio / July
    peakDay: 30,
    activeSpan: { it: "12 Lug - 23 Ago", en: "Jul 12 - Aug 23" }
  },
  {
    id: "perseids",
    name: { it: "Perseidi (PER)", en: "Perseids (PER)" },
    ra: 3.1,         // 03h 06m
    dec: 58.0,       // +58°
    peakMonth: 8,    // Agosto / August
    peakDay: 12,
    activeSpan: { it: "17 Lug - 24 Ago", en: "Jul 17 - Aug 24" }
  },
  {
    id: "orionids",
    name: { it: "Orionidi (ORI)", en: "Orionids (ORI)" },
    ra: 6.33,        // 06h 20m
    dec: 16.0,       // +16°
    peakMonth: 10,   // Ottobre / October
    peakDay: 21,
    activeSpan: { it: "02 Ott - 07 Nov", en: "Oct 02 - Nov 07" }
  },
  {
    id: "leonids",
    name: { it: "Leonidi (LEO)", en: "Leonids (LEO)" },
    ra: 10.2,        // 10h 12m
    dec: 22.0,       // +22°
    peakMonth: 11,   // Novembre / November
    peakDay: 17,
    activeSpan: { it: "06 Nov - 30 Nov", en: "Nov 06 - Nov 30" }
  },
  {
    id: "geminids",
    name: { it: "Geminidi (GEM)", en: "Geminids (GEM)" },
    ra: 7.46,        // 07h 28m
    dec: 33.0,       // +33°
    peakMonth: 12,   // Dicembre / December
    peakDay: 14,
    activeSpan: { it: "04 Dic - 20 Dic", en: "Dec 04 - Dec 20" }
  },
  {
    id: "ursids",
    name: { it: "Ursidi (URS)", en: "Ursids (URS)" },
    ra: 14.48,       // 14h 29m
    dec: 76.0,       // +76°
    peakMonth: 12,   // Dicembre / December
    peakDay: 22,
    activeSpan: { it: "17 Dic - 26 Dic", en: "Dec 17 - Dec 26" }
  }
];

/* ==========================================================================
   DICTIONARY / TRADUZIONI MULTILINGUA (IT & EN)
   ========================================================================== */
const I18N_TRANSLATIONS = {
  it: {
    selectShowerLabel: "Seleziona Sciame Meteorico",
    nextPeakBadge: "PROSSIMO PICCO",
    labelAzimuth: "AZIMUT",
    labelAltitude: "ALTITUDINE",
    labelStatus: "STATO",
    statusCalculating: "CALCOLO...",
    statusBelowHorizon: "SOTTO L'ORIZZONTE",
    statusVisible: "VISIBILE IN CIELO",
    radiantLabelHud: "RADIANTE",
    guidanceInit: "INIZIALIZZAZIONE...",
    guidancePointSky: "Punta il telefono verso il cielo",
    labelCompass: "BUSSOLA",
    modalDesc: "Bussola astronomica in realtà aumentata per guidarti verso il radiante delle stelle cadenti attualmente attivo.",
    modalPrecisionTitle: "⚠️ Per la massima precisione:",
    modalNoteGps: "Attiva il <strong>GPS</strong> del telefono.",
    modalNoteSensors: "Consenti l'accesso ai <strong>Sensori di Movimento/Bussola</strong>.",
    modalNoteCalibrate: "Calibra la bussola ruotando il telefono a forma di 8.",
    btnStart: "AVVIA E ATTIVA SENSORI",
    peakText: "Picco",
    activeSpanLabel: "Periodo di attività",
    gpsUnsupported: "Non supportato",
    gpsSearching: "Ricerca...",
    gpsDefault: "Usa Default (Roma)",
    compassActiveIos: "Attiva (iOS)",
    compassDeniedIos: "Negato (iOS)",
    compassDeniedAlert: "I permessi per la bussola sono stati negati. Abilitali nelle impostazioni di Safari/iOS.",
    compassError: "Errore Permessi",
    compassActiveAbsolute: "Attiva (Assoluta)",
    compassActiveStandard: "Attiva (Standard)",
    compassUnsupported: "Non supportato",
    targetLockedTitle: "🎯 RADIANTE PUNTATO!",
    targetLockedSub: "Sei esattamente nel mirino dello sciame!",
    turnRight: "Girati a DESTRA",
    turnLeft: "Girati a SINISTRA",
    pitchUp: "ALZA il telefono",
    pitchDown: "ABBASSA il telefono",
    andWord: "e",
    correctAlt: "Altezza corretta",
    correctAz: "Direzione azimutale corretta"
  },
  en: {
    selectShowerLabel: "Select Meteor Shower",
    nextPeakBadge: "NEXT PEAK",
    labelAzimuth: "AZIMUTH",
    labelAltitude: "ALTITUDE",
    labelStatus: "STATUS",
    statusCalculating: "CALCULATING...",
    statusBelowHorizon: "BELOW HORIZON",
    statusVisible: "VISIBLE IN SKY",
    radiantLabelHud: "RADIANT",
    guidanceInit: "INITIALIZING...",
    guidancePointSky: "Point your phone at the sky",
    labelCompass: "COMPASS",
    modalDesc: "Augmented reality astronomical compass to guide you toward the active meteor shower radiant.",
    modalPrecisionTitle: "⚠️ For best accuracy:",
    modalNoteGps: "Turn on phone <strong>GPS</strong>.",
    modalNoteSensors: "Allow access to <strong>Motion/Compass Sensors</strong>.",
    modalNoteCalibrate: "Calibrate compass by waving phone in a figure-8.",
    btnStart: "START & ENABLE SENSORS",
    peakText: "Peak",
    activeSpanLabel: "Active period",
    gpsUnsupported: "Not supported",
    gpsSearching: "Searching...",
    gpsDefault: "Using Default (Rome)",
    compassActiveIos: "Active (iOS)",
    compassDeniedIos: "Denied (iOS)",
    compassDeniedAlert: "Compass permissions were denied. Please enable them in Safari/iOS settings.",
    compassError: "Permission Error",
    compassActiveAbsolute: "Active (Absolute)",
    compassActiveStandard: "Active (Standard)",
    compassUnsupported: "Not supported",
    targetLockedTitle: "🎯 RADIANT LOCKED!",
    targetLockedSub: "You are aiming directly at the meteor shower radiant!",
    turnRight: "Turn RIGHT",
    turnLeft: "Turn LEFT",
    pitchUp: "TILT UP phone",
    pitchDown: "TILT DOWN phone",
    andWord: "and",
    correctAlt: "Correct elevation",
    correctAz: "Correct azimuth direction"
  }
};

// Stato globale dell'applicazione
const state = {
  lang: localStorage.getItem('app_lang') || (navigator.language && navigator.language.startsWith('it') ? 'it' : 'en'),
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
  langToggle: document.getElementById('lang-toggle'),
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

/**
 * Ottiene la stringa tradotta per la chiave specificata nella lingua corrente
 */
function t(key) {
  return (I18N_TRANSLATIONS[state.lang] && I18N_TRANSLATIONS[state.lang][key]) || key;
}

/**
 * Aggiorna tutti gli elementi HTML contrassegnati con data-i18n
 */
function updateStaticTranslations() {
  document.documentElement.lang = state.lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key && I18N_TRANSLATIONS[state.lang][key]) {
      el.innerHTML = I18N_TRANSLATIONS[state.lang][key];
    }
  });

  if (dom.langToggle) {
    dom.langToggle.textContent = state.lang === 'it' ? 'IT 🇮🇹 | EN' : 'EN 🇬🇧 | IT';
  }
}

/**
 * Attiva o disattiva la lingua dell'applicazione tra Italiano e Inglese
 */
function setLanguage(lang) {
  state.lang = lang;
  localStorage.setItem('app_lang', lang);
  updateStaticTranslations();
  initShowerSelector();
  recalculateTargetCoordinates();
  renderHUDUpdates();
}

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
  const currentSelectedValue = dom.showerSelect.value;
  dom.showerSelect.innerHTML = '';
  const defaultShower = findClosestPeakShower();

  METEOR_SHOWERS.forEach(shower => {
    const option = document.createElement('option');
    option.value = shower.id;
    const showerName = shower.name[state.lang] || shower.name['it'];
    option.textContent = `${showerName} (${t('peakText')}: ${shower.peakDay}/${shower.peakMonth})`;
    
    if (currentSelectedValue ? shower.id === currentSelectedValue : shower.id === defaultShower.id) {
      option.selected = true;
      state.activeShower = shower;
    }
    dom.showerSelect.appendChild(option);
  });

  if (!state.activeShower) {
    state.activeShower = defaultShower;
  }
  updateShowerDetails();

  dom.showerSelect.onchange = (e) => {
    const selected = METEOR_SHOWERS.find(s => s.id === e.target.value);
    if (selected) {
      state.activeShower = selected;
      updateShowerDetails();
      recalculateTargetCoordinates();
    }
  };
}

function updateShowerDetails() {
  if (!state.activeShower) return;
  const activeSpan = state.activeShower.activeSpan[state.lang] || state.activeShower.activeSpan['it'];
  const showerName = state.activeShower.name[state.lang] || state.activeShower.name['it'];
  dom.showerDatesInfo.textContent = `${t('activeSpanLabel')}: ${activeSpan} | RA: ${state.activeShower.ra}h Dec: ${state.activeShower.dec}°`;
  dom.radiantLabelHud.textContent = showerName.split(' ')[0].toUpperCase();
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
    dom.targetVisibility.textContent = t('statusBelowHorizon');
    dom.targetVisibility.style.color = "#883333";
  } else {
    dom.targetVisibility.textContent = t('statusVisible');
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
    dom.gpsStatus.textContent = t('gpsUnsupported');
    return;
  }

  dom.gpsStatus.textContent = t('gpsSearching');

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
      dom.gpsStatus.textContent = t('gpsDefault');
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
        dom.compassStatus.textContent = t('compassActiveIos');
      } else {
        dom.compassStatus.textContent = t('compassDeniedIos');
        alert(t('compassDeniedAlert'));
      }
    } catch (err) {
      console.error('DeviceOrientation permission error:', err);
      dom.compassStatus.textContent = t('compassError');
    }
  } else if ('ondeviceorientationabsolute' in window) {
    // Android Absolute Orientation se supportato
    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    dom.compassStatus.textContent = t('compassActiveAbsolute');
  } else if ('ondeviceorientation' in window) {
    // Fallback standard Android / Browser Desktop
    window.addEventListener('deviceorientation', handleOrientation, true);
    dom.compassStatus.textContent = t('compassActiveStandard');
  } else {
    dom.compassStatus.textContent = t('compassUnsupported');
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

/**
 * Calcola la nuova rotazione cumulativa mantenendo il tragitto più breve per evitare scatti tra 359° e 0°
 */
function getShortestRotation(currentRotation, targetAngle) {
  // Bring targetAngle into standard range [0, 360)
  targetAngle = (targetAngle % 360 + 360) % 360;
  // Current orientation in [0, 360)
  let currentNormalized = (currentRotation % 360 + 360) % 360;
  let diff = targetAngle - currentNormalized;
  if (diff < -180) diff += 360;
  if (diff > 180) diff -= 360;
  return currentRotation + diff;
}

// Tracciamento dei gradi cumulativi effettivi applicati via CSS per una rotazione continua senza scatti
let currentCompassRotation = 0;
let currentPointerRotation = 0;

/* ==========================================================================
   5. RENDER DELL'INTERFACCIA GRAFICA (HUD & GUIDANCE)
   ========================================================================== */

/**
 * Aggiorna gli elementi grafici del mirino/bussola ad ogni frame sensoriel
 */
function renderHUDUpdates() {
  // 1. Ruota l'anello della bussola esteriore in modo fluido e continuo
  // Se la bussola del telefono punta a `deviceHeading`, l'anello deve ruotare di `-deviceHeading`
  const targetCompassRotation = -state.deviceHeading;
  currentCompassRotation = getShortestRotation(currentCompassRotation, targetCompassRotation);
  dom.compassRing.style.transform = `rotate(${currentCompassRotation}deg)`;

  // 2. Ruota il puntatore del radiante sulla bussola in modo fluido e continuo
  // L'angolo relativo al radiante rispetto alla direzione del telefono è (TargetAz - DeviceHeading)
  const relativeAzimuth = (state.targetAzimuth - state.deviceHeading + 360) % 360;
  currentPointerRotation = getShortestRotation(currentPointerRotation, relativeAzimuth);
  dom.targetPointerContainer.style.transform = `rotate(${currentPointerRotation}deg)`;

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
    message = t('targetLockedTitle');
    subMessage = t('targetLockedSub');
  } else {
    // Guida Orizzontale (Azimut)
    let azText = "";
    if (absAzDiff > 5) {
      if (azDiff > 0) {
        azText = `${t('turnRight')} (${Math.round(absAzDiff)}°)`;
      } else {
        azText = `${t('turnLeft')} (${Math.round(absAzDiff)}°)`;
      }
    }

    // Guida Verticale (Altitudine)
    let altText = "";
    if (absAltDiff > 5) {
      if (altDiff > 0) {
        altText = `${t('pitchUp')} (${Math.round(absAltDiff)}°)`;
      } else {
        altText = `${t('pitchDown')} (${Math.round(absAltDiff)}°)`;
      }
    }

    if (azText && altText) {
      message = `${azText}`;
      subMessage = `${t('andWord')} ${altText.toLowerCase()}`;
    } else if (azText) {
      message = azText;
      subMessage = t('correctAlt');
    } else if (altText) {
      message = altText;
      subMessage = t('correctAz');
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
    
    // Feedback con vibrazione ed audio radar ping
    const now = Date.now();
    if (now - state.lastVibrationTime > 1200) {
      triggerHapticFeedback();
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
  updateStaticTranslations();
  initShowerSelector();
  recalculateTargetCoordinates();
  registerServiceWorker();

  // Toggle cambio lingua IT / EN
  if (dom.langToggle) {
    dom.langToggle.addEventListener('click', () => {
      const nextLang = state.lang === 'it' ? 'en' : 'it';
      setLanguage(nextLang);
    });
  }

  // Timer per ricalcolare la posizione astronomica del radiante ogni 30 secondi (il cielo ruota lentamente)
  setInterval(() => {
    recalculateTargetCoordinates();
  }, 30000);

  // Click sul pulsante Inizia (Attiva sensori e nasconde overlay modal)
  dom.btnStart.addEventListener('click', async () => {
    dom.startModal.classList.add('hidden');
    initAudioContext();
    initGPS();
    await requestOrientationPermission();
  });
});

/* ==========================================================================
   AUDIO-HAPTIC FEEDBACK (Web Audio API & Navigator Vibrate)
   ========================================================================== */

let audioCtx = null;

/**
 * Inizializza o riattiva l'AudioContext del browser in risposta ad un gesto utente
 */
function initAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

/**
 * Riproduce un suono sintetizzato di "Lock-On" (radar ping armonico)
 */
function playLockOnSound() {
  if (!audioCtx) return;
  try {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const now = audioCtx.currentTime;

    // Primo bip a 880 Hz
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 0.08);

    // Secondo bip armonico a 1760 Hz
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1760, now + 0.1);
    gain2.gain.setValueAtTime(0.2, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.22);
  } catch (e) {
    console.warn('Audio feedback error:', e);
  }
}

/**
 * Attiva il feedback tattile/acustico (Vibrazione + Suono)
 */
function triggerHapticFeedback() {
  // 1. Vibrazione fisica (Android / Chrome dove supportato)
  try {
    if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
      navigator.vibrate([100, 50, 100]);
    }
  } catch (e) {
    console.warn('Vibration API error:', e);
  }

  // 2. Audio Radar Ping (Fallback per iOS Safari e dispositivi senza motorino di vibrazione)
  playLockOnSound();
}

