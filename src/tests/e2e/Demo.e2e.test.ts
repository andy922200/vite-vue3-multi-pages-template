import { Selector } from 'testcafe'
import { projectName, port } from '../../../vite.config.shared'

fixture('Contact Page').page(`http://localhost:${port}/${projectName}/contact`)

test('Contact Page contains Title', async (testController) => {
  const selector = Selector('h1!!!!!!!!')

  await testController.expect(selector.innerText).eql('Contact')
})
