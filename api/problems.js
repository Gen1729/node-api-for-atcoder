export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    //クエリパラメータを取得
    const { contest, min, max, problem, limit, random } = req.query;

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

    // limitのバリデーション
    const limitCount = limit ? parseInt(limit, 10) : null;
    if (limitCount !== null && (isNaN(limitCount) || limitCount <= 0)) {
      return res.status(400).json({ error: 'Invalid limit value. Must be a positive integer.' });
    }

    // randomのパース
    const isRandom = random === 'true' || random === '1';

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
      if (contestType === 'all') {
        matchesContest = true;
      } else {
        matchesContest = problemId.toLowerCase().includes(contestType);
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

    // オブジェクトを配列に変換
    let problemsArray = Object.entries(filteredProblems).map(([id, model]) => ({
      id,
      ...model
    }));

    // ランダムシャッフル
    if (isRandom) {
      const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };
      problemsArray = shuffleArray(problemsArray);
    }

    // limit適用
    if (limitCount !== null) {
      problemsArray = problemsArray.slice(0, limitCount);
    }

    return res.status(200).json({
      success: true,
      contestType: contestType,
      problemType: problemType,
      filters: {
        minDifficulty,
        maxDifficulty,
        limit: limitCount,
        random: isRandom
      },
      data: problemsArray,
      count: problemsArray.length
    });

  } catch (error) {
    console.error('Error fetching problem models:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
