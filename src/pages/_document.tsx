import Document, {Html, Head, Main, NextScript} from "next/document";

// <!-- essa tag preconnect deve estar logo apos o head e no final ela deve ser fechada com uma / -->


export default class MyDocument extends Document {
    render(){
        return(
            <Html>
                <Head>
                <link rel="preconnect" href="https://fonts.gstatic.com"/>  
                <link href="https://fonts.googleapis.com/css2?family=Inter&family=Lexend:wght@500;600&display=swap" rel="stylesheet"/>

                </Head>
                <body>
                    <Main/>
                    <NextScript/>
                </body>
            </Html>
        )
    }
}