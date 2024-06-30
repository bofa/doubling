import { round } from 'mathjs'
import { DateTime } from 'luxon' 
import { useEffect, useState } from 'react'
import { Classes, HTMLTable } from '@blueprintjs/core'
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
    : DateTime.now()
  )

  useEffect(() => {
    const birthDateString = birthDate.toISO()
    if (birthDateString) {
      localStorage.setItem(STORAGE_KEY, birthDateString)
    }
  }, [birthDate])

  console.log('birthDate', birthDate)

  const doublings = Array(16).fill(0)
    .map((_, i) => i < 1 ? 0 : 2**(i-1))
    .map(days => birthDate.plus({ days }))
    .map((doubleDate, i) => [
      i < 1 ? 0 : 2**(i-1),
      round(doubleDate.diff(birthDate, 'years').years, 2),
      doubleDate.toLocaleString(DateTime.DATE_HUGE),
      doubleDate.diffNow(['years', 'months', 'days'])
        .toFormat(`y 'years' M' months' d 'days'`),
    ])

  return (
    <div style={{ display: 'flex', gap: 20 }}>
      <div>
        {/* <DatePicker3
          locale={sv}
          reverseMonthAndYearMenus
          className={Classes.ELEVATION_1}
          value={birthDate.toJSDate()}
          onChange={date => date ? setBirthDate(DateTime.fromJSDate(date)) : null}
        /> */}
        <DateInput3
          locale={sv}
          reverseMonthAndYearMenus
          className={Classes.ELEVATION_1}
          value={birthDate.toISO()}
          onChange={date => date ? setBirthDate(DateTime.fromISO(date)) : null}
        />
      </div>
      <HTMLTable>
        <thead>
        <tr>
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
