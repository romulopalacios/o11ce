// Rankings aproximados FIFA/ELO para el Mundial 2026

export const TEAM_ELO_RATINGS: Record<string, number> = {
  // Top Tier
  "FRA": 1877, // Francia
  "ESP": 1876, // España
  "ARG": 1875, // Argentina
  "ENG": 1826, // Inglaterra
  "POR": 1764, // Portugal
  "BRA": 1761, // Brasil
  "NED": 1758, // Países Bajos
  "MAR": 1756, // Marruecos
  "BEL": 1735, // Bélgica
  "GER": 1730, // Alemania
  "CRO": 1717, // Croacia

  // Mid Tier
  "COL": 1693, // Colombia
  "SEN": 1689, // Senegal
  "MEX": 1681, // México
  "USA": 1673, // EEUU
  "URU": 1673, // Uruguay
  "JPN": 1660, // Japón
  "SUI": 1649, // Suiza
  "IRN": 1615, // RI de Irán
  "TUR": 1599, // Turquía
  "ECU": 1595, // Ecuador
  "AUT": 1593, // Austria
  "KOR": 1589, // República de Corea
  "AUS": 1581, // Australia

  // Lower Mid Tier
  "ALG": 1564, // Argelia
  "EGY": 1563, // Egipto
  "CAN": 1556, // Canadá
  "NOR": 1551, // Noruega
  "PAN": 1541, // Panamá
  "CIV": 1533, // Costa de Marfil
  "SWE": 1515, // Suecia
  "PAR": 1504, // Paraguay
  "CZE": 1501, // República Checa
  "SCO": 1498, // Escocia
  "TUN": 1483, // Túnez
  "COD": 1478, // RD del Congo
  "UZB": 1465, // Uzbekistán
  "QAT": 1455, // Qatar
  "IRQ": 1447, // Irak
  "RSA": 1430, // Sudáfrica
  "KSA": 1421, // Arabia Saudí

  // Lower Tier
  "JOR": 1391, // Jordania
  "BIH": 1386, // Bosnia y Herzegovina
  "CPV": 1366, // Cabo Verde
  "GHA": 1346, // Ghana
  "CUR": 1295, // Curazao
  "HAI": 1292, // Haití
  "NZL": 1282, // Nueva Zelanda
  "ITA": 1960, // Italia (Keep existing to avoid breaking, using old value)
  "DEN": 1800, // Dinamarca (Keep existing)
  "SRB": 1750, // Serbia (Keep existing)
  "PER": 1730, // Peru (Keep existing)
  "POL": 1710, // Polonia (Keep existing)
  "WAL": 1690, // Gales (Keep existing)
  "UKR": 1680, // Ucrania (Keep existing)
  "CHI": 1650, // Chile (Keep existing)
  "VEN": 1640, // Venezuela (Keep existing)
  "CMR": 1630, // Camerun (Keep existing)
  "CRI": 1600, // Costa Rica (Keep existing)

  // Default fallback for unknown teams
  "DEFAULT": 1500,
};

export function getEloRating(tla?: string | null): number {
  if (!tla) return TEAM_ELO_RATINGS["DEFAULT"];
  return TEAM_ELO_RATINGS[tla] ?? TEAM_ELO_RATINGS["DEFAULT"];
}
