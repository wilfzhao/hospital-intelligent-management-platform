
// Dean Cockpit Mock Data extracted from DeanCockpit.tsx

export const getHourlyVisitsData = () => Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  outpatient: i > 7 && i < 18 ? Math.floor(Math.random() * 300) + 100 : Math.floor(Math.random() * 50),
  emergency: Math.floor(Math.random() * 50) + 10,
}));

export const PARETO_DATA = [
  { dept: '感染性疾病门诊', visits: 680, percentage: 10 },
  { dept: '肝胆外科门诊', visits: 500, percentage: 25 },
  { dept: '乳腺外科门诊', visits: 400, percentage: 40 },
  { dept: '针灸推拿门诊', visits: 300, percentage: 55 },
  { dept: '普通外科门诊', visits: 200, percentage: 70 },
  { dept: '心血管内科', visits: 150, percentage: 80 },
  { dept: '急诊妇科', visits: 50, percentage: 100 },
];

export const FINANCIAL_PIE_DATA = [
  { name: '临床', value: 67.6, color: '#00E5FF' },
  { name: '行政', value: 18.1, color: '#0088FE' },
  { name: '医疗辅助', value: 2.7, color: '#3B82F6' },
  { name: '医疗技术', value: 11.5, color: '#F59E0B' },
];

export const ADMISSION_TREND_DATA = [
  { date: '2023\\06\\15', admission: 30, discharge: 25 },
  { date: '2023\\06\\17', admission: 40, discharge: 35 },
  { date: '2023\\06\\19', admission: 75, discharge: 70 },
  { date: '2023\\06\\21', admission: 35, discharge: 40 },
  { date: '2023\\06\\23', admission: 80, discharge: 60 },
  { date: '2023\\06\\25', admission: 70, discharge: 75 },
];

export const getScatterData = () => {
  const data = Array.from({ length: 30 }, () => ({
    x: Math.floor(Math.random() * 8000),
    y: Math.floor(Math.random() * 1000),
  }));
  data.push({ x: 22000, y: 400 }); // Outlier
  data.push({ x: 100, y: 2800 }); // Outlier
  data.push({ x: 100, y: 2200 }); // Outlier
  data.push({ x: 100, y: 1800 }); // Outlier
  return data;
};

export const OUTPATIENT_MODAL_DATA = [
  { doctor: '王爱民', total: 20, outpatient: 3, emergency: 6, green: 23, blue: 15, orange: 10 },
  { doctor: '张瑞娟', total: 55, outpatient: 4, emergency: 8, green: 26, blue: 18, orange: 13 },
  { doctor: '曾冠全', total: 55, outpatient: 4, emergency: 8, green: 29, blue: 20, orange: 15 },
  { doctor: '王茂才', total: 55, outpatient: 4, emergency: 8, green: 27, blue: 18, orange: 12 },
  { doctor: '王东', total: 55, outpatient: 4, emergency: 8, green: 24, blue: 16, orange: 11 },
  { doctor: '甄娟', total: 55, outpatient: 4, emergency: 8, green: 27, blue: 19, orange: 14 },
  { doctor: '方子玉', total: 55, outpatient: 4, emergency: 8, green: 30, blue: 21, orange: 16 },
  { doctor: '林淑敏', total: 55, outpatient: 4, emergency: 8, green: 31, blue: 22, orange: 17 },
  { doctor: '陆科鸿', total: 55, outpatient: 4, emergency: 8, green: 35, blue: 27, orange: 22 },
  { doctor: '张关', total: 55, outpatient: 4, emergency: 8, green: 40, blue: 32, orange: 27 },
  { doctor: '王大伟', total: 55, outpatient: 4, emergency: 8, green: 34, blue: 26, orange: 20 },
];
