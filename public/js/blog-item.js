import { initEvents } from './common'

function initComment () {
  const dom = document.querySelector('.blog-content')
  const id = dom.dataset.id
  new GhTalk({  // eslint-disable-line
    selector: '.blog-comment',
    clientId: 'e77789a76f3d4177222a',
    clientSecret: '71336d3afe48d3136030e683b968df6f6a9bb943',
    owner: 'jerry-i',
    repo: 'blog',
    issueId: id
  })
}

initComment()

initEvents()
