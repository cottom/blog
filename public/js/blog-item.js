import { initEvents } from './common'

function initComment () {
  const dom = document.querySelector('.blog-content')
  const id = dom.dataset.id
  new GhTalk({  // eslint-disable-line
    selector: '.blog-comment',
    clientId: 'acdf02d798960d98dc7d',
    clientSecret: '647f54566aef4e03ebbc80309eb8adb501fb7d63',
    owner: 'jerry-i',
    repo: 'blog',
    issueId: id
  })
}

initComment()

initEvents()
