const path = require('path')
const urls = require(path.resolve('src/data/urls-data'))
const { addUseRecord } = require('../uses/uses.controller')

function create(req, res) {
  const { data: { href } = {} } = req.body
  const newUrl = {
    id: urls.length + 1,
    href,
  }
  urls.push(newUrl)
  res.status(201).json({ data: newUrl })
}

function hasHref(req, res, next) {
  const { data: { href } = {} } = req.body

  if (href) {
    return next()
  }
  next({ status: 400, message: "A 'href' property is required." })
}

function list(req, res) {
  res.json({ data: urls })
}

function urlExists(req, res, next) {
  const { urlId } = req.params
  const foundUrl = urls.find((url) => url.id == urlId)
  if (foundUrl) {
    res.locals.url = foundUrl
    return next()
  }
  next({
    status: 404,
    message: `URL id not found: ${urlId}`,
  })
}

function read(req, res, next) {
  res.json({ data: res.locals.url })
}

function update(req, res) {
  const url = res.locals.url
  const { data: { href } = {} } = req.body
  // Update the URL
  url.href = href
  res.json({ data: url })
}

module.exports = {
  create: [hasHref, create],
  list,
  read: [urlExists, read],
  update: [urlExists, hasHref, update],
  urlExists,
}
