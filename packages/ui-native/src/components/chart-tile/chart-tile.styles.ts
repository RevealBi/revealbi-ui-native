import { css } from "lit";
import componentStyles from "../../styles/component.styles";

export default css`
    ${componentStyles}

    :host {

    }

    .chart-tile-container {
        height: 100%;
    }

    .header-title {
      font-size: 1.2em;
      font-weight: bold;
      border-bottom: 1px solid #ddd;
      padding-bottom: 5px;
      margin-bottom: 10px;
      height: 30px;
    }

    .chart-host {
        height: calc(100% - 40px)
    }
`;