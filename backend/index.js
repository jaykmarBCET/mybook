import { httpServer } from "./socket.js";


httpServer.listen(process.env.PORT||3000,'0.0.0.0',()=>{
    console.log("Server running")
})