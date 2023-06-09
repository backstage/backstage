import React, { memo, useEffect, useState } from 'react';
import { forEach, get, reverse, round, sortBy } from 'lodash';
import CircularProgress from '@material-ui/core/CircularProgress';
import ClusterIcon from '@material-ui/icons/GroupWork';
import NodeIcon from '@material-ui/icons/Memory';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Warnings from './Warnings';
import AllocationService from '../services/allocation';
import { bytesToString, toCurrency } from '../util';

const Details = ({
  window,
  namespace,
  controllerKind,
  controller,
  pod,
  currency,
}) => {
  const [cluster, setCluster] = useState('')
  const [node, setNode] = useState('')

  const [fetch, setFetch] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])
  const [rows, setRows] = useState([])

  useEffect(() => {
    if (fetch) {
      setCluster('')
      setNode('')
      fetchData()
    }
  }, [fetch])

  async function fetchData() {
    setLoading(true)
    setErrors([])

    try {
      const filters = []

      if (cluster) {
        filters.push({
          property: "cluster",
          value: cluster,
        })
      }

      if (node) {
        filters.push({
          property: "node",
          value: node,
        })
      }

      if (namespace) {
        filters.push({
          property: "namespace",
          value: namespace,
        })
      }

      if (controllerKind) {
        filters.push({
          property: "controllerKind",
          value: controllerKind,
        })
      }

      if (controller) {
        filters.push({
          property: "controller",
          value: controller,
        })
      }

      if (pod) {
        filters.push({
          property: "pod",
          value: pod,
        })
      }

      const resp = await AllocationService.fetchAllocation(window, '', { accumulate: true })

      let data = []
      forEach(resp.data[0], (datum) => {
        if (datum.name === "__idle__") {
          return
        }

        if (!cluster) {
          setCluster(get(datum, 'properties.cluster', ''))
        }

        if (!node) {
          setNode(get(datum, 'properties.node', ''))
        }

        // TODO can we get pod, container back in properties?
        const names = datum.name.split("/")
        datum.pod = names[names.length-2]
        datum.container = names[names.length-1]

        datum.hours = round(get(datum, 'minutes', 0.0) / 60.0, 2)

        if (datum.hours > 0) {
          datum.cpu = round(get(datum, 'cpuCoreHours', 0.0) / datum.hours, 2)
          datum.cpuCostPerCoreHr = datum.cpuCost / (datum.cpu * datum.hours)
          if (datum.cpu === 0) {
            datum.cpuCostPerCoreHr = 0.0
          }

          datum.ram = round(get(datum, 'ramByteHours', 0.0) / datum.hours, 2)
          const ramGiB = datum.ram / 1024 / 1024 / 1024
          datum.ramCostPerGiBHr = datum.ramCost / (ramGiB * datum.hours)
          if (ramGiB === 0) {
            datum.ramCostPerGiBHr = 0.0
          }
        } else {
          datum.cpu = 0.0
          datum.cpuCostPerCoreHr = 0.0
          datum.ram = 0.0
          datum.ramCostPerGiBHr = 0.0
        }

        data.push(datum)
      })

      data = reverse(sortBy(data, 'totalCost'))

      setRows(data)
    } catch (e) {
      console.warn(`Error fetching details for (${controllerKind}, ${controller}):`, e)
      setErrors([{
        primary: "Error fetching details",
        secondary: `Tried fetching details for: ${namespace}, ${controllerKind}, ${controller}, ${pod}`,
      }])
    }

    setLoading(false)
    setFetch(false)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ paddingTop: 100, paddingBottom: 100 }}>
          <CircularProgress />
        </div>
      </div>
    )
  }

  return (
    <div>

      {!loading && errors.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <Warnings warnings={errors} />
        </div>
      )}

      <List>
        {cluster && (
          <ListItem>
            <ListItemIcon>
              <ClusterIcon />
            </ListItemIcon>
            <ListItemText primary={cluster} />
          </ListItem>
        )}
        {node && (
        <ListItem>
          <ListItemIcon>
            <NodeIcon />
          </ListItemIcon>
          <ListItemText primary={node} />
        </ListItem>
        )}
      </List>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left" component="th" scope="row" width={200}>Container</TableCell>
              <TableCell align="right" component="th" scope="row">Hours</TableCell>
              <TableCell align="right" component="th" scope="row">CPU</TableCell>
              <TableCell align="right" component="th" scope="row">$/(CPU*Hr)</TableCell>
              <TableCell align="right" component="th" scope="row">CPU cost</TableCell>
              <TableCell align="right" component="th" scope="row">RAM</TableCell>
              <TableCell align="right" component="th" scope="row">$/(GiB*Hr)</TableCell>
              <TableCell align="right" component="th" scope="row">RAM cost</TableCell>
              <TableCell align="right" component="th" scope="row">Total cost</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i} hover>
                <TableCell align="left" component="th" scope="row" width={200}>{row.container}</TableCell>
                <TableCell align="right" component="th" scope="row">{row.hours}</TableCell>
                <TableCell align="right" component="th" scope="row">{row.cpu}</TableCell>
                <TableCell align="right" component="th" scope="row">{toCurrency(row.cpuCostPerCoreHr, currency, 5)}</TableCell>
                <TableCell align="right" component="th" scope="row">{toCurrency(row.cpuCost, currency, 3)}</TableCell>
                <TableCell align="right" component="th" scope="row">{bytesToString(row.ram)}</TableCell>
                <TableCell align="right" component="th" scope="row">{toCurrency(row.ramCostPerGiBHr, currency, 5)}</TableCell>
                <TableCell align="right" component="th" scope="row">{toCurrency(row.ramCost, currency, 3)}</TableCell>
                <TableCell align="right" component="th" scope="row">{toCurrency(row.totalCost, currency, 3)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default memo(Details)
