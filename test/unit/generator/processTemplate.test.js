const { processTemplate } = require('../../../app/lib/generator/certificate')

const mockList = jest.fn()
const mockFontSize = jest.fn().mockImplementation(() => {
  return { list: mockList }
})
const mockDoc = {
  font: jest.fn().mockImplementation(() => {
    return { fontSize: mockFontSize }
  }),
  text: jest.fn(),
  image: jest.fn(),
  list: jest.fn(),
  addPage: jest.fn(),
  table: jest.fn(),
  rect: jest.fn(),
  stroke: jest.fn(),
  moveDown: jest.fn()
}

describe('processTemplate', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should handle text (no variable replacement)', () => {
    const template = {
      definition: [
        {
          type: 'text',
          font: 'Arial.bold',
          text: 'Address',
          size: 11,
          x: 45,
          y: 180,
          options: {
            opt1: 'val1'
          }
        }
      ]
    }
    const values = {}
    processTemplate(mockDoc, template, values)

    expect(mockDoc.text).toHaveBeenCalledWith('Address', 45, 180, { opt1: 'val1' })
  })

  test('should handle text (no variable replacement but line break aftrerwards)', () => {
    const template = {
      definition: [
        {
          type: 'text',
          font: 'Arial.bold',
          text: 'Address',
          size: 11,
          x: 45,
          y: 180,
          options: {
            opt1: 'val1'
          },
          lineBreak: true
        }
      ]
    }
    const values = {}
    processTemplate(mockDoc, template, values)

    expect(mockDoc.text).toHaveBeenCalledWith('Address', 45, 180, { opt1: 'val1' })
    expect(mockDoc.moveDown).toHaveBeenCalledWith(true)
  })

  test('should handle text (no variable replacementa dn no coords)', () => {
    const template = {
      definition: [
        {
          type: 'text',
          font: 'Arial.bold',
          text: 'Address',
          size: 11,
          options: {
            opt1: 'val1'
          }
        }
      ]
    }
    const values = {}
    processTemplate(mockDoc, template, values)

    expect(mockDoc.text).toHaveBeenCalledWith('Address', { opt1: 'val1' })
  })

  test('should handle text with variable replacement', () => {
    const template = {
      definition: [
        {
          type: 'text',
          font: 'Arial.bold',
          key: 'testvar1',
          size: 11,
          x: 45,
          y: 180,
          options: {
            opt1: 'val1'
          }
        }
      ]
    }
    const values = { testvar1: 'myval1' }
    processTemplate(mockDoc, template, values)

    expect(mockDoc.text).toHaveBeenCalledWith('myval1', 45, 180, { opt1: 'val1' })
  })

  test('should handle image', () => {
    const template = {
      definition: [
        {
          type: 'image',
          name: 'testimage',
          x: 45,
          y: 180,
          options: {
            opt1: 'val1'
          }
        }
      ],
      testimage: 'image-filename'
    }
    const values = { testvar1: 'myval1' }
    processTemplate(mockDoc, template, values)

    expect(mockDoc.image).toHaveBeenCalledWith('image-filename', 45, 180, { opt1: 'val1' })
  })

  test('should handle list', () => {
    const template = {
      definition: [
        {
          type: 'list',
          font: 'Arial.bold',
          size: 11,
          items: ['bullet1', 'bullet2'],
          options: {
            opt1: 'val1'
          }
        }
      ]
    }
    const values = { }
    processTemplate(mockDoc, template, values)

    expect(mockList).toHaveBeenCalledWith(['bullet1', 'bullet2'], { opt1: 'val1' })
  })

  test('should handle page', () => {
    const template = {
      definition: [
        {
          type: 'page',
          options: {
            opt1: 'val1'
          }
        }
      ]
    }
    const values = { }
    processTemplate(mockDoc, template, values)

    expect(mockDoc.addPage).toHaveBeenCalledWith({ opt1: 'val1' })
  })

  test('should handle table', () => {
    const template = {
      definition: [
        {
          type: 'table',
          table: { headers: [], rows: [] },
          options: {
            opt1: 'val1'
          }
        }
      ]
    }
    const values = { }
    processTemplate(mockDoc, template, values)

    expect(mockDoc.table).toHaveBeenCalledWith({ headers: [], rows: [] }, { opt1: 'val1' })
  })

  test('should handle rectangle', () => {
    const template = {
      definition: [
        {
          type: 'rect',
          x: 45,
          y: 180,
          width: 150,
          height: 50
        }
      ]
    }
    const values = { }
    processTemplate(mockDoc, template, values)

    expect(mockDoc.rect).toHaveBeenCalledWith(45, 180, 150, 50)
    expect(mockDoc.stroke).toHaveBeenCalled()
  })
})
