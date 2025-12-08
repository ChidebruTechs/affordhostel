// Universities and Towns data extracted from CSV
export interface UniversityData {
  name: string;
  town: string;
}

export const universitiesData: UniversityData[] = [
  { name: "Adventist University of Africa", town: "Nairobi" },
  { name: "Africa International University", town: "Nairobi" },
  { name: "Africa Nazarene University", town: "Nairobi" },
  { name: "Alupe University", town: "Busia" },
  { name: "Amref International University", town: "Nairobi" },
  { name: "Chuka University", town: "Chuka" },
  { name: "Daystar University", town: "Nairobi" },
  { name: "Dedan Kimathi University of Technology", town: "Nyeri" },
  { name: "Egerton University", town: "Njoro" },
  { name: "Garissa University", town: "Garissa" },
  { name: "Great Lakes University of Kisumu", town: "Kisumu" },
  { name: "GRETSA University", town: "Thika" },
  { name: "Islamic University of Kenya", town: "Kisaju" },
  { name: "Jaramogi Oginga Odinga University of Science and Technology", town: "Bondo" },
  { name: "Jomo Kenyatta University of Agriculture and Technology", town: "Nairobi" },
  { name: "Kabarak University", town: "Nakuru" },
  { name: "KAG East University", town: "Nairobi" },
  { name: "Kaimosi Friends University", town: "Kaimosi" },
  { name: "Karatina University", town: "Karatina" },
  { name: "KCA University", town: "Nairobi" },
  { name: "Kenya Highlands University", town: "Kericho" },
  { name: "Kenya Methodist University", town: "Meru" },
  { name: "Kenyatta University", town: "Nairobi" },
  { name: "Kibabii University", town: "Bungoma" },
  { name: "Kirinyaga University", town: "Kerugoya" },
  { name: "Kisii University", town: "Kisii" },
  { name: "Laikipia University", town: "Nyahururu" },
  { name: "Lukenya University", town: "Kambu" },
  { name: "Maasai Mara University", town: "Narok" },
  { name: "Machakos University", town: "Machakos" },
  { name: "Management University of Africa", town: "Nairobi" },
  { name: "Maseno University", town: "Maseno" },
  { name: "Masinde Muliro University of Science and Technology", town: "Kakamega" },
  { name: "Meru University of Science and Technology", town: "Meru" },
  { name: "Moi University", town: "Eldoret" },
  { name: "Mount Kenya University", town: "Thika" },
  { name: "Multimedia University of Kenya", town: "Nairobi" },
  { name: "Murang'a University of Technology", town: "Murang'a" },
  { name: "Pan Africa Christian University", town: "Nairobi" },
  { name: "Pioneer International University", town: "Nairobi" },
  { name: "Pwani University", town: "Kilifi" },
  { name: "Riara University", town: "Nairobi" },
  { name: "Rongo University", town: "Rongo" },
  { name: "Scott Christian University", town: "Machakos" },
  { name: "South Eastern Kenya University", town: "Kitui" },
  { name: "St. Paul's University", town: "Limuru" },
  { name: "Strathmore University", town: "Nairobi" },
  { name: "Taita Taveta University", town: "Voi" },
  { name: "Tangaza University", town: "Nairobi" },
  { name: "Technical University of Kenya", town: "Nairobi" },
  { name: "Technical University of Mombasa", town: "Mombasa" },
  { name: "Tharaka University", town: "Marimanti" },
  { name: "The Catholic University of Eastern Africa", town: "Nairobi" },
  { name: "The Co-operative University of Kenya", town: "Nairobi" },
  { name: "The East African University", town: "Nairobi" },
  { name: "The Presbyterian University of East Africa", town: "Kikuyu" },
  { name: "Tom Mboya University", town: "Homa Bay" },
  { name: "Umma University", town: "Kajiado" },
  { name: "United States International University Africa", town: "Nairobi" },
  { name: "University of Eldoret", town: "Eldoret" },
  { name: "University of Embu", town: "Embu" },
  { name: "University of Kabianga", town: "Kericho" },
  { name: "University of Nairobi", town: "Nairobi" },
  { name: "Uzima University", town: "Kisumu" },
  { name: "Zetech University", town: "Ruiru" }
];

// Extract unique universities and towns for filtering
export const universities = universitiesData
  .map(uni => uni.name)
  .sort();

export const towns = [...new Set(universitiesData.map(uni => uni.town))]
  .sort();

// Helper function to get town by university name
export const getTownByUniversity = (universityName: string): string | undefined => {
  const university = universitiesData.find(uni => uni.name === universityName);
  return university?.town;
};

// Helper function to get universities by town
export const getUniversitiesByTown = (townName: string): string[] => {
  return universitiesData
    .filter(uni => uni.town === townName)
    .map(uni => uni.name)
    .sort();
};

// Major towns/cities for quick reference
export const majorTowns = [
  "Nairobi",
  "Mombasa", 
  "Kisumu",
  "Nakuru",
  "Eldoret",
  "Thika",
  "Machakos",
  "Meru",
  "Nyeri",
  "Kakamega"
].sort();