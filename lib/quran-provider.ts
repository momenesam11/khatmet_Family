type QuranVerse = { key: string; text: string };

interface QuranPageProvider {
  getPageVerses(pageNumber: number): Promise<QuranVerse[]>;
}

class QuranComProvider implements QuranPageProvider {
  async getPageVerses(pageNumber: number): Promise<QuranVerse[]> {
    const res = await fetch(
      `https://api.quran.com/api/v4/quran/verses/by_page?page_number=${pageNumber}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) throw new Error("Failed to fetch quran page");
    const data = await res.json();
    return data.verses.map(
      (v: { verse_key: string; text_uthmani: string }) => ({
        key: v.verse_key,
        text: v.text_uthmani,
      })
    );
  }
}

export const defaultQuranProvider: QuranPageProvider = new QuranComProvider();
export type { QuranPageProvider, QuranVerse };
