import { css } from "lit";
import componentStyles from "../../styles/component.styles";

export default css`
    ${componentStyles}

    :host {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
      padding: 10px;
      height: 100%;
    }
      
    .header {
      grid-row: 1;
      font-size: var(--rv-font-size-2x-large);
      font-weight: bold;
      margin-bottom: 10px;
    }

    .layout {
      grid-column: 1;
      grid-row: 2;
    }
`;