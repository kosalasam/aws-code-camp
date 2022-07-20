import { badJSONResponse, successJSONResponse } from "@libs/api-gateway";
import { APIGatewayProxyEvent } from "aws-lambda";

const factorial = async (event:APIGatewayProxyEvent ) => {
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

    if(number < 1 || number > 100){
        return badJSONResponse({
            message:'Invalid value. The valid range is 1 - 100'
        });
    }

    const factorialNumber = getFactorial(input);
    
    return successJSONResponse({
        input: input,
        factorial: factorialNumber
    });
};

const getFactorial = n => n <= 1 ? 1 : n * getFactorial(n - 1);

export const main = factorial;