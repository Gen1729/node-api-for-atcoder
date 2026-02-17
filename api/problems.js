export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    //クエリパラメータを取得
    const { contest, min, max, problem } = req.query;

    const contestType = contest ? contest.toLowerCase() : 'all';
    // コンテストタイプのバリデーション
    const validContestTypes = ['abc', 'arc', 'agc', 'all'];
    
    if (!validContestTypes.includes(contestType)) {
      return res.status(400).json({ 
        error: 'Invalid contest type',
        message: 'Contest type must be one of: abc, arc, agc, all'
      });
    }

    const problemType = problem ? problem.toLowerCase() : 'all';
    // 問題タイプのバリデーション
    const validProblemTypes = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'all'];
    
    if (!validProblemTypes.includes(problemType)) {
      return res.status(400).json({ 
        error: 'Invalid problem type',
        message: 'Problem type must be one of: a, b, c, d, e, f, g, h, all'
      });
    }

    // 難易度のバリデーション
    const minDifficulty = min ? parseFloat(min) : -10000;
    const maxDifficulty = max ? parseFloat(max) : 10000;

    if (isNaN(minDifficulty)) {
      return res.status(400).json({ error: 'Invalid min difficulty value' });
    }
    if (isNaN(maxDifficulty)) {
      return res.status(400).json({ error: 'Invalid max difficulty value' });
    }

    // データ取得
    const response = await fetch('https://kenkoooo.com/atcoder/resources/problem-models.json');
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: 'Failed to fetch problem models',
        status: response.status 
      });
    }

    const problemModels = await response.json();

    // フィルタリング
    let filteredProblems = {};
    
    for (const [problemId, model] of Object.entries(problemModels)) {
      // コンテストタイプでフィルタリング（問題IDに含まれるかチェック）
      let matchesContest = false;
      if (type === 'all') {
        matchesContest = true;
      } else {
        matchesContest = problemId.toLowerCase().includes(type);
      }

      if (!matchesContest) continue;

      let matchesProblem = false;
      if (problemType === 'all') {
        matchesProblem = true;
      } else {
        matchesProblem = problemId.toLowerCase()[problemId.length - 1] === problemType;
      }

      if (!matchesProblem) continue;

      // 難易度でフィルタリング
      const difficulty = model.difficulty;
      if (difficulty === null || difficulty === undefined) continue;

      if (difficulty < minDifficulty || difficulty > maxDifficulty) continue;

      filteredProblems[problemId] = model;
    }

    return res.status(200).json({
      success: true,
      contestType: type,
      filters: {
        minDifficulty,
        maxDifficulty
      },
      data: filteredProblems,
      count: Object.keys(filteredProblems).length
    });

  } catch (error) {
    console.error('Error fetching problem models:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
