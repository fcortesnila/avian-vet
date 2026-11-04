import { expect, test } from '@playwright/test'

test('patient directory loads and a patient can be added', async ({ page }) => {
  const patients: { id: number; name: string; species: string; owner_name: string; notes: string }[] = []

  await page.route('**/api/patients', async route => {
    if (route.request().method() === 'POST') {
      const patient = route.request().postDataJSON()
      patients.push({ id: 1, ...patient })
      await route.fulfill({ json: patients[patients.length - 1], status: 201 })
      return
    }

    await route.fulfill({ json: patients })
  })

  await page.goto('/')
  await expect(page.getByText('Your patient list is ready to take flight.')).toBeVisible()

  await page.getByPlaceholder('Patient name').fill('Pip')
  await page.getByPlaceholder('Species').fill('Cockatiel')
  await page.getByPlaceholder('Owner name').fill('Alex')
  await page.getByRole('button', { name: /Add patient/ }).click()

  await expect(page.getByText('Pip')).toBeVisible()
  await expect(page.getByText('Cockatiel · Alex')).toBeVisible()
  await expect(page.getByText('1 patients')).toBeVisible()
})

test('care assistant displays its answer and cited source', async ({ page }) => {
  await page.route('**/api/patients', route => route.fulfill({ json: [] }))
  await page.route('**/api/assistant/ask', async route => {
    expect(route.request().postDataJSON()).toEqual({ question: 'What should I ask my vet?' })
    await route.fulfill({
      json: {
        answer: 'Discuss any changes in appetite with your veterinarian.',
        notice: 'General information only.',
        citations: [{ source: 'Clinic guide', excerpt: 'Monitor appetite.' }],
      },
    })
  })

  await page.goto('/')
  await page.getByPlaceholder('Ask a care question…').fill('What should I ask my vet?')
  await page.getByRole('button', { name: 'Ask assistant' }).click()

  await expect(page.getByText('Discuss any changes in appetite with your veterinarian.')).toBeVisible()
  await expect(page.getByText('Source: Clinic guide — Monitor appetite.')).toBeVisible()
  await expect(page.getByText('General information only.')).toBeVisible()
})
