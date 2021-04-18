const express = require('express')
const mongodb = require('mongodb')
const mongoclient = mongodb.MongoClient
 const dbUrl= "" //paste your dp url here
const app = express()
app.use(express.json())

app.get('/mentor',(req,res)=>{
    mongoclient.connect(dbUrl,(err,clientInfo)=>{
        let db = clientInfo.db('myDatabase')
        db.collection("Mentor").find().toArray()
            .then(data=>{
                res.status(200).json(data)
            }) .catch(err=>{
                console.log(err)
            })
    })
})

app.post('/create-mentor',(req,res)=>{
    mongoclient.connect(dbUrl,(err,clientInfo)=>{
        let db = clientInfo.db('myDatabase')
        db.collection('Mentor').insertOne(req.body)
            .then(data=>{
                res.status(200).json({message:"record inserted"})
            }) .catch(err=>{
                console.log(err)
            })
    })
})


app.get('/student',(req,res)=>{
    mongoclient.connect(dbUrl,(err,clientInfo)=>{
        let db = clientInfo.db('myDatabase')
        db.collection("Student").find().toArray()
            .then(data=>{
                res.status(200).json(data)
            }) .catch(err=>{
                console.log(err)
            })
    })
})

app.post('/create-student',(req,res)=>{
    mongoclient.connect(dbUrl,(err,clientInfo)=>{
        let db = clientInfo.db('myDatabase')
        db.collection('Student').insertOne(req.body)
            .then(data=>{
                res.status(200).json({message:"record inserted"})
            }) .catch(err=>{
                console.log(err)
            })
    })
})

app.put('/update-mentor/:sid',(req,res)=>{
    mongoclient.connect(dbUrl,(err,clientInfo)=>{
        let db = clientInfo.db('myDatabase')
    db.collection('Mentor').findOne({$and:[{id:req.body.mentor_id},{student:{$exists:false,$eq:req.params.sid}}]}).then((savedmentor)=>{
            if(savedmentor)
            {
        db.collection('Student').findOneAndUpdate({id:req.params.sid},{$set:{mentor_id:req.body.mentor_id}})
        .then(data=>{
            db.collection('Mentor').findOneAndUpdate({id:req.body.mentor_id},{$push:{student:req.params.sid}})
                .then(item=>{
                    res.status(200).json({message:"record updated"})
                }) .catch(err=>{
                    res.status(404).json({error:"mentor not found"})
                })
            
        }) .catch(err=>{
            console.log(err)
        })
    }else{
        res.status(404).json({error:"mentor not found or student already exist"})
    }
    })
   
})
})

app.get('/allstudent/:mid',(req,res)=>{
            mongoclient.connect(dbUrl,(err,clientInfo)=>{
                let db  = clientInfo.db('myDatabase')
                db.collection('Mentor').findOne({id:req.params.mid}). then(data=>{
                    res.send(data.student)
                })
            })
})

app.listen(5000,()=>{
    console.log("server is running..")
})