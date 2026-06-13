// Site-wide scripts: nav toggles, theme, small helpers
document.documentElement.classList.add('js-enabled');

window.normalizeTech = raw => String(raw||'')
  .trim()
  .toLowerCase()
  .replace(/\(.*?\)/g, '')
  .replace(/[^a-z0-9 ]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

window.TECH_MAP = {
  'python': {
    label: '🐍 Python',
    style: 'background: linear-gradient(90deg,#306998,#ffd43b); color:#061226; border-color:rgba(255,255,255,0.06);'
  },
  'snowflake': {
    label: '❄️ Snowflake',
    style: 'background: linear-gradient(90deg,#1fb6ff,#60e0ff); color:#062033; border-color:rgba(255,255,255,0.06);'
  },
  'tableau': {
    label: '📊 Tableau',
    style: 'background: linear-gradient(90deg,#2b79c6,#f5a623); color:#07122a; border-color:rgba(255,255,255,0.06);'
  },
  'salesforce': {
    label: '☁️ Salesforce',
    style: 'background: linear-gradient(90deg,#00a1e0,#0aa1d6); color:#061226; border-color:rgba(255,255,255,0.06);'
  },
  'tableau crm': {
    label: '📈 Tableau CRM',
    style: 'background: linear-gradient(90deg,#3b82f6,#06b6d4); color:#061226; border-color:rgba(255,255,255,0.06);'
  },
  'sap bods': {
    label: '🏢 SAP BODS',
    style: 'background: linear-gradient(90deg,#0ea5a9,#10b981); color:#061226; border-color:rgba(255,255,255,0.06);'
  },
  'sap hana': {
    label: '🧩 SAP HANA',
    style: 'background: linear-gradient(90deg,#7c3aed,#06b6d4); color:#fff; border-color:rgba(255,255,255,0.06);'
  },
  'sap lumira': {
    label: '📈 Lumira',
    style: 'background: linear-gradient(90deg,#f97316,#f59e0b); color:#061226; border-color:rgba(255,255,255,0.06);'
  },
  'lumira': {
    label: '📈 Lumira',
    style: 'background: linear-gradient(90deg,#f97316,#f59e0b); color:#061226; border-color:rgba(255,255,255,0.06);'
  },
  'power bi': {
    label: '📈 Power BI',
    style: 'background: linear-gradient(90deg,#047857,#8b5cf6); color:#fff; border-color:rgba(255,255,255,0.06);'
  },
  'aws': {
    label: '☁️ AWS',
    style: 'background: linear-gradient(90deg,#ff9900,#ffb347); color:#061226; border-color:rgba(255,255,255,0.06);'
  },
  'aws s3 ec2': {
    label: '☁️ AWS',
    style: 'background: linear-gradient(90deg,#ff9900,#ffb347); color:#061226; border-color:rgba(255,255,255,0.06);'
  },
  'informatica': {
    label: '🔄 Informatica',
    style: 'background: linear-gradient(90deg,#6b7280,#0f172a); color:#fff; border-color:rgba(255,255,255,0.06);'
  },
  'sql': {
    label: '🔎 SQL',
    style: 'background: linear-gradient(90deg,#0f172a,#1e40af); color:#fff; border-color:rgba(255,255,255,0.06);'
  },
  'ms sql server': {
    label: '🗄️ MS SQL Server',
    style: 'background: linear-gradient(90deg,#005184,#00b4ff); color:#fff; border-color:rgba(255,255,255,0.06);'
  },
  'excel': {
    label: '📈 Excel',
    style: 'background: linear-gradient(90deg,#107c10,#5cd65c); color:#061226; border-color:rgba(255,255,255,0.06);'
  },
  'apex': {
    label: '⚡ Apex',
    style: 'background: linear-gradient(90deg,#0f172a,#1d4ed8); color:#fff; border-color:rgba(255,255,255,0.06);'
  },
  'flow builder': {
    label: '⚡ Flow Builder',
    style: 'background: linear-gradient(90deg,#2563eb,#38bdf8); color:#fff; border-color:rgba(255,255,255,0.06);'
  },
  'soql sosl': {
    label: '🧠 SOQL/SOSL',
    style: 'background: linear-gradient(90deg,#9333ea,#c084fc); color:#fff; border-color:rgba(255,255,255,0.06);'
  },
  'salesforce lightning': {
    label: '⚡ Salesforce Lightning',
    style: 'background: linear-gradient(90deg,#0f172a,#2563eb); color:#fff; border-color:rgba(255,255,255,0.06);'
  },
  'graduate coursework': {
    label: '🎓 Graduate Coursework',
    style: 'background: linear-gradient(90deg,#0f172a,#475569); color:#fff; border-color:rgba(255,255,255,0.06);'
  },
  'undergraduate coursework': {
    label: '🎓 Undergraduate Coursework',
    style: 'background: linear-gradient(90deg,#111827,#334155); color:#fff; border-color:rgba(255,255,255,0.06);'
  },
  'fork': {
    label: '🍴 Fork',
    style: 'background: linear-gradient(90deg,#4b5563,#111827); color:#fff; border-color:rgba(255,255,255,0.06);'
  }
};

window.findBadgeEntry = raw => {
  const normalized = normalizeTech(raw);
  if (TECH_MAP[normalized]) return TECH_MAP[normalized];
  const parts = normalized.split(' ').filter(Boolean);
  for (let len = Math.min(3, parts.length); len > 0; len--) {
    const candidate = parts.slice(0, len).join(' ');
    if (TECH_MAP[candidate]) return TECH_MAP[candidate];
  }
  return null;
};

window.findBadgeLabel = raw => {
  const entry = findBadgeEntry(raw);
  return entry ? entry.label : raw;
};

window.findBadgeStyle = raw => {
  const entry = findBadgeEntry(raw);
  return entry ? entry.style : '';
};

window.makeBadges = arr => (arr||[]).filter(Boolean).map(raw => {
  const label = findBadgeLabel(raw);
  const style = findBadgeStyle(raw);
  return `<span class="badge"${style ? ` style="${style}"` : ''}>${label}</span>`;
}).join('');