const axios = require('axios')

const config = require('./util').getConfig()

const { owner, repo, Authorization } = config

const $http = axios.create({
  baseURL: 'https://api.github.com',
  headers: {Authorization: `token ${Authorization}`}
})
// GET /repos/:owner/:repo/issues

exports.listIssues = () => $http.get(`/repos/${owner}/${repo}/issues`)

const _detailUser = user => $http.get(`/users/${user}`)

exports.detailUser = (() => {
  const _dataCache = {}
  const _promiseCache = {}
  return (user) => {
    if (_dataCache[user]) return Promise.resolve(_dataCache[user])
    if (_promiseCache[user]) return _promiseCache[user]
    return (_promiseCache[user] = _detailUser(user).then(res => {
      _dataCache[user] = res
      return res
    }))
  }
})()
