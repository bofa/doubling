import { round } from 'mathjs'
import { DateTime } from 'luxon' 
import { useEffect, useState } from 'react'
import { Classes, FormGroup, HTMLTable } from '@blueprintjs/core'
import { DateInput3 } from '@blueprintjs/datetime2'

import sv from "date-fns/locale/sv"

import 'normalize.css'
import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css"
import "@blueprintjs/select/lib/css/blueprint-select.css"
import "@blueprintjs/datetime2/lib/css/blueprint-datetime2.css"
import './App.css'

const STORAGE_KEY = 'birthdate'

function App() {
  const [birthDate, setBirthDate] = useState(localStorage.getItem(STORAGE_KEY)
    ? DateTime.fromISO(localStorage.getItem(STORAGE_KEY)!)
    : DateTime.now().endOf('day')
  )

  useEffect(() => {
    const birthDateString = birthDate.toISO()
    if (birthDateString) {
      localStorage.setItem(STORAGE_KEY, birthDateString)
    }
  }, [birthDate])

  const doublings = Array(17).fill(0)
    .map((_, i) => i < 1 ? 0 : 2**(i-1))
    .map(days => birthDate.plus({ days }))
    .map((doubleDate, i) => [
      i > 1 ? i-1 : '',
      i < 1 ? 0 : 2**(i-1),
      round(doubleDate.diff(birthDate, 'years').years, 2),
      doubleDate.toLocaleString(DateTime.DATE_FULL),
      doubleDate.diffNow(['years', 'months', 'days'])
        .toFormat(`y'y' M'm' d'd'`),
    ])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <FormGroup label="Birthdate">
          <DateInput3
            className={Classes.ELEVATION_1}
            locale={sv}
            reverseMonthAndYearMenus
            minDate={new Date('1900-01-01')}
            value={birthDate.toISO()}
            onChange={date => date ? setBirthDate(DateTime.fromISO(date)) : null}
          />
        </FormGroup>
        </div>
      <HTMLTable compact striped>
        <thead>
        <tr>
          <th></th>
          <th>Days old</th>
          <th>Years old</th>
          <th>Date</th>
          <th>In</th>
        </tr>
      </thead>
      <tbody>
      {doublings.map(row => 
        <tr>
          {row.map(cell => <td>{cell}</td>)}
        </tr>
      )}
      </tbody>
      {/* <tfoot>
        <tr>
          <td colSpan={3}>Total</td>
          <td>1408</td>
        </tr>
      </tfoot> */}
    </HTMLTable>
  </div>
  )
}

export default App
