import { css } from "lit";
import componentStyles from "../../styles/component.styles";

export default css`
    ${componentStyles}

    :host {
        display: grid;
        grid-template-rows: auto auto 1fr;
        margin-left: 10px;
        margin-right: 10px;
        margin-bottom: 10px;
        overflow: hidden;
    }

    .header {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        height: 40px;
        grid-row: 1;
    }

    .header-title {
      font-size: 1.2em;
      font-weight: bold;
      grid-column: 1;
    }

    .toolbar {
        grid-column: 2;
    }

    .legend {
        grid-row: 2;
        margin-bottom: 10px;
    }

    .chart-host {
        grid-row: 3;        
    }
`;