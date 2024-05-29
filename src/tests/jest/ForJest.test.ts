import { render } from '@testing-library/vue'
import Component from '../../components/ForJestTest.vue'

test('increments value on click', async () => {
  // The render method returns a collection of utilities to query your component.
  const { getByText } = render(Component)

  getByText('ForJestTest')
})
