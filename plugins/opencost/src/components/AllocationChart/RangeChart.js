import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { makeStyles } from '@material-ui/styles';
import { reverse } from 'lodash';
import { primary, greyscale, browns } from '../../constants/colors';
import { toCurrency } from '../../util';

const useStyles = makeStyles({
  tooltip: {
    borderRadius: 2,
    background: 'rgba(255, 255, 255, 0.95)',
    padding: 12,
  },
  tooltipLineItem: {
    fontSize: '1rem',
    margin: 0,
    marginBottom: 4,
    padding: 0,
  },
})

function toBarLabels(allocationRange) {
  let keyToFill = {}
  let p = 0
  let g = 0
  let b = 0

  for (const { idle } of allocationRange) {
    for (const allocation of idle) {
      const key = allocation.name
      if (keyToFill[key] === undefined) {
        // idle allocations are assigned grey
        keyToFill[key] = greyscale[g]
        g = (g+1) % greyscale.length
      }
    }
  }

  for (const { top } of allocationRange) {
    for (const allocation of top) {
      const key = allocation.name
      if (keyToFill[key] === undefined) {
        if (key === "__unallocated__") {
          // unallocated gets black (clean up)
          keyToFill[key] = "#212121"
        } else {
          // non-idle allocations get the next available color
          keyToFill[key] = primary[p]
          p = (p+1) % primary.length
        }
      }
    }
  }

  for (const { other } of allocationRange) {
    for (const allocation of other) {
      const key = allocation.name
      if (keyToFill[key] === undefined) {
        // idle allocations are assigned grey
        keyToFill[key] = browns[b]
        b = (b+1) % browns.length
      }
    }
  }

  let labels = []
  for (const key in keyToFill) {
    labels.push({
      dataKey: key,
      fill: keyToFill[key],
    })
  }

  return reverse(labels)
}

function toBar(datum) {
  const { top, other, idle } = datum
  const bar = {}

  for (const key in top) {
    const allocation = top[key]
    const start = new Date(allocation.start)
    bar.start = `${start.getUTCFullYear()}-${start.getUTCMonth()+1}-${start.getUTCDate()}`
    bar[allocation.name] = allocation.totalCost
  }

  for (const key in other) {
    const allocation = other[key]
    const start = new Date(allocation.start)
    bar.start = `${start.getUTCFullYear()}-${start.getUTCMonth()+1}-${start.getUTCDate()}`
    bar[allocation.name] = allocation.totalCost
  }

  for (const key in idle) {
    const allocation = idle[key]
    const start = new Date(allocation.start)
    bar.start = `${start.getUTCFullYear()}-${start.getUTCMonth()+1}-${start.getUTCDate()}`
    bar[allocation.name] = allocation.totalCost
  }

  return bar
}

const RangeChart = ({ data, currency, height }) => {
  const classes = useStyles()

  const barData = data.map(toBar)
  const barLabels = toBarLabels(data)

  const CustomTooltip = (params) => {
    const { active, payload } = params

    if (!payload || payload.length == 0) {
      return null
    }

    const total = payload.reduce((sum, item) => sum + item.value, 0.0)
    if (active) {
      return (
        <div className={classes.tooltip}>
          <p className={classes.tooltipLineItem} style={{ color: '#000000' }}>{`Total: ${toCurrency(total, currency)}`}</p>
          {reverse(payload).map((item, i) => (
            <p key={i} className={classes.tooltipLineItem} style={{ color: item.fill }}>{`${item.name}: ${toCurrency(item.value, currency)}`}</p>
          ))}
        </div>
      )
    }

    return null
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={barData}
        margin={{ top: 30, right: 30, left: 30, bottom: 12 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="start" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        {barLabels.map((barLabel, i) => <Bar key={i} dataKey={barLabel.dataKey} stackId="a" fill={barLabel.fill} />)}
      </BarChart>
    </ResponsiveContainer>
  )
}

export default RangeChart
