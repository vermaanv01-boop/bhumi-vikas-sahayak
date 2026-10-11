import { DEMO_RESPONSES } from '../data/demoData';

/**
 * Assistant Service for Bhumi Vikas Sahayak.
 * Single integration boundary for statutory question querying.
 *
 * Future integration:
 * This will invoke `fetch('/api/ask', { method: 'POST', body: JSON.stringify(...) })`
 * to connect to the Express RAG backend.
 *
 * @param {Object} params
 * @param {string} params.question - The natural language query from user
 * @param {string} [params.language='en'] - 'en' or 'hi'
 * @param {string} [params.location='bhopal'] - Selected municipal/planning jurisdiction
 * @returns {Promise<{
 *   question: string,
 *   answer: string,
 *   language: string,
 *   status: 'answered' | 'insufficient_evidence' | 'error',
 *   sources: Array<{
 *     ruleNumber: string,
 *     title: string,
 *     sourceText: string,
 *     pageStart: number,
 *     pageEnd: number,
 *     documentName: string
 *   }>
 * }>}
 */
export async function askQuestion({ question, language = 'en', location = 'bhopal' }) {
  // Simulate minimal network latency (350ms) to ensure UI loading states function properly
  await new Promise((resolve) => setTimeout(resolve, 350));

  const trimmed = (question || '').trim();

  if (!trimmed) {
    return {
      question: '',
      answer: language === 'hi' 
        ? 'कृपया प्रश्न दर्ज करें।' 
        : 'Please enter a valid query regarding building regulations.',
      language,
      status: 'error',
      sources: []
    };
  }

  const lower = trimmed.toLowerCase();

  // Pattern matching on demo queries
  if (lower.includes('setback') || lower.includes('margin') || lower.includes('open space') || lower.includes('खुले स्थान') || lower.includes('सेटबैक')) {
    const base = DEMO_RESPONSES['setback'];
    return {
      ...base,
      question: trimmed,
      language
    };
  }

  if (lower.includes('height') || lower.includes('ऊंचाई') || lower.includes('high-rise') || lower.includes('ऊंचाई सीमा')) {
    const base = DEMO_RESPONSES['height'];
    return {
      ...base,
      question: trimmed,
      language
    };
  }

  if (lower.includes('commercial') || lower.includes('व्यावसायिक') || lower.includes('business') || lower.includes('shopping')) {
    const base = DEMO_RESPONSES['commercial'];
    return {
      ...base,
      question: trimmed,
      language
    };
  }

  if (lower.includes('basement') || lower.includes('तहखाना') || lower.includes('cellar')) {
    const base = DEMO_RESPONSES['basement'];
    return {
      ...base,
      question: trimmed,
      language
    };
  }

  // Fallback: Check if generic question has keywords like FAR, parking, plot, roof, terrace
  if (lower.includes('far') || lower.includes('fsi') || lower.includes('parking') || lower.includes('plot') || lower.includes('area')) {
    return {
      question: trimmed,
      answer: language === 'hi'
        ? `म.प्र. भूमि विकास नियम, 2012 के अनुसार ${location === 'bhopal' ? 'भोपाल' : 'चयनित क्षेत्र'} में एफ.ए.आर. और पार्किंग मानक भूखंड क्षेत्रफल एवं मुख्य मार्ग की चौड़ाई के आधार पर निर्धारित होते हैं। अधिकृत गणना हेतु संबंधित नगर पालिक निगम अथवा टी.सी.पी. से संदर्भ लें।`
        : `Under the MP Bhumi Vikas Niyam, 2012, Floor Area Ratio (FAR) and mandatory off-street parking for ${location === 'bhopal' ? 'Bhopal' : 'the selected jurisdiction'} are governed by plot size and abutting road width as specified in Rule 55 and Schedule VII. Master plan zoning tables determine final sanctioned limits.`,
      language,
      status: 'answered',
      sources: [
        {
          ruleNumber: "Rule 55, Schedule VII",
          title: "FAR and Off-street Parking Standards for Planning Areas",
          sourceText: "Permissible FAR shall be calculated strictly against the certified width of the abutting public road and land use zoning in the sanctioned Master Plan.",
          pageStart: 55,
          pageEnd: 58,
          documentName: "MP_Bhumi_Vikas_Niyam_2012_Consolidated.pdf"
        }
      ]
    };
  }

  // When evidence is unavailable or does not match reference index
  return {
    question: trimmed,
    answer: language === 'hi'
      ? 'समेकित संदर्भ अनुक्रमणिका (6 मार्च 2025 तक) में इस विशिष्ट प्रश्न के लिए कोई प्रत्यक्ष नियम नहीं मिला। कृपया सेटबैक, भवन ऊंचाई, व्यावसायिक भूखंड या बेसमेंट नियमों से संबंधित प्रश्न पूछें।'
      : 'No direct statutory match was identified in the indexed consolidated rules (covering through 6 March 2025). Try asking about setbacks, permissible height, commercial plot standards, or basement provisions.',
    language,
    status: 'insufficient_evidence',
    sources: []
  };
}
