export default class Time {
  constructor (type, options) {
    this.options = options
    this.data = []
    this.type = type
  }
  get type () {
    return this._type
  }
  set type (type) {
    this._type = type
    this.data = this[type]()
    if (this.isYear) {
      let date = this.getDate()
      this.data[1].values = this.getForData(this.options.monthFormat, date.maxMonth, date.minMonth)
      this.data[2].values = this.getForData(this.options.dateFormat, date.maxDate, date.minDate)
      this.setValueOnce()
    }
  }
  get values () {
    return this._values
  }
  set values (values) {
    this._values = values
    if (this.isYear && values[0]) {
      let {
        $maxMonth,
        $minMonth,
        $maxDate,
        $minDate
      } = values[0]
      let max = values[0].$moth[values[1].value]
      let min = 1
      this.data[1].values = this.getForData(this.options.monthFormat, $maxMonth, $minMonth)
      if ($maxDate && $maxMonth === values[1].value) {
        max = $maxDate
      }
      if ($minMonth === values[1].value) {
        min = $minDate
      }
      this.data[2].values = this.getForData(this.options.dateFormat, max, min)
    }
  }
  get isYear () {
    return this.type === 'datetime' || this.type === 'date'
  }
  setValueOnce () {
    this.getDefaultIndex({
      arr: this.data[1],
      api: 'getMonth'
    }, {
      arr: this.data[2],
      api: 'getDate'
    })
    this.setValueOnce = undefined
  }
  time () {
    const options = this.options
    const arr = [
      {
        values: []
      },
      {
        values: []
      }
    ]
    arr[0].values = this.getForData(this.options.hourFormat, options.maxHour, options.minHour)
    arr[1].values = this.getForData(this.options.minuteFormat, options.maxMinute, options.minMinute)
    this.getDefaultIndex({
      arr: arr[0],
      api: 'getHours'
    }, {
      arr: arr[1],
      api: 'getMinutes'
    })
    return arr
  }
  date () {
    const arr = [
      {
        values: []
      },
      {
        values: []
      },
      {
        values: []
      }
    ]
    const options = this.options
    let {
      minYear,
      minMonth,
      minDate,
      maxYear,
      maxMonth,
      maxDate
    } = this.getDate()
    for (let i = minYear; i <= maxYear; i++) {
      let obj = {
        value: i,
        name: options.yearFormat.replace(/({value})/g, i),
        $minMonth: 1,
        $maxMonth: 12,
        $minDate: 1,
        $moth: {}
      }
      if (i === minYear) {
        obj.$minMonth = minMonth
        obj.$minDate = minDate
      }
      if (i === maxYear) {
        obj.$maxMonth = maxMonth
        obj.$maxDate = maxDate
      }
      for (let j = 1; j <= 12; j++) {
        obj.$moth[j] = this.getMonth(i, j)
      }
      arr[0].values.push(obj)
    }
    this.getDefaultIndex({
      arr: arr[0],
      api: 'getFullYear'
    })
    return arr
  }
  datetime () {
    return this.date().concat(this.time())
  }
  getMonth (y, m) {
    if (m === 2) {
      return y % 4 ? 28 : 29
    }
    return Time.mObj[m]
  }
  getForData (format, max, min = 1) {
    const data = []
    for (let i = min; i <= max; i++) {
      data.push({
        value: i,
        name: format.replace(/({value})/g, i.toString().padStart(2, 0))
      })
    }
    return data
  }
  getDefaultIndex (...apis) {
    const date = this.options.defaultIndex
    if (date instanceof Date) {
      let val
      apis.map(obj => {
        val = date[obj.api]()
        if (obj.api === 'getMonth') {
          val++
        }
        let defaultIndex = obj.arr.values.findIndex(o => o.value === val)
        if (defaultIndex !== -1) {
          obj.arr.defaultIndex = defaultIndex
        }
      })
    }
  }
  getDate () {
    const options = this.options
    return {
      minYear: options.minDate.getFullYear(),
      minMonth: options.minDate.getMonth() + 1,
      minDate: options.minDate.getDate(),
      maxYear: options.maxDate.getFullYear(),
      maxMonth: options.maxDate.getMonth() + 1,
      maxDate: options.maxDate.getDate()
    }
  }
}
Time.mObj = {
  1: 31,
  3: 31,
  4: 30,
  5: 31,
  6: 30,
  7: 31,
  8: 31,
  9: 30,
  10: 31,
  11: 30,
  12: 31
}
