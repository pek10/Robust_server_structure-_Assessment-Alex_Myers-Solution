const path = require('path')
const uses = require(path.resolve('src/data/uses-data'))

function addUseRecord(req, res, next) {
  const newUseRecord = {
    id: uses.length + 1,
    urlId: Number(req.params.urlId),
    time: Date.now(),
  }

  uses.push(newUseRecord)

  return next()
}

function destroy(req, res) {
  const { useId } = req.params
  const index = uses.findIndex((use) => use.id === Number(useId))
  if (index > -1) {
    uses.splice(index, 1)
  }
  res.sendStatus(204)
}

function list(req, res) {
  const { urlId } = req.params
  res.json({
    data: uses.filter(urlId ? (use) => use.urlId == urlId : () => true),
  })
}

function useExists(req, res, next) {
  const { useId } = req.params
  const foundUse = uses.find((use) => use.id == useId)
  if (foundUse) {
    res.locals.use = foundUse
    return next()
  }
  next({
    status: 404,
    message: `Use id not found: ${useId}`,
  })
}

function read(req, res, next) {
  res.json({ data: res.locals.use })
}

module.exports = {
  list,
  read: [useExists, read],
  delete: [useExists, destroy],
  useExists,
  addUseRecord,
}
