import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';
import axios from 'axios';

import TokenContext from '../../contexts/TokenContext';


import { Container, Form, Input, InputBox, Button} from './style';

export default function TransactionForm({transactionType}) {
    const [transactionData, setTransactionData] = useState({
        value: "",
        description: "",
        type: transactionType
    });
    let trueValue = 0
    const [isDisable, setIsDisable] = useState("enabled");
    const [isFilled, setIsFilled] = useState("");
    const navigate = useNavigate();
    const { token } = useContext(TokenContext);

    async function handleNewExit(e) {
        e.preventDefault();
        setIsDisable("disabled");
        let transaction = transactionData;
        if(transactionType === "positive"){
            if(transaction.value < 0){
                transaction.value = transaction.value * -1
            }
        } else {
            if(transaction.value > 0){
                transaction.value = transaction.value * -1
            }
        }

        
        console.log(transaction.value)
        const promisse = axios.post("http://localhost:5000/wallet/exit", {...transaction, value: Number(transaction.value)}, token)
        promisse.then((res) => {
            setIsDisable("enabled")
            navigate('/wallet')
        })
        promisse.catch((error) => {
            setIsDisable("enabled")
        })
        setIsDisable("enabled")
    };

    function handleInput(e) {
        setTransactionData({ ...transactionData, [e.target.name]: e.target.value });
    };


    function cancelTransaction(){
        let answer = true
        if(transactionData.value.length !== 0 || transactionData.description.length !== 0){
           answer = window.confirm('Tem certeza que deseja cancelar a transação?');
        }
        if(answer){
            navigate('/wallet');
        }
    }

    return (
        <Container className={`transactionScreen ${isDisable}`}>
            <Form onSubmit={handleNewExit}>
                <InputBox>
                    <Input
                        haveValue={transactionData}
                        type="number"
                        placeholder="Valor"
                        id="valueInput"
                        value={transactionData.value}
                        name="value"
                        onChange={handleInput}
                    />
                </InputBox>
                <Input
                    type="description"
                    placeholder="Descrição"
                    id="descriptionInput"
                    value={transactionData.description}
                    name="description"
                    onChange={handleInput}
                />
                <Button type="submit">{
                    isDisable !== "disabled"
                        ? transactionType !== 'Exit'
                            ? <h2>Salvar entrada</h2>
                            : <h2>Salvar saída</h2>
                        : <ThreeDots
                            height="20"
                            width="70"
                            color="#FFFFFF"
                            ariaLabel='loading'
                        />
                }</Button>
            </Form>
            <Button onClick={cancelTransaction}>
                    <h2>Cancelar</h2>
            </Button>
        </Container>
    )
}
