# AtCoder Problem API

AtCoderの問題データを取得するためのAPI。[kenkoooo.com](https://kenkoooo.com/atcoder/)のデータを元に、条件に応じて問題をフィルタリングして取得できます。

## エンドポイント

```
GET /problems
```

## クエリパラメータ

| パラメータ | 型 | 必須 | 説明 | デフォルト値 |
|----------|-----|------|------|------------|
| `contest` | string | ❌ | コンテストタイプ (`abc`, `arc`, `agc`, `all`) | `all` |
| `problem` | string | ❌ | 問題タイプ (`a`, `b`, `c`, `d`, `e`, `f`, `g`, `h`, `all`) | `all` |
| `min` | number | ❌ | 最小難易度 | `-10000` |
| `max` | number | ❌ | 最大難易度 | `10000` |
| `limit` | number | ❌ | 取得する問題数の上限 | なし |
| `random` | boolean | ❌ | ランダムに並び替え (`true` または `1`) | `false` |

## 使い方

### 基本的な使い方

すべての問題を取得:
```
GET /problems
```

ABCの問題のみ取得:
```
GET /problems?contest=abc
```

### 難易度で絞り込み

難易度400〜800の問題を取得:
```
GET /problems?min=400&max=800
```

難易度1000以上のABC問題:
```
GET /problems?contest=abc&min=1000
```

### 問題タイプで絞り込み

A問題のみ取得:
```
GET /problems?problem=a
```

ABCのD問題で難易度800〜1200:
```
GET /problems?contest=abc&problem=d&min=800&max=1200
```

### ランダム取得

条件に合う問題からランダムに10問取得:
```
GET /problems?contest=abc&min=400&max=800&limit=10&random=true
```

ARCのC問題からランダムに5問:
```
GET /problems?contest=arc&problem=c&limit=5&random=true
```

## レスポンス例

```json
{
  "success": true,
  "contestType": "abc",
  "problemType": "all",
  "filters": {
    "minDifficulty": 400,
    "maxDifficulty": 800,
    "limit": 10,
    "random": true
  },
  "data": [
    {
      "id": "abc123_a",
      "contest_id": "abc123",
      "problem_index": "A",
      "difficulty": 456,
      "discrimination": 1.2,
      "is_experimental": false,
      "solver_count": 12345,
      "minimum_rating": 200,
      "maximum_rating": 800,
      "point": 100,
      "raw_estimate": 7.89,
      "variance": 1.23,
      "model_type": "logistic"
    },
    ...
  ],
  "count": 10
}
```

## エラーレスポンス

### 無効なコンテストタイプ
```json
{
  "error": "Invalid contest type",
  "message": "Contest type must be one of: abc, arc, agc, all"
}
```

### 無効な問題タイプ
```json
{
  "error": "Invalid problem type",
  "message": "Problem type must be one of: a, b, c, d, e, f, g, h, all"
}
```

### 無効なlimit値
```json
{
  "error": "Invalid limit value. Must be a positive integer."
}
```

## デプロイ

このAPIはVercelにデプロイされています。

## データソース

問題データは [AtCoder Problems](https://kenkoooo.com/atcoder/) から取得しています。

```
https://kenkoooo.com/atcoder/resources/problem-models.json
```