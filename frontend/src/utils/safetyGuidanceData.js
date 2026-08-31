// Safety Guidance Data — Ahnaf
// Indexed by utilityType -> issueCategory -> guidance object
// severity: 'critical' | 'warning' | 'info'

export const ISSUE_CATEGORIES = {
  DESCO: [
    { value: '', label: 'Select Issue Type' },
    { value: 'DESCO_LIVE_WIRE',       label: 'Fallen / Live Wire on Ground' },
    { value: 'DESCO_VOLTAGE_SURGE',   label: 'Voltage Surge / Equipment Burning' },
    { value: 'DESCO_POWER_OUTAGE',    label: 'Complete Power Outage' },
    { value: 'DESCO_METER_FAULT',     label: 'Meter Fault / Wrong Reading' },
    { value: 'DESCO_BILL_OVERCHARGE', label: 'Bill Overcharge / Dispute' },
    { value: 'DESCO_LOW_VOLTAGE',     label: 'Low Voltage / Frequent Fluctuation' },
  ],
  WASA: [
    { value: '', label: 'Select Issue Type' },
    { value: 'WASA_CONTAMINATION',   label: 'Water Contamination / Foul Smell' },
    { value: 'WASA_PIPE_BURST',      label: 'Pipe Burst / Major Leakage' },
    { value: 'WASA_NO_SUPPLY',       label: 'No Water Supply' },
    { value: 'WASA_LOW_PRESSURE',    label: 'Low Water Pressure' },
    { value: 'WASA_BILL_OVERCHARGE', label: 'Bill Overcharge / Dispute' },
    { value: 'WASA_FLOODING',        label: 'Road Flooding from Pipe' },
  ],
  TITAS: [
    { value: '', label: 'Select Issue Type' },
    { value: 'TITAS_GAS_LEAK',       label: 'Gas Leak / Strong Gas Smell' },
    { value: 'TITAS_LOW_PRESSURE',   label: 'Low Gas Pressure' },
    { value: 'TITAS_NO_SUPPLY',      label: 'No Gas Supply' },
    { value: 'TITAS_METER_FAULT',    label: 'Meter Fault / Wrong Reading' },
    { value: 'TITAS_BILL_OVERCHARGE',label: 'Bill Overcharge / Dispute' },
  ],
};

// Map utility select values from ComplaintForm to keys above
export const UTILITY_TYPE_MAP = {
  DESCO: 'DESCO',
  WASA: 'WASA',
  TITAS: 'TITAS',
};

