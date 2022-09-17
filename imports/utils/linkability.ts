import { useLocation, createSearchParams } from "react-router-dom";

interface startParams {
  start: Date,
  end: Date,
  sample: number,
  visible: boolean[]
}

function loadParamsOnStartup(): Partial<startParams> {
  const params = ['start', 'end', 'sample', 'visible'];
  const location = useLocation();
  const urlParams = createSearchParams(location.search);

  let loadParams: Partial<startParams> = {};

  params.forEach(param => {
    const queryResult = urlParams.get(param);
    switch (param) {
      case 'start':
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