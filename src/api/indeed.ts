import axios from 'axios';

const SCRAPE_API_URL = 'https://www.indeed.com/jobs';

export const scrapeIndeed = async (role: string, location: string | undefined) => {
  const searchParams = new URLSearchParams({
    q: role,
    l: location || '',
  });

  const url = `${SCRAPE_API_URL}?${searchParams.toString()}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error in scrapeIndeed:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up the request:', error.message);
    }
    throw new Error(`Failed to scrape Indeed: ${error.message}`);
  }
};
