const express=require("express");
const users=require("./MOCK_DATA.json")
const app=express();
const PORT=8000;
const fs=require("fs");
//middleware-plugin 
app.use(express.urlencoded({extended: false}))

// app.use((req,res,next)=>{
//     console.log("hello from middleware 1");
//     //return res.json({mgs:"hello from middleware 1"});
//     next();
// });

app.use((req, res, next)=>{
    fs.appendFile('log.txt',`${Date.now()}:${req.methad}:${req.path}\n`,(err, data)=>{
        next();
    });
})

app.use((req,res,next)=>{
    console.log("hello from middleware 2");
    return res.end("hello from middleware 2");
    next();
});
app.get('/users',(req,res)=>{
    const html=`
    <ul>
    ${users.map((user)=>`<li>${user.first_name}</li>`).join(" ")}
    </ul>
    `
    res.send(html);
})
app.get('/api/users',(req,res)=>{
    return res.json(users);
});

app.get('/api/users/:id',(req,res)=>{
    const id=Number(req.params.id);
    const user=users.find((user)=>user.id===id);
    return res.json(user);
})

// app.post("api/users",(req,res)=>{
//     return res.json({status:"pending"});
// })


app.patch("/api/users/:id",(req,res)=>{
    return res.json({status:"pending"});
})


app.delete("/api/users/:id",(req,res)=>{
    return res.json({status:"pending"});
})

app.route("/api/users/:id").get((req,res)=>{
    const id=Number(req.params.id);
    const user=users.find((user)=>user.id===id);
    return res.json(user);
}).patch((req,res)=>{
    return res.json({status:"pending"});
    })
    .delete((req,res)=>{
        return res.json({status:"pending"});
    })

    app.post("/api/users",(req,res)=>{
        const body=req.body;
        users.push({id:users.length+1,...body});
        fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err,data)=>{
            return res.json({status:"success"});
        });
        
    })
    

app.listen(PORT,()=>console.log(`running on ${PORT} `));
