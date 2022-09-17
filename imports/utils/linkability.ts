import { Location, createSearchParams, useSearchParams } from "react-router-dom";

export interface startParams {
  start: Date,
  end: Date,
  sample: number,
  visible: boolean[]
}

export type changedParam = keyof startParams | null

export function loadParamsOnStartup(urlParams: URLSearchParams): Partial<startParams> {
  const params = ['start', 'end', 'sample', 'visible'];

  let loadParams: Partial<startParams> = {};

  params.forEach(param => {
    const queryResult = urlParams.get(param);
    switch (param as keyof startParams) {
      case 'start':
        // console.log(new Date(queryResult ?? ''));
        queryResult !== null ? loadParams['start'] = new Date(queryResult) : void 0;
        break;
      case 'end':
        queryResult !== null ? loadParams['end'] = new Date(queryResult) : void 0;
        break;
      case 'sample':
        queryResult !== null ? loadParams['sample'] = Number(queryResult) : void 0;
        break;
      case 'visible':
        const visibleRooms: boolean[] = [];
        if (queryResult === null) {
          break;
        } else {
          for (let i = 0; i < 7; i++) {
            visibleRooms.push(queryResult[i] === '1')
          }
          loadParams['visible'] = visibleRooms;
          break;
        }
    }
  })

  return loadParams;
}

export function setAppParams(
  linkabilityReference: Readonly<startParams>,
  newAppParams: URLSearchParams,
  changedParam: changedParam,
  setChangedParam: (changedParam: changedParam) => void
): void {
  if (changedParam === null) {
    return void 0;
  }

  const key = changedParam;
  const value = linkabilityReference[changedParam];

  switch (key) {
    case 'start':
    case 'end':
      newAppParams.set(key, (value as Date).toISOString());
      break;
    case 'sample':
      newAppParams.set(key, String(value));
      break;
    case 'visible':
      const visibleStr: string =
        (value as boolean[]).map(visibleRoomState =>
          visibleRoomState ? '1' : '0').join('')
      newAppParams.set(key, visibleStr);
      break;
  }

  setChangedParam(null);
}