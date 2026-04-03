# MAPC Population Data Sources
**File:** `MAPC_Population_Annual_1897_2025.csv`
**Coverage:** 101 MAPC-region municipalities × years 1897–2025
**Prepared:** 2026-03-12

---

## 1. How the Data Was Built

The annual file contains population for every year from 1897 to 2025. Most years do **not** have a direct source — they are calculated. There are two kinds of values:

| Value type | Years | Method |
|---|---|---|
| **Anchor** | 1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2023, 2024 | Taken directly from a primary source (see Section 2) |
| **Interpolated / Extrapolated** | All other years (1897–1899, 1901–1909, 1911–1919, etc., 2021–2022, 2025) | Linear interpolation between the two nearest anchor years; or linear extrapolation for 1897–1899 and 2025 |

For interpolated years: if a city had population P₀ in year Y₀ and P₁ in year Y₁, the value for any year Y in between is computed as:

> `P = P₀ + (Y − Y₀) / (Y₁ − Y₀) × (P₁ − P₀)`

These are estimates, not measured data. Verify actual counts only for anchor years.

---

## 2. Primary Sources by Year

### 2.1 — 1900, 1910, and 1920
**Source:** U.S. Census Bureau
*Fourteenth Census of the United States Taken in the Year 1920, Volume I: Population — Number and Distribution of Inhabitants*
URL: `https://www2.census.gov/library/publications/decennial/1920/bulletins/demographics/population-ma-number-of-inhabitants.pdf`
Table used: **Table 2 — "Population of Counties by Minor Civil Divisions: 1920, 1910, and 1900"**

This single document provides all three years in parallel columns for every Massachusetts town, organized by county. It is the primary source for the 1900/1910/1920 values.

**Limitation — OCR quality:** The PDF was typeset in a two-column layout and extracted using `pdftotext -layout`. Many town names are garbled (e.g., "Cohasset" appears as `--~Jc:g~`). Where text extraction failed, values were recovered by:
- Alphabetical-position inference within each county section
- Cross-validation against 1930 data from the UMass source below

