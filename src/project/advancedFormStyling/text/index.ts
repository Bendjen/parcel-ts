const htmlText =
`<!-- Help Input -->
<input placeholder="Placeholder Text" type="text" required />
<span>Help Text</span>

<!-- Required Input -->
<input type="text" required />
<span />

<!-- Optional Input -->
<input type="text" />
<span />

<!-- Disabled Input -->
<input type="text" disabled />
<span />

<!-- Read-only Input -->
<input type="text" value="read-only value" readonly />
<span />

<!-- Valid Input -->
<input type="email" required />
<span />

<!-- Range input -->
<input type="number" min="1" max="10" />
<span />

<!-- Checked Input -->
<input type="checkbox" name="checkbox" id="check-option-1" value="1" hidden />
<label for="check-option-1">Option 1</label>`

const cssText = 
`.placeholderInput {
    position: relative;
    display: inline-block;
    padding-top: 30px;
    span {
      color: #2eec96;
      position: absolute;
      top: 0;
      left: 0;
      opacity: 1;
      transform: translateY(0);
      transition: all 0.2s ease-out;
    }
    input:placeholder-shown + span {
      opacity: 0;
      transform: translateY(1rem);
    }
  }

  .requiredInput {
    padding-top: 30px;
    input:required + span::before {
      display: inline-block;
      margin-left: 10px;
      content: "*Required";
    }
  }
  .optionalInput {
    padding-top: 30px;
    input:optional + span::before {
      display: inline-block;
      margin-left: 10px;
      content: "Optional";
    }
  }

  .disabledInput {
    padding-top: 30px;
    input:disabled {
      border-color: rgb(84, 84, 84);
      background: transparent;
      color: rgb(84, 84, 84);
      cursor: not-allowed;
    }
  }

  .readyonlyInput {
    padding-top: 30px;
    input:read-only {
      border-color: rgb(84, 84, 84);
      background: transparent;
      color: rgb(84, 84, 84);
      cursor: not-allowed;
    }
  }

  .validInput {
    padding-top: 30px;
    input[type="email"]:valid,
    input[type="email"]:focus {
      border-color: #2eec96;
    }
    input[type="email"]:valid + span {
      color: #2eec96;
    }

    input[type="email"]:invalid {
      border-color: #f44336;
    }
    input[type="email"]:invalid + span::before {
      margin-left: 15px;
      display: inline-block;
      content: "email format wrong!";
      color: #f44336;
    }
  }

  .rangeInput {
    padding-top: 30px;
    input:out-of-range + span::before {
      margin-left: 15px;
      display: inline-block;
      content: "Out of range";
    }
  }

  .checkInput {
    padding-top: 30px;
    position: relative;
    label{
        position: relative;
        font-size: 20px;
        display: inline-block;
        padding-left: 30px;
    }
    input[type="checkbox"] + label {
      user-select: none;
    }
    input[type="checkbox"] + label::before {
      content: "";
      background-color: #e6e6e6;
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 24px;
      height: 24px;
    }
    input[type="checkbox"] {
      &:checked + label::before {
        transition: all 0.3s;
        background-color: #2eec96;
      }
      &:checked + label::after {
        transition: all 0.3s;
        display: block;
        position: absolute;
        bottom: 10px;
        left: 8px;
        width: 12px;
        height: 24px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
        content: "";
      }
    }
  }`



export default {htmlText,cssText}