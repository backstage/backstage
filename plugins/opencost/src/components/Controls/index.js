import React from 'react'
import DownloadControl from './Download'
import EditControl from './Edit'

const Controls = ({
  windowOptions,
  window,
  setWindow,
  aggregationOptions,
  aggregateBy,
  setAggregateBy,
  accumulateOptions,
  accumulate,
  setAccumulate,
  title,
  cumulativeData,
  currency,
  currencyOptions,
  setCurrency,
}) => {

  return (
    <div>
      <EditControl
        windowOptions={windowOptions}
        window={window}
        setWindow={setWindow}
        aggregationOptions={aggregationOptions}
        aggregateBy={aggregateBy}
        setAggregateBy={setAggregateBy}
        accumulateOptions={accumulateOptions}
        accumulate={accumulate}
        setAccumulate={setAccumulate}
        currency={currency}
        currencyOptions={currencyOptions}
        setCurrency={setCurrency}
      />
      <DownloadControl
        cumulativeData={cumulativeData}
        title={title}
      />
    </div>
  )
}

export default React.memo(Controls)