export const SAFETY_GUIDANCE = {
  // ─── DESCO ───────────────────────────────────────────────────────────────
  DESCO_LIVE_WIRE: {
    severity: 'critical',
    icon: '⚡',
    title: 'CRITICAL — Live Wire Hazard',
    summary: 'An uninsulated or fallen live wire can cause instant electrocution. Keep everyone away immediately.',
    actions: [
      'Maintain at least 10 metres distance from the wire.',
      'Warn pedestrians and traffic — do NOT let anyone approach.',
      'Do NOT attempt to move or pick up the wire yourself.',
      'Call emergency services and DESCO immediately.',
      'If someone is electrocuted, do NOT touch them — cut power first.',
    ],
    doNots: [
      'Do NOT touch the wire with bare hands or any conductive object.',
      'Do NOT drive a vehicle over it.',
      'Do NOT use water near the wire.',
    ],
    hotlines: [
      { label: 'National Emergency', number: '999' },
      { label: 'DESCO Emergency', number: '16611' },
    ],
  },

  DESCO_VOLTAGE_SURGE: {
    severity: 'critical',
    icon: '🔥',
    title: 'URGENT — Voltage Surge / Burning Equipment',
    summary: 'A voltage surge can start fires and destroy electronics. Act quickly to prevent damage.',
    actions: [
      'Immediately switch off the main circuit breaker if safe to do so.',
      'Unplug all valuable electronics and appliances.',
      'If any equipment is on fire, use a dry-powder/CO₂ extinguisher (NOT water).',
      'Evacuate the building if smoke or fire is detected.',
    ],
    doNots: [
      'Do NOT pour water on an electrical fire.',
      'Do NOT touch melted wires or burnt sockets.',
      'Do NOT switch on the main power until DESCO technicians inspect.',
    ],
    hotlines: [
      { label: 'National Emergency', number: '999' },
      { label: 'Fire Service', number: '102' },
      { label: 'DESCO Helpline', number: '16611' },
    ],
  },

  DESCO_POWER_OUTAGE: {
    severity: 'warning',
    icon: '💡',
    title: 'Power Outage — Advisory',
    summary: 'Your area is experiencing a power cut. Stay safe while awaiting restoration.',
    actions: [
      'Use a torch or battery-powered lamp instead of candles where possible.',
      'Unplug sensitive devices (computers, TVs) to protect from surge when power returns.',
      'Keep refrigerator/freezer doors closed to preserve cold.',
      'Check if neighbours also have no power to confirm it is area-wide.',
    ],
    doNots: [
      'Do NOT use generators indoors (carbon monoxide risk).',
      'Do NOT leave candles unattended.',
    ],
    hotlines: [
      { label: 'DESCO Helpline', number: '16611' },
    ],
  },

  DESCO_METER_FAULT: {
    severity: 'info',
    icon: '📋',
    title: 'Meter Fault — Advisory',
    summary: 'A faulty meter may show incorrect readings. Follow these steps for a quick resolution.',
    actions: [
      'Take a clear photo/video of the current meter display and date it.',
      'Note your meter number from the bill or meter unit.',
      'Do not tamper with or attempt to repair the meter yourself.',
      'Submit this complaint with your meter number and the photo as evidence.',
    ],
    doNots: [
      'Do NOT attempt to open or reset the meter.',
      'Do NOT pay a disputed amount without a written acknowledgment.',
    ],
    hotlines: [
      { label: 'DESCO Helpline', number: '16611' },
    ],
  },

  DESCO_BILL_OVERCHARGE: {
    severity: 'info',
    icon: '🧾',
    title: 'Billing Dispute — Advisory',
    summary: 'You may be entitled to a corrected bill. Here is how to escalate effectively.',
    actions: [
      'Collect the last 3 months of bills for comparison.',
      'Record your current meter reading and cross-check with the bill.',
      'File this complaint with your account number, meter number, and bill details.',
      'Request a written acknowledgement from DESCO upon submission.',
      'If unresolved in 15 days, you may escalate to BERC (Bangladesh Energy Regulatory Commission).',
    ],
    doNots: [
      'Do NOT withhold full payment without a formal dispute filing.',
      'Do NOT accept verbal assurances — always get written confirmations.',
    ],
    hotlines: [
      { label: 'DESCO Helpline', number: '16611' },
      { label: 'BERC Complaint Cell', number: '16516' },
    ],
  },

  DESCO_LOW_VOLTAGE: {
    severity: 'warning',
    icon: '⚠️',
    title: 'Low Voltage — Precaution Advisory',
    summary: 'Low or fluctuating voltage can silently damage motors and compressors over time.',
    actions: [
      'Unplug motor-driven appliances (refrigerator, AC, washing machine) until voltage stabilises.',
      'Use a voltage stabiliser/UPS for sensitive electronics.',
      'Measure voltage with a multimeter if available and note the readings.',
      'Report the time and frequency of fluctuations in your complaint description.',
    ],
    doNots: [
      'Do NOT run air conditioners or pumps during severe low-voltage periods.',
    ],
    hotlines: [
      { label: 'DESCO Helpline', number: '16611' },
    ],
  },

  // ─── WASA ────────────────────────────────────────────────────────────────
  WASA_CONTAMINATION: {
    severity: 'critical',
    icon: '☣️',
    title: 'CRITICAL — Water Contamination',
    summary: 'Contaminated water poses serious health risks including cholera, typhoid, and hepatitis.',
    actions: [
      'Stop using tap water for drinking, cooking, or brushing teeth immediately.',
      'Use sealed bottled water until the issue is confirmed resolved.',
      'If you have already consumed the water and feel ill, seek medical attention.',
      'Alert neighbours in your building/area to stop using tap water.',
    ],
    doNots: [
      'Do NOT boil heavily contaminated water for drinking (boiling does not remove chemical contamination).',
      'Do NOT use contaminated water for washing open wounds.',
    ],
    hotlines: [
      { label: 'WASA Helpline', number: '16162' },
      { label: 'National Emergency', number: '999' },
    ],
  },

  WASA_PIPE_BURST: {
    severity: 'critical',
    icon: '💧',
    title: 'URGENT — Pipe Burst / Major Leakage',
    summary: 'A burst pipe can cause structural damage, flooding, and road accidents. Act quickly.',
    actions: [
      'Turn off your building\'s main water valve to reduce water flow.',
      'Keep pedestrians and vehicles away from the flooded area.',
      'Do not attempt DIY repair on municipal pipes.',
      'Alert WASA emergency team immediately with your exact location.',
    ],
    doNots: [
      'Do NOT drive into flooded roads — hidden manholes and sinkholes are a risk.',
      'Do NOT attempt to plug or block a burst main pipe.',
    ],
    hotlines: [
      { label: 'WASA Emergency', number: '16162' },
      { label: 'National Emergency', number: '999' },
    ],
  },

  WASA_NO_SUPPLY: {
    severity: 'warning',
    icon: '🚱',
    title: 'No Water Supply — Advisory',
    summary: 'Water supply has been interrupted. Plan your usage until restored.',
    actions: [
      'Store water in clean, covered containers for essential use.',
      'Prioritise water for drinking and cooking.',
      'Check if WASA has announced any scheduled maintenance in your area.',
    ],
    doNots: [
      'Do NOT use stored water beyond 24 hours without re-purification.',
    ],
    hotlines: [
      { label: 'WASA Helpline', number: '16162' },
    ],
  },

  WASA_LOW_PRESSURE: {
    severity: 'info',
    icon: '🔽',
    title: 'Low Water Pressure — Advisory',
    summary: 'Low pressure may indicate blockage, a nearby leak, or supply reduction.',
    actions: [
      'Check if all taps on all floors are similarly affected.',
      'Check if the roof tank is empty — may need pump inspection.',
      'Report the floors/taps most affected in your complaint description.',
    ],
    doNots: [
      'Do NOT increase pump speed without consulting a plumber — it can damage the pump.',
    ],
    hotlines: [
      { label: 'WASA Helpline', number: '16162' },
    ],
  },

  WASA_BILL_OVERCHARGE: {
    severity: 'info',
    icon: '🧾',
    title: 'Water Billing Dispute — Advisory',
    summary: 'Unexpected high water bills can result from meter errors or hidden leaks.',
    actions: [
      'Check all taps and toilets for silent leaks (running toilet can waste 200L/day).',
      'Record your water meter reading and compare with the billed units.',
      'Collect the last 3 months of bills as evidence.',
      'Submit complaint with account number and meter details.',
    ],
    doNots: [
      'Do NOT ignore the bill — unpaid disputed bills can lead to service disconnection.',
    ],
    hotlines: [
      { label: 'WASA Helpline', number: '16162' },
    ],
  },

  WASA_FLOODING: {
    severity: 'critical',
    icon: '🌊',
    title: 'URGENT — Road Flooding from Water Pipe',
    summary: 'Flooding from a burst main can destabilise roads and create electrocution hazards.',
    actions: [
      'Avoid walking or driving through the flooded area.',
      'Warn others to stay away — submerged manholes are invisible.',
      'Stay at least 5 metres away from flooded areas near electrical infrastructure.',
      'Contact WASA emergency and local municipality immediately.',
    ],
    doNots: [
      'Do NOT let children play in flooded water from pipes.',
      'Do NOT touch any electrical fittings near the flooded area.',
    ],
    hotlines: [
      { label: 'WASA Emergency', number: '16162' },
      { label: 'National Emergency', number: '999' },
    ],
  },

  // ─── TITAS ───────────────────────────────────────────────────────────────
  TITAS_GAS_LEAK: {
    severity: 'critical',
    icon: '🔴',
    title: 'CRITICAL — Gas Leak Detected',
    summary: 'Natural gas is highly flammable and asphyxiating. A single spark can cause an explosion. EVACUATE IMMEDIATELY.',
    actions: [
      '🚨 EVACUATE THE BUILDING NOW — do not wait.',
      'Turn off the main gas valve at the meter (if safe and accessible).',
      'Leave doors and windows open as you exit to ventilate the area.',
      'Do NOT use any electrical switches, lighters, or phones inside the building.',
      'Call TITAS emergency and fire service from outside the building.',
      'Do NOT re-enter until TITAS officials confirm the area is safe.',
    ],
    doNots: [
      '🚫 Do NOT switch any lights or electrical devices on or off.',
      '🚫 Do NOT use a mobile phone inside the gas-filled area.',
      '🚫 Do NOT use elevators — use stairs only.',
      '🚫 Do NOT smoke or use any open flame.',
    ],
    hotlines: [
      { label: 'TITAS Gas Emergency', number: '16652' },
      { label: 'Fire Service', number: '102' },
      { label: 'National Emergency', number: '999' },
    ],
  },

  TITAS_LOW_PRESSURE: {
    severity: 'warning',
    icon: '🔥',
    title: 'Low Gas Pressure — Advisory',
    summary: 'Low gas pressure can cause burners to produce incomplete combustion and carbon monoxide.',
    actions: [
      'Ensure all burners are fully turned off when not in use.',
      'Ventilate your kitchen — open windows while cooking.',
      'If you smell gas even with burners off, treat it as a gas leak.',
    ],
    doNots: [
      'Do NOT leave burners running unattended during low pressure.',
      'Do NOT use a gas oven in an enclosed space without ventilation.',
    ],
    hotlines: [
      { label: 'TITAS Helpline', number: '16652' },
    ],
  },

  TITAS_NO_SUPPLY: {
    severity: 'warning',
    icon: '⛽',
    title: 'No Gas Supply — Advisory',
    summary: 'Gas supply has been interrupted. Use alternative cooking methods safely.',
    actions: [
      'Fully close all burner valves and the main meter valve.',
      'Use an electric induction cooker or bottled LPG as a temporary alternative.',
      'Check if TITAS has announced any scheduled maintenance.',
      'When gas supply resumes, slowly open valves and check for leaks before lighting.',
    ],
    doNots: [
      'Do NOT leave gas valves open while supply is cut — gas will flow uncontrolled when restored.',
    ],
    hotlines: [
      { label: 'TITAS Helpline', number: '16652' },
    ],
  },

  TITAS_METER_FAULT: {
    severity: 'info',
    icon: '📋',
    title: 'Gas Meter Fault — Advisory',
    summary: 'A faulty meter may be miscounting gas units. Document evidence before filing.',
    actions: [
      'Photograph the meter display clearly with the date visible.',
      'Note the meter serial number from the unit or bill.',
      'Do not tamper with the meter seals under any circumstances.',
      'Submit this complaint with meter number, account number, and photos.',
    ],
    doNots: [
      'Do NOT break meter seals — it is illegal and voids your dispute rights.',
      'Do NOT attempt to reset or repair the meter.',
    ],
    hotlines: [
      { label: 'TITAS Helpline', number: '16652' },
    ],
  },

  TITAS_BILL_OVERCHARGE: {
    severity: 'info',
    icon: '🧾',
    title: 'Gas Billing Dispute — Advisory',
    summary: 'Overcharging may result from meter errors or estimated billing. Follow these steps.',
    actions: [
      'Compare the last 3 months of bills for sudden spikes.',
      'Record current meter reading and compare with the billed units.',
      'File complaint with account number, meter number, and bill copies.',
      'Request that TITAS conduct a meter accuracy test.',
    ],
    doNots: [
      'Do NOT disconnect your meter to avoid payment — it is illegal.',
    ],
    hotlines: [
      { label: 'TITAS Helpline', number: '16652' },
    ],
  },
};
