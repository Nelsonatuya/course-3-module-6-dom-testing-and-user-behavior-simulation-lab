const fs = require('fs')
const path = require('path')
const {
  addElementToDOM,
  removeElementFromDOM,
  simulateClick,
  handleFormSubmit,
  initializeDOMBehavior,
} = require('../index')

const htmlTemplate = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8')

describe('DOM Testing and User Behavior Simulation', () => {
  beforeEach(() => {
    const templateDocument = new DOMParser().parseFromString(htmlTemplate, 'text/html')
    const templateNodes = Array.from(templateDocument.body.childNodes)
    document.body.replaceChildren(...templateNodes.map((node) => document.importNode(node, true)))
    initializeDOMBehavior()
  })

  it('loads the expected form controls and content containers', () => {
    expect(document.getElementById('simulate-click')).not.toBeNull()
    expect(document.getElementById('user-input')).not.toBeNull()
    expect(document.querySelector('#user-form button[type="submit"]')).not.toBeNull()
    expect(document.getElementById('dynamic-content')).not.toBeNull()
    expect(document.getElementById('error-message')).not.toBeNull()
  })

  it('should add an element to the DOM', () => {
    const addedElement = addElementToDOM('dynamic-content', 'Hello, World!')
    const dynamicContent = document.getElementById('dynamic-content')

    expect(addedElement.tagName).toBe('P')
    expect(dynamicContent.textContent).toContain('Hello, World!')
  })

  it('returns null when adding content to a missing container', () => {
    expect(addElementToDOM('missing-container', 'Hello')).toBeNull()
  })

  it('should remove an element from the DOM', () => {
    const element = document.createElement('div')
    element.id = 'test-element'
    document.body.appendChild(element)

    removeElementFromDOM('test-element')
    expect(document.getElementById('test-element')).toBeNull()
  })

  it('should simulate a button click and update the DOM', () => {
    simulateClick('dynamic-content', 'Button Clicked!')
    const dynamicContent = document.getElementById('dynamic-content')
    expect(dynamicContent.textContent).toContain('Button Clicked!')
  })

  it('updates the DOM when the page button is clicked', () => {
    document.getElementById('simulate-click').click()

    expect(document.getElementById('dynamic-content').textContent).toContain('Button Clicked!')
  })

  it('should handle form submission and update the DOM', () => {
    const input = document.getElementById('user-input')
    input.value = 'Test Input'

    handleFormSubmit('user-form', 'dynamic-content')
    const dynamicContent = document.getElementById('dynamic-content')
    expect(dynamicContent.textContent).toContain('Test Input')
  })

  it('handles a submitted form event and clears the prior error', () => {
    const input = document.getElementById('user-input')
    const errorMessage = document.getElementById('error-message')
    input.value = 'Submitted from the form'
    errorMessage.textContent = 'Old error'
    errorMessage.classList.remove('hidden')

    document.getElementById('user-form').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    )

    expect(document.getElementById('dynamic-content').textContent).toContain('Submitted from the form')
    expect(errorMessage.textContent).toBe('')
    expect(errorMessage.classList.contains('hidden')).toBe(true)
  })

  it('should display an error message for empty input', () => {
    handleFormSubmit('user-form', 'dynamic-content')
    const errorMessage = document.getElementById('error-message')
    expect(errorMessage.textContent).toBe('Input cannot be empty')
    expect(errorMessage.classList.contains('hidden')).toBe(false)
  })

  it('rejects whitespace-only input', () => {
    document.getElementById('user-input').value = '   '

    expect(handleFormSubmit('user-form', 'dynamic-content')).toBe(false)
    expect(document.getElementById('dynamic-content').children).toHaveLength(0)
    expect(document.getElementById('error-message').textContent).toBe('Input cannot be empty')
  })

  it('reports a missing form without throwing', () => {
    expect(handleFormSubmit('missing-form', 'dynamic-content')).toBe(false)
    expect(document.getElementById('error-message').textContent).toBe('Form not found')
  })

  it('reports a missing input field', () => {
    document.getElementById('user-input').remove()

    expect(handleFormSubmit('user-form', 'dynamic-content')).toBe(false)
    expect(document.getElementById('error-message').textContent).toBe('Input field not found')
  })

  it('reports a missing content container after valid input', () => {
    document.getElementById('user-input').value = 'Valid input'
    document.getElementById('dynamic-content').remove()

    expect(handleFormSubmit('user-form', 'dynamic-content')).toBe(false)
    expect(document.getElementById('error-message').textContent).toBe('Content area not found')
  })
})