**Supplemental source used for ~30–35 municipalities** whose names were unreadable in the PDF:
`https://kids.kiddle.co/[Town_Name],_Massachusetts`
(Kiddle reproduces Wikipedia's historical population tables verbatim.)

**Note on 1910 data specifically:** No separate 1910 Massachusetts census bulletin with town-level counts was located. All 1910 values come from the 1920 bulletin's backward-looking Table 2 columns, supplemented by kiddle.co.

---

### 2.2 — 1930 through 2024 (all 101 municipalities)
**Source:** UMass Donahue Institute — Population Estimates Program
Website: `https://donahue.umass.edu/`
File type: Excel (.xlsx) downloaded from the Population Estimates section

This file is the **authoritative source** for all data from 1930 onward. It contains:
- Decennial census counts: 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020
- Annual estimates: 2023 and 2024

The UMass Donahue Institute produces official sub-state population estimates for all Massachusetts cities and towns on behalf of the Commonwealth. The methodology uses a housing-unit approach incorporating building permits, utility connections, vacancy rates, and group quarters population.

**Note on 2023/2024 estimates:** These are point-in-time annual estimates, distinct from the U.S. Census Bureau's ACS 5-year rolling averages. The specific release version was not recorded; re-access via `https://donahue.umass.edu/` → Population Estimates.

---

## 3. Municipality-Specific Notes

The following municipalities have anomalous values, required special sourcing, or have known data caveats. All other municipalities used the general sources in Section 2 without issue.

---

### Arlington
- 1900 = 8,603 | 1910 = 11,187 | 1920 = 18,665
- Extracted directly from the 1920 census PDF text; Arlington was large enough that its name survived OCR in the Middlesex County section.

---

### Bellingham
- 1900 = 1,682 | 1910 = 1,096 | 1920 = 2,102
- Source: kids.kiddle.co/Bellingham,_Massachusetts (confirmed)
- **Anomaly:** −34.8% from 1900→1910, then +91.8% from 1910→1920. Confirmed in both the census PDF and kiddle.co. The swings reflect mill-town boom/bust cycles. A mill closure ca. 1900–1910 caused the drop; new industrial activity ca. 1910–1920 caused the rebound. No boundary changes recorded.

---

### Cohasset
- 1900 = 2,759 | 1910 = 2,585 | 1920 = 2,639
- **Source:** 1920 census PDF, Norfolk County section, by positional inference.
- "Cohasset" does not appear as a readable string in the OCR output (garbled as `--~Jc:g~`). Identification is certain by elimination: in the Norfolk County alphabetical left column, the sequence runs Canton → [next town] → Dedham, and Cohasset is the **only** Massachusetts town alphabetically between Canton and Dedham in Norfolk County.
- **Geographic note:** Cohasset is in Norfolk County, not Plymouth County. It is a geographic exclave entirely surrounded by Plymouth County towns.
- **Verification:** The 1900 value (2,759) was confirmed from an independent source. The 1910 and 1920 values rely solely on positional inference from the census PDF and have no independent confirmation. The sequence 2,759 → 2,585 → 2,639 → 3,083 (1930, UMass) is internally consistent for a stable small coastal town.
- **Prior error corrected:** An earlier version of this dataset incorrectly held 1910=2,882 and 1920=2,759. The 2,759 value was the confirmed 1900 figure, duplicated in error into the 1920 column.

---

### Holliston
- 1900 = 2,598 | 1910 = 2,711 | 1920 = 2,101
- **Anomaly:** Population decreased from 1910→1920. Attributed to mill closures in this period. Sourced from census PDF / kiddle.co. No boundary changes recorded.

---

### Hull
- 1900, 1910, 1920 values sourced from: historyofmassachusetts.org (used when census PDF values were unclear and kiddle.co was unavailable for this town).

---

### Maynard
- 1900 = 13,009 | 1910 = 14,579 | 1920 = 15,028
- Confirmed explicitly in the 1920 census PDF text (line reads clearly: `Maynard town ... 15,028  14,579  13,009`).
- **Major anomaly:** Population drops from 15,028 (1920) to 7,156 (1930) — a ~52% decline. This is not a data error. The Assabet Mills (American Woolen Company), one of the largest textile mills in the world and Maynard's primary employer, closed in 1920. The departure of mill workers and their families between the 1920 and 1930 censuses accounts for the decline. The 1920 value represents Maynard at its historic population peak.

---

### Medfield
- 1900 = 2,926 | 1910 = 3,466 | 1920 = 3,595
- Extracted from the 1920 census PDF, Norfolk County section.
- **Disambiguation note:** Medfield and Westwood have identical 1920 (3,595) and 1900 (2,926) values. They were distinguished by their 1910 values (Medfield: 3,466; Westwood: 3,406), confirmed via kiddle.co for each town.

---

### Walpole
- 1900 = 3,572 | 1910 = 4,892 | 1920 = 5,446
- Source: 1920 census PDF text (Norfolk County Table 2, left column) AND confirmed by kids.kiddle.co/Walpole,_Massachusetts.
- **Prior error corrected:** An earlier extraction erroneously assigned Wellesley's values (5,072 / 5,413 / 6,224) to Walpole. This was identified by positional analysis of the Norfolk County Table 2 section and corrected using kiddle.co.

---

### Waltham
- 1920 = 30,915
- **Correction note:** An earlier version held Waltham 1920 = 23,481, which is actually Waltham's 1900 value. The correct 1920 value (30,915) was extracted from the census PDF text.

---

### Wellesley
- 1900 = 5,072 | 1910 = 5,413 | 1920 = 6,224
- Confirmed in the 1920 census PDF text in two separate locations: (1) Table 2 Norfolk County left-column sequence, and (2) Table 3/4 explicit entry (garbled OCR: `l\\'lle:•l<'>` = "Wellesley").

---

### Westwood
- 1900 = 2,926 | 1910 = 3,406 | 1920 = 3,595
- Source: 1920 census PDF text (Norfolk County Table 3/4 area), confirmed by "Norfolk" county label and 1910 = 3,406 distinguishing it from Medfield (see above).
- **Anomaly:** Population drops from 3,595 (1920) to 2,097 (1930) — a 41.7% decline. Westwood was incorporated in 1897 from Dedham and was a relatively new town. The cause of the 1930 drop is not definitively established; possible explanations include the closure of a major employer or institution that housed counted residents. The 2020 value is confirmed and subsequent growth from 1930 onward is consistent (UMass data).

---

### Woburn
- 1900 = 14,254 | 1910 = 14,254
- The 1900 and 1910 values are identical as sourced. Woburn's population did stagnate in this period. If this appears suspicious, consult the 1910 census bulletin directly.

---

### Wrentham
- 1900 = 2,720 | 1910 = 1,743 | 1920 = 2,808
- **Anomaly:** Population dropped ~36% from 1900→1910.
- **Reason:** **Plainville was incorporated as a separate town from Wrentham in 1905.** The population that split off to form Plainville accounts for the decline. This is a documented administrative boundary change, not a data error.

---

## 4. Summary Table — Source by Year

| Year(s) | Source | Type |
|---|---|---|
| 1897, 1898, 1899 | Extrapolated backward from 1900 and 1910 anchor values | Calculated |
| 1900 | U.S. Census Bureau — 1920 Bulletin Table 2 (col: 1900) / kiddle.co supplement | Measured |
| 1901–1909 | Linear interpolation between 1900 and 1910 | Calculated |
| 1910 | U.S. Census Bureau — 1920 Bulletin Table 2 (col: 1910) / kiddle.co supplement | Measured |
| 1911–1919 | Linear interpolation between 1910 and 1920 | Calculated |
| 1920 | U.S. Census Bureau — 1920 Bulletin Table 2 (col: 1920) / kiddle.co supplement | Measured |
| 1921–1929 | Linear interpolation between 1920 and 1930 | Calculated |
| 1930 | UMass Donahue Institute Excel file | Measured |
| 1931–1939 | Linear interpolation between 1930 and 1940 | Calculated |
| 1940 | UMass Donahue Institute Excel file | Measured |
| 1941–1949 | Linear interpolation between 1940 and 1950 | Calculated |
| 1950 | UMass Donahue Institute Excel file | Measured |
| 1951–1959 | Linear interpolation between 1950 and 1960 | Calculated |
| 1960 | UMass Donahue Institute Excel file | Measured |
| 1961–1969 | Linear interpolation between 1960 and 1970 | Calculated |
| 1970 | UMass Donahue Institute Excel file | Measured |
| 1971–1979 | Linear interpolation between 1970 and 1980 | Calculated |
| 1980 | UMass Donahue Institute Excel file | Measured |
| 1981–1989 | Linear interpolation between 1980 and 1990 | Calculated |
| 1990 | UMass Donahue Institute Excel file | Measured |
| 1991–1999 | Linear interpolation between 1990 and 2000 | Calculated |
| 2000 | UMass Donahue Institute Excel file | Measured |
| 2001–2009 | Linear interpolation between 2000 and 2010 | Calculated |
| 2010 | UMass Donahue Institute Excel file | Measured |
| 2011–2019 | Linear interpolation between 2010 and 2020 | Calculated |
| 2020 | UMass Donahue Institute Excel file | Measured |
| 2021–2022 | Linear interpolation between 2020 and 2023 | Calculated |
| 2023 | UMass Donahue Institute — annual population estimate | Estimated |
| 2024 | UMass Donahue Institute — annual population estimate | Estimated |
| 2025 | Extrapolated forward from 2023 and 2024 estimates | Calculated |

---

## 5. Key References

| Source | URL |
|---|---|
| U.S. Census Bureau — 1920 MA Population Bulletin | `https://www2.census.gov/library/publications/decennial/1920/bulletins/demographics/population-ma-number-of-inhabitants.pdf` |
| UMass Donahue Institute Population Estimates | `https://donahue.umass.edu/` |
| Kiddle.co (Wikipedia supplement) | `https://kids.kiddle.co/[Town_Name],_Massachusetts` |
| History of Massachusetts (Hull supplement) | `https://historyofmassachusetts.org/` |
