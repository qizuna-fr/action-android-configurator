class ObjectAttribute {
  'android:name': string

  constructor(label: string) {
    this['android:name'] = label
  }
}

export class ObjectPermission {
  '_attributes': ObjectAttribute

  constructor(label: string) {
    this._attributes = new ObjectAttribute(label)
  }
}

type ObjectOrPermission = ObjectPermission | Object

function isObjectPermission(obj: ObjectOrPermission): obj is ObjectPermission {
  if ((obj as ObjectPermission)._attributes['android:name']) {
    return true
  }
  return false
}

function isArrayOfObjectPermission(arr: ObjectOrPermission[]): arr is ObjectPermission[] {
  for (let i = 0, l = arr.length; i < l; i++) {
    const element = arr[i]
    if (!isObjectPermission(element)) {
      return false
    }
  }
  return true
}

export function merge(...args: Object[] | ObjectPermission[]): ObjectPermission[] {
  let result: ObjectPermission[] = []
  for (const arg of args) {
    if (arg) {
      if (Array.isArray(arg)) {
        if (isArrayOfObjectPermission(arg)) result = [...result, ...arg]
      } else {
        if (isObjectPermission(arg)) result.push(arg)
      }
    }
  }
  return result
}
