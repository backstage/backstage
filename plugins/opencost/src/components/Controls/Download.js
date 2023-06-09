import React from 'react'
import { get, forEach, reverse, round, sortBy } from 'lodash'
import ExportIcon from '@material-ui/icons/GetApp'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

const columns = [
  {
    head: "Name",
    prop: "name",
    currency: false,
  }, {
    head: "CPU",
    prop: "cpuCost",
    currency: true,
  }, {
    head: "GPU",
    prop: "gpuCost",
    currency: true,
  }, {
    head: "RAM",
    prop: "ramCost",
    currency: true,
  }, {
    head: "PV",
    prop: "pvCost",
    currency: true,
  }, {
    head: "Network",
    prop: "networkCost",
    currency: true,
  }, {
    head: "Shared",
    prop: "sharedCost",
    currency: true,
  }, {
    head: "Total",
    prop: "totalCost",
    currency: true,
  }
]

const toCSVLine = (datum) => {
  let cols = []

  forEach(columns, c => {
    if (c.currency) {
      cols.push(round(get(datum, c.prop, 0.0), 2))
    } else {
      cols.push(`"${get(datum, c.prop, "")}"`)
    }
  })

  return cols.join(',')
}

const DownloadControl = ({
  cumulativeData,
  title,
}) => {
  // downloadReport downloads a CSV of the cumulative allocation data
  function downloadReport() {
    // Build CSV
    const head = columns.map(c => c.head).join(',')
    const body = reverse(sortBy(cumulativeData, 'totalCost')).map(toCSVLine).join('\r\n')
    const csv = `${head}\r\n${body}`

    // Create download link
    const a = document.createElement("a")
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
    const filename = title.toLowerCase().replace(/\s/gi, '-')
    a.setAttribute("download", `${filename}-${Date.now()}.csv`)

    // Click the link
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <Tooltip title="Download CSV">
      <IconButton onClick={downloadReport}>
        <ExportIcon />
      </IconButton>
    </Tooltip>
  )
}

export default React.memo(DownloadControl)
