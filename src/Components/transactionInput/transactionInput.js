import React, { Component } from "react";
// react-bootstrap components
import Autosuggest from "react-autosuggest";
import { transaction } from "../../Services/apiService";

class TransactionInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      data: [],
    };
  }

  componentDidMount() {
    const handle = async () => {
      try {
        await transaction().then((result) => {
          if (result != null) {
            this.setState({ data: result.list });
          }
        });
      } catch (error) {
        console.log(error, "error en el componentDidMount");
      }
    };
    handle();
  }

  getSuggestions = (value) => {
    try {
      //Nos trae las sugerencias en base a data.
      const inputValue = value.trim().toLowerCase(); //Transforma texto en minusculas
      const inputLength = inputValue.length; //Me dice el largo de lo que ingreso
      return inputLength === 0
        ? []
        : this.state.data
            .filter(
              (
                name //Si es 0 no delvuevel nada sino devuelve todo lo q en data cumpla que se parezca a lo ingresado.
              ) => name.toLowerCase().slice(0, inputLength) === inputValue
            )
            .slice(0, 5);
    } catch (error) {
      console.log(error, "error en el getSuggestions");
      return [];
    }
  };

  renderSuggestion = (suggestion) => {
    return <div>{suggestion}</div>;
  };

  onSuggestionSelected = (event, { suggestion }) => {
    try {
      this.props.event(suggestion);
      this.setState({ input: suggestion });
    } catch (error) {
      console.log(error, "error en el onSuggestionSelected");
    }
  };

  handleInputChange = (event, { newValue }) => {
    try {
      this.setState({ input: newValue });
    } catch (error) {
      console.log(error, "error en el handleInputChange");
    }
  };

  render() {
    const { input } = this.state;

    const theme = {
      container: {
        position: "relative",
      },
      input: {
        marginLeft: "25%",
        width: "50%",
        padding: "1%",
        border: "1px solid #ddd",
        borderRadius: "4px",
        marginTop: "2%",
        marginBottom: input ? "0" : "2%",
      },
      suggestionsContainer: {
        marginLeft: "25%",
        display: input ? "block" : "none",
        width: "50%",
        border: input ? "0" : "1px solid #ddd",
        backgroundColor: "#fff",
        overflowY: "auto",
        marginBottom: "2%",
        borderRadius: "4px",
      },
      suggestionsList: {
        padding: "1%",
        listStyleType: "none",
      },
      suggestion: {
        padding: "1%",
        cursor: "pointer",
      },
      suggestionHighlighted: {
        backgroundColor: "#f4f4f4",
      },
    };

    return (
      <>
        <form onSubmit={this.handleSubmit}>
          <Autosuggest
            suggestions={this.getSuggestions(input)}
            onSuggestionsFetchRequested={() => {}}
            onSuggestionsClearRequested={() => {}}
            getSuggestionValue={(suggestion) => suggestion}
            renderSuggestion={this.renderSuggestion}
            inputProps={{
              placeholder: "Enter Transaction",
              value: input,
              onChange: this.handleInputChange,
            }}
            onSuggestionSelected={this.onSuggestionSelected}
            theme={theme}
          />
        </form>
      </>
    );
  }
}

export default TransactionInput;

/* 

  <InputGroup style={{ width: '50%'}} className="busTran">
						<Form.Control  style={{ padding: '2%'}}className="AddInput"
							placeholder="TRANSACTION"        			
						/>
						<Button variant="dark">
							Agregar
						</Button>
			</InputGroup>          

*/
