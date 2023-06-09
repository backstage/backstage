import { forEach, get, round } from 'lodash'

// rangeToCumulative takes an AllocationSetRange (type: array[AllocationSet])
// and accumulates the values into a single AllocationSet (type: object)
export function rangeToCumulative(allocationSetRange, aggregateBy) {
  if (allocationSetRange.length === 0) {
    return null
  }

  const result = {}

  forEach(allocationSetRange, (allocSet) => {
    forEach(allocSet, (alloc) => {
      if (result[alloc.name] === undefined) {
        const hrs = get(alloc, 'minutes', 0) / 60.0

        result[alloc.name] = {
          name: alloc.name,
          [aggregateBy]: alloc.name,
          cpuCost: get(alloc, 'cpuCost', 0),
          gpuCost: get(alloc, 'gpuCost', 0),
          ramCost: get(alloc, 'ramCost', 0),
          pvCost: get(alloc, 'pvCost', 0),
          networkCost: get(alloc, 'networkCost', 0),
          sharedCost: get(alloc, 'sharedCost', 0),
          externalCost: get(alloc, 'externalCost', 0),
          totalCost: get(alloc, 'totalCost', 0),
          cpuUseCoreHrs: get(alloc, 'cpuCoreUsageAverage', 0) * hrs,
          cpuReqCoreHrs: get(alloc, 'cpuCoreRequestAverage', 0) * hrs,
          ramUseByteHrs: get(alloc, 'ramByteUsageAverage', 0) * hrs,
          ramReqByteHrs: get(alloc, 'ramByteRequestAverage', 0) * hrs,
          cpuEfficiency: get(alloc, 'cpuEfficiency', 0),
          ramEfficiency: get(alloc, 'ramEfficiency', 0),
          totalEfficiency: get(alloc, 'totalEfficiency', 0),
        }
      } else {
        const hrs = get(alloc, 'minutes', 0) / 60.0

        result[alloc.name].cpuCost += get(alloc, 'cpuCost', 0)
        result[alloc.name].gpuCost += get(alloc, 'gpuCost', 0)
        result[alloc.name].ramCost += get(alloc, 'ramCost', 0)
        result[alloc.name].pvCost += get(alloc, 'pvCost', 0)
        result[alloc.name].networkCost += get(alloc, 'networkCost', 0)
        result[alloc.name].sharedCost += get(alloc, 'sharedCost', 0)
        result[alloc.name].externalCost += get(alloc, 'externalCost', 0)
        result[alloc.name].totalCost += get(alloc, 'totalCost', 0)
        result[alloc.name].cpuUseCoreHrs += get(alloc, 'cpuCoreUsageAverage', 0) * hrs
        result[alloc.name].cpuReqCoreHrs += get(alloc, 'cpuCoreRequestAverage', 0) * hrs
        result[alloc.name].ramUseByteHrs += get(alloc, 'ramByteUsageAverage', 0) * hrs
        result[alloc.name].ramReqByteHrs += get(alloc, 'ramByteRequestAverage', 0) * hrs
      }
    })
  })

  // If the range is of length > 1 (i.e. it is not just a single set) then
  // compute efficiency for each result after accumulating.
  if (allocationSetRange.length > 1) {
    forEach(result, (alloc, name) => {
      // If we can't compute total efficiency, it defaults to 0.0
      let totalEfficiency = 0.0

      // CPU efficiency is defined as (usage/request). If request == 0.0 but
      // usage > 0, then efficiency gets set to 1.0.
      let cpuEfficiency = 0.0
      if (alloc.cpuReqCoreHrs > 0) {
        cpuEfficiency = alloc.cpuUseCoreHrs / alloc.cpuReqCoreHrs
      } else if (alloc.cpuUseCoreHrs > 0) {
        cpuEfficiency = 1.0
      }

      // RAM efficiency is defined as (usage/request). If request == 0.0 but
      // usage > 0, then efficiency gets set to 1.0.
      let ramEfficiency = 0.0
      if (alloc.ramReqByteHrs > 0) {
        ramEfficiency = alloc.ramUseByteHrs / alloc.ramReqByteHrs
      } else if (alloc.ramUseByteHrs > 0) {
        ramEfficiency = 1.0
      }

      // Compute efficiency as the cost-weighted average of CPU and RAM
      // efficiency
      if ((alloc.cpuCost + alloc.ramCost) > 0.0) {
        totalEfficiency = ((alloc.cpuCost*cpuEfficiency)+(alloc.ramCost*ramEfficiency)) / (alloc.cpuCost + alloc.ramCost)
      }

      result[name].cpuEfficiency = cpuEfficiency
      result[name].ramEfficiency = ramEfficiency
      result[name].totalEfficiency = totalEfficiency
    })
  }

  return result
}

