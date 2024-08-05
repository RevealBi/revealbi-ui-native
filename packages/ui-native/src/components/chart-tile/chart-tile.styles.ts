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
    :host([maximized]) .maximize-icon {
        transform: rotate(180deg);
    }

    .header {
        display: grid;
        grid-template-columns: 1fr auto auto;
        align-items: center;
        height: 40px;
        grid-row: 1;
    }

    .header-title {
      font-size: 1.2em;
      font-weight: bold;
      grid-column: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 100%; /* Ensure the title does not exceed the container */
    }

    .toolbar {
        grid-column: 2;
    }

    .legend {
        grid-row: 2;
        margin-bottom: 10px;
    }

    .maximize-button {
        grid-column: 3;
        background: rgba(255, 255, 255, 0.8);
        border: none;
        cursor: pointer;
        padding: 5px;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
    }
    .maximize-icon {
        width: 12px;
        height: 12px;
        display: inline-block;
        transform: rotate(15deg);
        border-right: 2px solid rgb(0, 0, 0);
        border-top: 2px solid rgb(0, 0, 0);
    }

    .chart-host {
        grid-row: 3;        
    }
`;