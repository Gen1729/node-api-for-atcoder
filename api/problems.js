export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const response = await fetch('https://kenkoooo.com/atcoder/resources/problem-models.json');
      
      if (!response.ok) {
        return res.status(response.status).json({ 
          error: 'Failed to fetch problem models',
          status: response.status 
        });
      }

      const problemModels = await response.json();
      
      return res.status(200).json({
        success: true,
        data: problemModels,
        count: Object.keys(problemModels).length
      });
    } catch (error) {
      console.error('Error fetching problem models:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