// cumulativeToTotals adds each entry in the given AllocationSet (type: object)
// and returns a single Allocation (type: object) representing the totals
export function cumulativeToTotals(allocationSet) {
  let totals = {
    name: 'Totals',
    cpuCost: 0,
    gpuCost: 0,
    ramCost: 0,
    pvCost: 0,
    networkCost: 0,
    sharedCost: 0,
    externalCost: 0,
    totalCost: 0,
    cpuEfficiency: 0,
    ramEfficiency: 0,
    totalEfficiency: 0,
  }

  // Use these for computing efficiency. As such, idle will not factor into
  // these numbers, including CPU and RAM cost.
  let cpuReqCoreHrs = 0
  let cpuUseCoreHrs = 0
  let ramReqByteHrs = 0
  let ramUseByteHrs = 0
  let cpuCost = 0
  let ramCost = 0

  forEach(allocationSet, (alloc, name) => {
    // Accumulate efficiency-related fields
    if (name !== "__idle__") {
      cpuReqCoreHrs += get(alloc, 'cpuReqCoreHrs', 0.0)
      cpuUseCoreHrs += get(alloc, 'cpuUseCoreHrs', 0.0)
      ramReqByteHrs += get(alloc, 'ramReqByteHrs', 0.0)
      ramUseByteHrs += get(alloc, 'ramUseByteHrs', 0.0)
      cpuCost += get(alloc, 'cpuCost', 0.0)
      ramCost += get(alloc, 'ramCost', 0.0)
    }

    // Sum cumulative fields
    totals.cpuCost += get(alloc, 'cpuCost', 0)
    totals.gpuCost += get(alloc, 'gpuCost', 0)
    totals.ramCost += get(alloc, 'ramCost', 0)
    totals.pvCost += get(alloc, 'pvCost', 0)
    totals.networkCost += get(alloc, 'networkCost', 0)
    totals.sharedCost += get(alloc, 'sharedCost', 0)
    totals.externalCost += get(alloc, 'externalCost', 0)
    totals.totalCost += get(alloc, 'totalCost', 0)
  })

  // Compute efficiency
  if (cpuReqCoreHrs > 0) {
    totals.cpuEfficiency = cpuUseCoreHrs / cpuReqCoreHrs
  } else if (cpuUseCoreHrs > 0) {
    totals.cpuEfficiency = 1.0
  }

  if (ramReqByteHrs > 0) {
    totals.ramEfficiency = ramUseByteHrs / ramReqByteHrs
  } else if (ramUseByteHrs > 0) {
    totals.ramEfficiency = 1.0
  }

  if ((cpuCost + ramCost) > 0) {
    totals.totalEfficiency = ((cpuCost*totals.cpuEfficiency) + (ramCost*totals.ramEfficiency)) / (cpuCost + ramCost)
  }

  totals.cpuReqCoreHrs = cpuReqCoreHrs
  totals.cpuUseCoreHrs = cpuUseCoreHrs
  totals.ramReqByteHrs = ramReqByteHrs
  totals.ramUseByteHrs = ramUseByteHrs

  return totals
}

