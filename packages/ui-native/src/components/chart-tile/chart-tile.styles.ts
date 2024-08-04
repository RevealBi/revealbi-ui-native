import { css } from "lit";
import componentStyles from "../../styles/component.styles";

export default css`
    ${componentStyles}

    :host {
    }

    .chart-tile-container {
        height: 100%;
        margin-left: 10px;
        margin-right: 10px;
        margin-bottom: 10px;        
    }

    .header {
        display: grid;
        grid-template-columns: 1fr auto auto;
        margin-bottom: 5px;
        align-items: center;
        height: 42px;
    }

    .header-title {
      font-size: 1.2em;
      font-weight: bold;
      grid-column: 1;
    }

    .toolbar {
        background-color: transparent;
        display: block;
        grid-column: 2 / 3;
    }

    .chart-host {
        height: calc(100% - 40px)
    }
`;