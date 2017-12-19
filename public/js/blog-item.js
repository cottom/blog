import { initEvents } from './common'

function initComment () {
  const dom = document.querySelector('.blog-content')
  const id = dom.dataset.id
  new GhTalk({  // eslint-disable-line
    selector: '.blog-comment',
    clientId: '78cb0df51a5382860408',
    clientSecret: '0215cebf5c8475df93065e45accc2c05a993e082',
    owner: 'jerry-i',
    repo: 'jerry-i.github.io',
    issueId: id
  })
}

initComment()

initEvents()
