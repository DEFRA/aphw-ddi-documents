const { formatDateAsTimestamp } = require('../../../app/lib/date-helpers')
const { processTemplate, doStripe, calcTableWidth, doHeader, doFooter } = require('../../../app/lib/generator/certificate')

const mockList = jest.fn()
const mockFontSize = jest.fn().mockImplementation(() => {
  return { list: mockList }
})
const addBackgroundFn = jest.fn()
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
  moveDown: jest.fn(),
  lineWidth: jest.fn(),
  addBackground: addBackgroundFn,
  bufferedPageRange: jest.fn().mockReturnValue({ start: 0, count: 2 }),
  switchToPage: jest.fn()
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

  test('should handle table with title', () => {
    const template = {
      definition: [
        {
          type: 'table',
          table: { headers: [], rows: [] },
          options: {
            opt1: 'val1',
            title: {
              label: 'My title',
              font: 'Arial.bold'
            }
          }
        }
      ]
    }
    const values = { }
    processTemplate(mockDoc, template, values)

    expect(mockDoc.table).toHaveBeenCalledWith({ headers: [], rows: [] }, { opt1: 'val1', subtitle: ' ' })
  })

  test('should handle table with border', () => {
    const template = {
      definition: [
        {
          type: 'table',
          table: { headers: [], rows: [] },
          options: {
            opt1: 'val1',
            outerBorder: {
              disabled: false,
              width: 2
            },
            x: 100,
            y: 200
          }
        }
      ]
    }
    const values = { }
    mockDoc.x = 100
    mockDoc.y = 300
    processTemplate(mockDoc, template, values)

    expect(mockDoc.table).toHaveBeenCalledWith({
      headers: [],
      rows: []
    },
    {
      opt1: 'val1',
      x: 100,
      y: 200,
      outerBorder: {
        disabled: false,
        width: 2
      }
    })
    expect(mockDoc.rect).toHaveBeenCalledWith(100, 200, 0, 100)
    expect(mockDoc.stroke).toHaveBeenCalled()
    expect(mockDoc.table.mock.calls[0][1].prepareRow).toBe(undefined)
  })

  test('should handle table with striped rows', () => {
    const template = {
      definition: [
        {
          type: 'table',
          table: {
            headers: [{ label: 'Age', headerColor: 'white', width: 190 }],
            rows: [['12'], ['45'], ['65']]
          },
          options: {
            opt1: 'val1',
            stripedRows: true,
            x: 100,
            y: 200
          }
        }
      ]
    }
    const values = { }
    mockDoc.x = 100
    mockDoc.y = 300
    processTemplate(mockDoc, template, values)

    expect(mockDoc.table).toHaveBeenCalledWith({
      headers: [{ label: 'Age', headerColor: 'white', width: 190 }],
      rows: [['12'], ['45'], ['65']]
    },
    {
      opt1: 'val1',
      x: 100,
      y: 200,
      stripedRows: true,
      prepareRow: expect.anything(jest.fn())
    })
    expect(mockDoc.table.mock.calls[0][1].prepareRow).not.toBe(undefined)
  })

  test('should handle table with data rows being passed dynamically', () => {
    const template = {
      definition: [
        {
          type: 'table',
          table: {
            headers: [{ label: 'Age', headerColor: 'white', width: 190 }],
            rows: {},
            rowDataKey: 'myTableRows'
          },
          options: {
            opt1: 'val1',
            x: 100,
            y: 200
          }
        }
      ]
    }
    const values = { myTableRows: [['12'], ['45'], ['65']] }
    mockDoc.x = 100
    mockDoc.y = 300
    processTemplate(mockDoc, template, values)

    expect(mockDoc.table).toHaveBeenCalledWith({
      headers: [{ label: 'Age', headerColor: 'white', width: 190 }],
      rows: [['12'], ['45'], ['65']],
      rowDataKey: 'myTableRows'
    },
    {
      opt1: 'val1',
      x: 100,
      y: 200
    })
  })

  test('should handle table with data rows spanning more than one page', () => {
    const template = {
      definition: [
        {
          type: 'table',
          table: {
            headers: [{ label: 'Age', headerColor: 'white', width: 190 }],
            rows: {},
            rowDataKey: 'myTableRows'
          },
          options: {
            opt1: 'val1',
            x: 100,
            y: 200,
            outerBorder: { disabled: false }
          }
        }
      ]
    }
    const values = {
      myTableRows: [
        ['1'], ['2'], ['3'], ['4'], ['5'], ['6'], ['7'], ['8'], ['9'], ['10']
      ]
    }
    mockDoc.x = 100
    mockDoc.y = 300
    template.currentPageNum = 1
    mockDoc.table.mockImplementation(() => {
      template.currentPageNum = 2
    })

    processTemplate(mockDoc, template, values)

    expect(mockDoc.table).toHaveBeenCalledWith({
      headers: [{ label: 'Age', headerColor: 'white', width: 190 }],
      rows: [['1'], ['2'], ['3'], ['4'], ['5'], ['6'], ['7'], ['8'], ['9'], ['10']],
      rowDataKey: 'myTableRows'
    },
    {
      opt1: 'val1',
      x: 100,
      y: 200,
      outerBorder: { disabled: false }
    })
    expect(mockDoc.rect).toHaveBeenCalledTimes(2)
    expect(mockDoc.rect.mock.calls[0]).toEqual([100, 300, 190, 165])
    expect(mockDoc.rect.mock.calls[1]).toEqual([100, 65, 190, 235])
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

  describe('doStripe', () => {
    test('should handle first row', () => {
      doStripe(mockDoc, 'Arial.normal', 10, 0, {})
      expect(mockDoc.font).toHaveBeenCalledTimes(1)
      expect(mockDoc.addBackground).toHaveBeenCalledTimes(1)
    })

    test('should handle second row', () => {
      doStripe(mockDoc, 'Arial.normal', 10, 1, {})
      expect(mockDoc.font).toHaveBeenCalledTimes(1)
      expect(mockDoc.addBackground).toHaveBeenCalledTimes(0)
    })

    test('should handle odd row', () => {
      doStripe(mockDoc, 'Arial.normal', 10, 7, {})
      expect(mockDoc.font).toHaveBeenCalledTimes(1)
      expect(mockDoc.addBackground).toHaveBeenCalledTimes(0)
    })

    test('should handle even row', () => {
      doStripe(mockDoc, 'Arial.normal', 10, 8, {})
      expect(mockDoc.font).toHaveBeenCalledTimes(1)
      expect(mockDoc.addBackground).toHaveBeenCalledTimes(1)
    })
  })

  describe('calcTableWidth', () => {
    test('should handle single column', () => {
      const table = {
        headers: [{ label: 'Age', headerColor: 'white', width: 190 }]
      }
      const res = calcTableWidth(table)
      expect(res).toBe(190)
    })

    test('should handle multiple columns', () => {
      const table = {
        headers: [
          { label: 'Name', headerColor: 'white', width: 190 },
          { label: 'Age', headerColor: 'white', width: 30 },
          { label: 'Height', headerColor: 'white', width: 45 }
        ]
      }
      const res = calcTableWidth(table)
      expect(res).toBe(190 + 30 + 45)
    })
  })

  test('doHeader ignores if no header defined', () => {
    const template = {
      definition: []
    }
    const values = { }
    doHeader(mockDoc, template, values)
    expect(mockDoc.image).not.toHaveBeenCalled()
  })

  test('doHeader processes header when defined', () => {
    const template = {
      definition: [{
        type: 'header',
        content: [{
          type: 'image'
        }]
      }]
    }
    const values = { }
    doHeader(mockDoc, template, values)
    expect(mockDoc.image).toHaveBeenCalledWith(undefined, undefined, undefined, undefined)
  })

  test('doFooter ignores if no footer defined', () => {
    const template = {
      definition: []
    }
    const values = { }
    doHeader(mockDoc, template, values)
    expect(mockDoc.text).not.toHaveBeenCalled()
  })

  test('doFooter processes footer when defined', () => {
    const template = {
      definition: [{
        type: 'footer',
        content: [{
          type: 'text',
          size: 10,
          x: 100,
          y: 200
        }]
      }]
    }
    const values = { }
    doFooter(mockDoc, template, values)
    expect(mockDoc.text).toHaveBeenNthCalledWith(1, 'Page 1 of 2', 100, 200, { size: 10 })
    expect(mockDoc.text).toHaveBeenNthCalledWith(2, 'Page 2 of 2', 100, 200, { size: 10 })
  })

  test('replace token in text if necessary', () => {
    const template = {
      definition: [{
        type: 'text',
        text: 'Current time is {timestamp}',
        size: 10,
        x: 100,
        y: 200,
        font: 'Arial.normal'
      }]
    }
    const values = { }
    processTemplate(mockDoc, template, values)
    const timeNow = formatDateAsTimestamp(new Date())
    expect(mockDoc.text.mock.calls[0][0]).toBe('Current time is ' + timeNow)
  })
})
