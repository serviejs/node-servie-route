import { compose } from 'throwback'
import { get } from './index'
import { Request, Response } from 'servie'

describe('throwback-route', () => {
  it('should match a route', () => {
    const app = compose([
      get('/test', helloWorld)
    ])

    const req = new Request({ method: 'get', url: '/test' })

    return app(req, finalhandler(req))
      .then((res) => {
        expect(res.status).toBe(200)

        return res.text().then((body) => expect(body).toBe('hello world'))
      })
  })

  it('should not match when path does not equal', () => {
    const s = compose([
      get('/test', helloWorld)
    ])

    const req = new Request({ method: 'get', url: '/' })

    return s(req, finalhandler(req))
      .then((res) => expect(res.status).toBe(404))
  })

  it('should not match when method does not equal', () => {
    const app = compose([
      get('/test', helloWorld)
    ])

    const req = new Request({ method: 'delete', url: '/test' })

    return app(req, finalhandler(req))
      .then((res) => expect(res.status).toBe(404))
  })

  it('should work with parameters', () => {
    const animals = [
      'rabbit',
      'dog',
      'cat'
    ]

    const app = compose([
      get('/pets', function (req) {
        return new Response(req, { body: animals })
      }),
      get('/pets/:id', function (req, params) {
        return new Response(req, { body: animals[Number(params[0])] })
      })
    ])

    const req = new Request({ method: 'get', url: '/pets/1' })

    return app(req, finalhandler(req))
      .then((res) => {
        return res.text().then(body => expect(body).toEqual('dog'))
      })
  })
})

/**
 * Respond with "hello world".
 */
function helloWorld (req: Request) {
  return new Response(req, {
    status: 200,
    body: 'hello world'
  })
}

/**
 * Final 404 handler.
 */
function finalhandler (req: Request) {
  return function () {
    return Promise.resolve(new Response(req, {
      status: 404
    }))
  }
}
