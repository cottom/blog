const { listIssues } = require('../build/resource')

test('should response issue as a array', async () => {
  const { data } = await listIssues()
  expect(Array.isArray(data)).toBe(true)
}, 10000)
