import { badJSONResponse, successJSONResponse } from "@libs/api-gateway";
import { APIGatewayProxyEvent } from "aws-lambda";
import { fibonacci as fib } from "@ultirequiem/fibonacci";
import axios from "axios";


const fibonacci = async (event:APIGatewayProxyEvent) => {

    const host = event.headers.Host;
    const stage = event.requestContext.stage;
    const baseUrl = `http://${host}/${stage}`;

    const input = event.queryStringParameters?.number;

    if(!input){
        return badJSONResponse({
            message:'Invalid url'
        });
    }

    if(isNaN(+input)){
        return badJSONResponse({
            message:'Not a number'
        });
    }

    const number: number = +input;

    if(number < 1 || number > 150){
        return badJSONResponse({
            message:'Invalid value. The valid range is 1 - 150'
        });
    }

    const fibonacciNumber =  fib(number);

    let factorial: string = '';

    try {
        const {data} = await axios.get(`${baseUrl}/factorial?number=${number}`);
        factorial = data.factorial;
    } catch (error) {
        const {data, status} = error.response;
        if(status == 400){
            factorial = data.message;
        }
        else{
            factorial = 'Error occured on Factorial API';
        }
    }
    
    return successJSONResponse({
        input: number,
        factorial: factorial,
        fibonacci: fibonacciNumber
    });
};

export const main = fibonacci;