export function toVerboseTimeRange(window) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const start = new Date()
  start.setUTCHours(0, 0, 0, 0)

  const end = new Date()
  end.setUTCHours(0, 0, 0, 0)

  switch (window) {
    case 'today':
      return `${start.getUTCDate()} ${months[start.getUTCMonth()]} ${start.getUTCFullYear()}`
    case 'yesterday':
      start.setUTCDate(start.getUTCDate()-1)
      return `${start.getUTCDate()} ${months[start.getUTCMonth()]} ${start.getUTCFullYear()}`
    case 'week':
      start.setUTCDate(start.getUTCDate()-start.getUTCDay())
      return `${start.getUTCDate()} ${months[start.getUTCMonth()]} ${start.getUTCFullYear()} until now`
    case 'month':
      start.setUTCDate(1)
      return `${start.getUTCDate()} ${months[start.getUTCMonth()]} ${start.getUTCFullYear()} until now`
    case 'lastweek':
      start.setUTCDate(start.getUTCDate()-(start.getUTCDay()+7))
      end.setUTCDate(end.getUTCDate()-(end.getUTCDay()+1))
      return `${start.getUTCDate()} ${months[start.getUTCMonth()]} ${start.getUTCFullYear()} through ${end.getUTCDate()} ${months[end.getUTCMonth()]} ${end.getUTCFullYear()}`
    case 'lastmonth':
      end.setUTCDate(1)
      end.setUTCDate(end.getUTCDate()-1)
      start.setUTCDate(1)
      start.setUTCDate(start.getUTCDate()-1)
      start.setUTCDate(1)
      return `${start.getUTCDate()} ${months[start.getUTCMonth()]} ${start.getUTCFullYear()} through ${end.getUTCDate()} ${months[end.getUTCMonth()]} ${end.getUTCFullYear()}`
    case '6d':
        start.setUTCDate(start.getUTCDate()-6)
        return `${start.getUTCDate()} ${months[start.getUTCMonth()]} ${start.getUTCFullYear()} through now`
    case '29d':
      start.setUTCDate(start.getUTCDate()-29)
      return `${start.getUTCDate()} ${months[start.getUTCMonth()]} ${start.getUTCFullYear()} through now`
    case '59d':
      start.setUTCDate(start.getUTCDate()-59)
      return `${start.getUTCDate()} ${months[start.getUTCMonth()]} ${start.getUTCFullYear()} through now`
    case '89d':
      start.setUTCDate(start.getUTCDate()-89)
      return `${start.getUTCDate()} ${months[start.getUTCMonth()]} ${start.getUTCFullYear()} through now`
  }

  const splitDates = window.split(",")
  if (checkCustomWindow(window) && splitDates.length > 1) {
    let s = splitDates[0].split(/\D+/).slice(0, 3)
    let e = splitDates[1].split(/\D+/).slice(0, 3)
    if (s.length === 3 && e.length === 3) {
      start.setUTCFullYear(s[0], s[1]-1, s[2])
      end.setUTCFullYear(e[0], e[1]-1, e[2])
      if (start === end) {
        return `${start.getUTCDate()} ${months[start.getUTCMonth()]} ${start.getUTCFullYear()}`
      } else {
        return `${start.getUTCDate()} ${months[start.getUTCMonth()]} ${start.getUTCFullYear()} through ${end.getUTCDate()} ${months[end.getUTCMonth()]} ${end.getUTCFullYear()}`
      }
    }
  }
  return null
}

export function bytesToString(bytes) {
  const ei = Math.pow(1024, 6)
  if (bytes >= ei) {
    return `${round(bytes/ei, 1)} EiB`
  }
  const pi = Math.pow(1024, 5)
  if (bytes >= pi) {
    return `${round(bytes/pi, 1)} PiB`
  }
  const ti = Math.pow(1024, 4)
  if (bytes >= ti) {
    return `${round(bytes/ti, 1)} TiB`
  }
  const gi = Math.pow(1024, 3)
  if (bytes >= gi) {
    return `${round(bytes/gi, 1)} GiB`
  }
  const mi = Math.pow(1024, 2)
  if (bytes >= mi) {
    return `${round(bytes/mi, 1)} MiB`
  }
  const ki = Math.pow(1024, 1)
  if (bytes >= ki) {
    return `${round(bytes/ki, 1)} KiB`
  }

  return `${round(bytes, 1)} B`
}

const currencyLocale = "en-US"

export function toCurrency(amount, currency, precision) {
  if (typeof amount !== "number") {
    console.warn(`Tried to convert "${amount}" to currency, but it is not a number`)
    return ""
  }

  if (currency === undefined || currency === "") {
    currency = "USD"
  }

  const opts = {
    style: "currency",
    currency: currency,

  }

  if (typeof precision === "number") {
    opts.minimumFractionDigits = precision
    opts.maximumFractionDigits = precision
  }

  return amount.toLocaleString(currencyLocale, opts);
}

export function checkCustomWindow(window) {
  // Example ISO interval string: 2020-12-02T00:00:00Z,2020-12-03T23:59:59Z
  const customDateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z,\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/
  return customDateRegex.test(window)
}



export default {
  rangeToCumulative,
  cumulativeToTotals,
  toVerboseTimeRange,
  bytesToString,
  toCurrency,
  checkCustomWindow,
}
