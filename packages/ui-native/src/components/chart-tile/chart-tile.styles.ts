import { css } from "lit";
import componentStyles from "../../styles/component.styles";

export default css`
    ${componentStyles}

    :host {
        display: grid;
        grid-template-rows: auto 1fr;
        margin-left: 10px;
        margin-right: 10px;
        margin-bottom: 10px;   
    }

    .header {
        display: grid;
        grid-template-columns: 1fr auto;
        margin-bottom: 5px;
        align-items: center;
        height: 42px;
        grid-row: 1;
    }

    .header-title {
      font-size: 1.2em;
      font-weight: bold;
      grid-column: 1;
    }

    .toolbar {
        grid-column: 2;
        display: block;
    }

    .chart-host {
        grid-row: 2;
        
    }
`;