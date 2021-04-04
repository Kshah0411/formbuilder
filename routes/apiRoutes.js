const express = require('express')
const route = new express.Router()
var connection = require('../config/db')
const query = require('../config/query');
var dbName = "sys"


// route.get('/getforms',function(req,res){
//   operations.getFormDataP().then(data=>{
//     let arr = [];
//     let i=0;
//     // var data2 = data1.replace("\\","");
//     for (const { Examples } of data) {
//       arr[i] = Examples;
//       i++;
//     }
//     console.log(arr);
//     // for(var i = 0; i < data.length; ++i)
//     //   data[i] = data[i].replace(/(?:\r\n|\r|\n)/g, ' ');
//     // console.log(data);
//     res.send(arr)
//   })
// });

// route.post('/putforms',function(req,res){
//   console.log('i am in operations routes')
//   console.log(req.body.stringVal)
//   operations.putFormData(req.body.stringVal).then(data=>{
//     console.log(data);
//     res.send(data)
//   }).catch((err=>{
//     res.send(err)
//   }))
// });

// route.post("/createScreen", async (req,res) =>{
//   const conn = await connection().catch(e => {});
//   const result = await query(conn,"CREATE TABLE IF NOT EXISTS "+dbName+".`screen` (`Version` int NOT NULL,`OrgName` varchar(45) NOT NULL,`OrgID` varchar(45) NOT NULL,`ScreenName` varchar(45) NOT NULL,`ScreenID` varchar(45) NOT NULL,`TimeStamp` datetime NOT NULL,PRIMARY KEY (`OrgID`,`ScreenID`))")
//   .catch((err) => {res.status(400).send(err);})
//   res.json({ Message: 'Created Screen table' });
// });

// route.post("/postScreen", async (req, res) => {
//   //console.log(req.body)
//   const {version,orgName,orgID,screenName,screenID} = req.body;
//   const conn = await connection().catch(e => { });
//   const result = await query(conn, "INSERT INTO "+dbName+".`screen` VALUES (?, ?, ?, ?, ?, now())",
//   [version, orgName, orgID, screenName, screenID, new Date()]).catch((err) => { res.status(400).send(err); })
//   res.json({ Message: 'Received Screen Data' });
// });


// route.post("/createMeta", async (req, res) => {
//   const {formName} = req.body;
//   const conn = await connection().catch(e => { });
//   const result = await query(conn, "CREATE TABLE IF NOT EXISTS "+dbName+".`"+formName+"` (`FormVersion` varchar(40) NOT NULL,`FormID` varchar(45) NOT NULL,`FormJSON` JSON NOT NULL,`ScreenID` varchar(45) NOT NULL,PRIMARY KEY (FormID))")
//   .catch((err) => { res.status(400).send(err); })
//   res.json({ Message: 'Created Meta Form table' });
// });

// route.post("/postMeta", async (req, res) => {
//   const {formName,formVersion,formID, formJSON, screenID} = req.body;
//   const conn = await connection().catch(e => { });
//   const result = await query(conn, "INSERT INTO "+dbName+".`"+formName+"` VALUES (?, ?, ?, ?)",
//   [formVersion,formID,formJSON,screenID]).catch((err) => { res.status(400).send(err); })
//   res.json({ Message: 'Received Meta Form Data' });
// });

// route.put("/putMeta", async (req, res) => {
//   const {dbName,formName, formID,formJSON} = req.body;
//   const conn = await connection().catch(e => { });
//   const qu = "UPDATE "+dbName+".`"+formName+"` SET FormJSON = '"+formJSON+"' where FormID='"+formID+"';"
//   //console.log(qu);
//   const result = await query(conn, qu)
//   .catch((err) => { res.status(400).json(err); })
//   res.json({Message:"Updated Meta Form"});
// });

// route.get("/getMeta/:dbName&:form&:screen", async (req, res) => {
//   const {dbName,form,screen} = req.params;
//   const conn = await connection().catch(e => { });
//   const qu="Select FormJSON from "+dbName+".`"+form+"` where ScreenID = \""+screen+"\"";
//   //console.log(qu);
//   const result = await query(conn, qu)
//   .catch((err) => { res.status(400).json(err); })
//   res.send(result);
// });




//------------- NEW APIs for NEW Schema -----------------------------------

route.post("/CreateDB", async (req,res) =>{
  const { orgName } = req.body;
  dbName = orgName;
  const conn = await connection().catch(e => {});
  const result = await query(conn, "Create Database "+orgName)
  .catch((err) => {res.status(400).send(err);})
  res.json({ Message: 'Created Database' });
});

route.post("/createScreen", async (req,res) =>{
    const conn = await connection().catch(e => {});
    const result = await query(conn,"CREATE TABLE IF NOT EXISTS "+dbName+".`screen` (`ScreenID` varchar(40) NOT NULL,`ScreenName` varchar(45) NOT NULL,`Date` datetime NOT NULL,`CreatedBy` varchar(45) NOT NULL,`Display` varchar(20) NOT NULL,`Modified` varchar(20) NOT NULL,`OrderNo` int(11) NOT NULL, PRIMARY KEY (`ScreenID`))")
    .catch((err) => {res.status(400).send(err);})
    res.json({ Message: 'Created Screen table' });
});
  
route.post("/setScreenOrder", async (req, res) => {
  console.log(req.body)
  const {OrderNo,ScreenID} = req.body;
  const conn = await connection().catch(e => { });
  const result = await query(conn, "UPDATE "+dbName+".`screen` SET OrderNo = \""+OrderNo+"\" Where ScreenID = \""+ScreenID+"\"")
  .catch((err) => { res.status(400).send(err); })
  res.json({ Message: 'Updated in Screen Table' });
});

route.post("/postScreen", async (req, res) => {
    console.log(req.body)
    const {ScreenID,ScreenName,CreatedBy, Display,Modified} = req.body;
    const conn = await connection().catch(e => { });
    const result = await query(conn, "INSERT INTO "+dbName+".`screen` VALUES (?,?,now(),?,?,?)",
    [ScreenID, ScreenName, CreatedBy, Display, Modified]).catch((err) => { res.status(400).send(err); })
    res.json({ Message: 'Inserted in Screen Table' });
});

route.get("/getScreens", async (req,res) => {	
  const conn = await connection().catch(e => {});	
  const results = await query(conn,"SELECT * FROM "+dbName+".screen where Display = 'Yes' Order by OrderNo, Date").	
  catch((err) => { res.status(400).json(err);})	
  res.status(200).send(results);	
});

route.post("/createScreenForm", async (req, res) => {
    const conn = await connection().catch(e => { });
    const result = await query(conn, "CREATE TABLE IF NOT EXISTS "+dbName+".`ScreenForm` (`ScreenFormID` varchar(30) NOT NULL,`ScreenID` varchar(30) NOT NULL,`FormName` varchar(30) NOT NULL,`FormDesc` varchar(30) NOT NULL)")
    .catch((err) => { res.status(400).send(err); })
    res.json({ Message: 'Created ScreenForm table' });
});
  
route.post("/postScreenForm", async (req, res) => {
    //console.log(req.body)
    const {ScreenFormID,ScreenID, FormName,FormDesc} = req.body;
    const conn = await connection().catch(e => { });
    const result = await query(conn, "INSERT INTO "+dbName+".`ScreenForm` VALUES(?,?,?,?)",[ScreenFormID,ScreenID,FormName,FormDesc])
    .catch((err) => { res.status(400).send(err); })
    res.json({ Message: 'Inserted in ScreenForm table' });
});
  
route.post("/getScreenForms", async (req,res) => {
  const {ScreenID} = req.body;
  const conn = await connection().catch(e => {});
  const results = await query(conn,"SELECT * FROM "+dbName+".ScreenForm where ScreenID like \""+ScreenID+"\"").
  catch((err) => { res.status(400).json(err);})
  res.status(200).send(results);
});



route.post("/createScreenFormMod", async (req, res) => {
    const conn = await connection().catch(e => { });
    const result = await query(conn, "CREATE TABLE IF NOT EXISTS "+dbName+".`ScreenFormModify` (`ScreenID` varchar(30) NOT NULL,`FormIDAdded` varchar(30) NOT NULL,`FormIDDeleted` varchar(30) NOT NULL,`ScreenIDOriginal` varchar(30) NOT NULL)")
    .catch((err) => { res.status(400).send(err); })
    res.json({ Message: 'Created ScreenForm Modification table' });
});
  
route.post("/postScreenFormMod", async (req, res) => {
    const {ScreenID,FormIDAdded, FormIDDeleted,ScreenIDOriginal} = req.body;
    const conn = await connection().catch(e => { });
    const result = await query(conn, "INSERT INTO "+dbName+".`ScreenFormModify` VALUES(?,?,?,?)",[ScreenID,FormIDAdded,FormIDDeleted,ScreenIDOriginal])
    .catch((err) => { res.status(400).send(err); })
    res.json({ Message: 'Inserted in ScreenForm Modification table' });
});

route.post("/createForm", async (req, res) => {
  const conn = await connection().catch(e => { });
  const result = await query(conn, "CREATE TABLE IF NOT EXISTS "+dbName+".`Form` (`FormID` varchar(30) NOT NULL,`FormName` varchar(40) NOT NULL,`Date` datetime NOT NULL,`AdminID` varchar(45) NOT NULL,`Display` varchar(20) NOT NULL,`Modified` varchar(20) NOT NULL, PRIMARY KEY (FormID))")
  .catch((err) => { res.status(400).send(err); })
  res.json({ Message: 'Created Form table' });
});

route.post("/postForm", async (req, res) => {
  const {FormID,FormName,AdminID,Display,Modified} = req.body;
  const conn = await connection().catch(e => { });
  const result = await query(conn, "INSERT INTO "+dbName+".`Form` VALUES(?,?,now(),?,?,?)",
  [FormID, FormName, AdminID, Display, Modified])
  .catch((err) => { res.status(400).send(err); })
  res.json({ Message: 'Inserted in Form table' });
});

//Modify to put yes
route.post("/modifyForm", async (req, res) => {
  const {FormID,Modified} = req.body;
  const conn = await connection().catch(e => { });
  const result = await query(conn, "UPDATE "+dbName+".`Form` SET Modified = \""+Modified+"\" Where FormID = \""+FormID+"\"")
  .catch((err) => { res.status(400).send(err); })
  res.json({ Message: 'Modified in Form table' });
});

//All forms which are not modified from the given screen
route.post("/getForm", async (req,res) => {
  const {ScreenID} = req.body;
  const conn = await connection().catch(e => {});
  const results = await query(conn,"SELECT * from "+dbName+".screenform s join "+dbName+".form f on s.ScreenFormID = f.FormID where ScreenID = \""+ScreenID+"\" and Modified = \"No\"").
  catch((err) => { res.status(400).json(err);})
  res.status(200).send(results);
});


route.post("/createFormField", async (req, res) => {
  const conn = await connection().catch(e => { });
  const result = await query(conn, "CREATE TABLE IF NOT EXISTS "+dbName+".`FormField` (`FieldID` varchar(30) NOT NULL,`Label` varchar(30) NOT NULL, `FormID` varchar(30) NOT NULL,`FieldJSON` json NOT NULL, PRIMARY KEY (`FieldID`))")
  .catch((err) => { res.status(400).send(err); })
  res.json({ Message: 'Created FormField table' });
});

route.post("/postFormField", async (req, res) => {
  const {FieldID, Label,FormID, FieldJSON,Row} = req.body;
  const conn = await connection().catch(e => { });
  const result = await query(conn, "INSERT INTO "+dbName+".`FormField` VALUES(?,?,?,"+Row+")",[FieldID,FormID,FieldJSON])
  .catch((err) => { res.status(400).send(err); })
  res.json({ Message: 'Inserted in FormField table' });
});

route.post("/getFormFields", async (req,res) => {
  const {FormID} = req.body;
  const conn = await connection().catch(e => {});
  const results = await query(conn,"Select * from "+dbName+".FormField where FormID like \""+FormID+"\" ORDER BY Row").
  catch((err) => { res.status(400).json(err);})
  res.status(200).send(results);
});

route.post("/updateFormField", async (req,res) => {
  const {FormID,FieldID,FieldJSON} = req.body;
  const conn = await connection().catch(e => {});
  const qu = "Update "+dbName+".FormField set FieldJSON = '" + FieldJSON + "' where FormID like \""+FormID+"\" and FieldID = \""+FieldID+"\"";
  //console.log(qu);
  const results = await query(conn,qu).
  catch((err) => { res.status(400).json(err);})
  res.status(200).send({Message:"Updated FormField"});
});


route.post("/createFormFieldMod", async (req, res) => {
  const conn = await connection().catch(e => { });
  const result = await query(conn, "CREATE TABLE IF NOT EXISTS "+dbName+".`FormFieldModify` (`FormID` varchar(30) NOT NULL,`FormFieldIDAdded` varchar(30) NOT NULL,`FormFieldIDDeleted` varchar(30) NOT NULL,`FormIDOriginal` varchar(30) NOT NULL)")
  .catch((err) => { res.status(400).send(err); })
  res.json({ Message: 'Created ScreenForm Modification table' });
});

route.post("/postFormFieldMod", async (req, res) => {
  const {FormID,FormFieldIDAdded, FormFieldIDDeleted,FormIDOriginal} = req.body;
  const conn = await connection().catch(e => { });
  const result = await query(conn, "INSERT INTO "+dbName+".`FormFieldModify` VALUES(?,?,?,?)",[FormID,FormFieldIDAdded,FormFieldIDDeleted,FormIDOriginal])
  .catch((err) => { res.status(400).send(err); })
  res.json({ Message: 'Inserted in ScreenForm Modification table' });
});

route.post("/createFormDSD", async (req, res) => {
  const conn = await connection().catch(e => { });
  const result = await query(conn, "CREATE TABLE IF NOT EXISTS "+dbName+".`Form_DSD` (`FormID` varchar(30) NOT NULL,`DSDName` varchar(30) NOT NULL, PRIMARY KEY (`FormID`, `DSDName`))")
  .catch((err) => { res.status(400).send(err); })
  res.json({ Message: 'Created Form DSD table' });
});

route.post("/postFormDSD", async (req, res) => {
  //console.log(req.body)
  const {FormID,DSDName} = req.body;
  const conn = await connection().catch(e => { });
  const result = await query(conn, "INSERT INTO "+dbName+".`Form_DSD` VALUES(?,?)",[FormID,DSDName])
  .catch((err) => { res.status(400).send(err); })
  res.json({ Message: 'Inserted in Form DSD table' });
});

route.post("/getFormDSD", async (req,res) => {
  const {FormID} = req.body;
  const conn = await connection().catch(e => {});
  const results = await query(conn,"Select * from "+dbName+".Form_DSD where FormID like \""+FormID+"\"").
  catch((err) => { res.status(400).json(err);})
  res.status(200).send(results);
});


route.post("/deleteFormID", async (req,res) => {
  const {FormID} = req.body;
  const conn = await connection().catch(e => {});
  const qu = "Delete from "+dbName+".Form where FormID like \""+FormID+"\"; Delete from "+dbName+".FormField where FormID like \""+FormID+"\"; Delete from "+dbName+".ScreenForm where ScreenFormID like \""+FormID+"\"; Delete from "+dbName+".Form_DSD where FormID like \""+FormID+"\";";
  //console.log(qu);
  const results = await query(conn,qu).
  catch((err) => { res.status(400).json(err);})
  res.json({Message:'Deleted all Form details'});
});


//----------------- Dynamic Table Creation

route.post("/createDynamicTable", async (req, res) => {
  const {TableName,Labels} = req.body;
  var qu = "CREATE TABLE IF NOT EXISTS "+dbName+".`"+TableName+"` (";
  for(var i=0;i<Labels.length;i++)
  {
    qu = qu+Labels[i]+" varchar(50) DEFAULT NULL,";
  }
  qu = qu.slice(0,-1)
  qu = qu+");";

  console.log(qu);
  const conn = await connection().catch(e => { });
  const result = await query(conn, qu)
  .catch((err) => { res.status(400).send(err); })
  res.status(200).json({ Message: 'Created Dynamic table' });
});


//Dynamic Table Insertion
route.post("/postDynamicTable", async (req, res) => {
  const {TableName,Labels,Values} = req.body;
  var qu = "INSERT INTO "+dbName+".`"+TableName+"` ( ";

  for(var i=0;i<Labels.length;i++)
  {
    qu = qu+Labels[i]+',';
  }
  qu = qu.slice(0,-1)
  qu = qu+") ";

  qu = qu + "VALUES(";
  for(var i=0;i<Values.length;i++)
  {
    qu = qu+'"'+Values[i]+'",';
  }
  qu = qu.slice(0,-1)
  qu = qu+");";

  console.log(qu);
  const conn = await connection().catch(e => { });
  const result = await query(conn, qu)
  .catch((err) => { res.status(400).send(err); })
  res.status(200).json({ Message: 'Inserted DynamicTable Data' });
});

route.post("/alterDynamicTable", async (req, res) => {
  const {TableName,Labels} = req.body;
  const conn = await connection().catch(e => { });
  const result = await query(conn, "Show columns from "+dbName+"."+TableName)
  .catch((err) => { res.status(400).json(err); })
  var existingCols = []
  result.map((obj)=>{existingCols.push(obj["Field"])})
  
  var qu = "Alter Table "+dbName+".`"+TableName+"` ";
  for(var i=0;i<Labels.length;i++)
  {
    if(!existingCols.includes(Labels[i]))
    {
      qu = qu + "Add "+Labels[i]+" varchar(50) DEFAULT NULL,";
    }
  }
  qu = qu.slice(0,-1);
  qu = qu + ";";

  console.log(qu);
  const ans = await query(conn, qu)
  .catch((err) => { res.status(400).json(err); })
  res.json({Message:"Altered Dynamic Table"});
});


// ------------   OLD APIs (Use them as needed)  ----------------------------------------------

// //Dynamic Table Creation
// route.post("/createForm", async (req, res) => {
//   const {formID,labels} = req.body;
//   var qu = "CREATE TABLE IF NOT EXISTS "+dbName+".`"+formID+"` (";
//   for(var i=0;i<labels.length;i++)
//   {
//     qu = qu+labels[i]+" varchar(50) DEFAULT NULL,";
//   }
//   qu = qu.slice(0,-1)
//   qu = qu+");";

//   //console.log(qu);
//   const conn = await connection().catch(e => { });
//   const result = await query(conn, qu)
//   .catch((err) => { res.status(400).send(err); })
//   res.status(200).json({ Message: 'Created Form table' });
// });


// //Dynamic Table Insertion
// route.post("/postForm", async (req, res) => {
//   //console.log(req.body)
//   const {dbName,formID,values,labels} = req.body;
//   var qu = "INSERT INTO "+dbName+".`"+formID+"` ( ";

//   for(var i=0;i<labels.length;i++)
//   {
//     qu = qu+labels[i]+',';
//   }
//   qu = qu.slice(0,-1)
//   qu = qu+") ";

//   qu = qu + "VALUES(";
//   for(var i=0;i<values.length;i++)
//   {
//     qu = qu+'"'+values[i]+'",';
//   }
//   qu = qu.slice(0,-1)
//   qu = qu+");";

//   console.log(qu);
//   const conn = await connection().catch(e => { });
//   const result = await query(conn, qu)
//   .catch((err) => { res.status(400).send(err); })
//   res.status(200).json({ Message: 'Posted Form Data' });
// });


// route.post("/putCols", async (req, res) => {
//   const {dbName,formID,labels} = req.body;
//   const conn = await connection().catch(e => { });
//   const result = await query(conn, "Show columns from "+dbName+"."+formID)
//   .catch((err) => { res.status(400).json(err); })
//   var existingCols = []
//   result.map((obj)=>{existingCols.push(obj["Field"])})
  
//   var qu = "Alter Table "+dbName+"."+formID+" ";
//   for(var i=0;i<labels.length;i++)
//   {
//     if(!existingCols.includes(labels[i]))
//     {
//       qu = qu + "Add "+labels[i]+" varchar(50) DEFAULT NULL,";
//     }
//   }
//   qu = qu.slice(0,-1);
//   qu = qu + ";";

//   console.log(qu);
//   const ans = await query(conn, qu)
//   .catch((err) => { res.status(400).json(err); })
//   res.json({Message:"Altered Table"});
// });


// route.get("/getform", async (req,res) => {
//   const conn = await connection().catch(e => {});
//   const results = await query(conn,'SELECT formJSON FROM form').
//   catch((err) => { res.status(400).json(err);})
//   res.status(200).send(results);
// });

// route.post("/postform", async (req,res) =>{
//   //console.log(req.body)
//   const { id,formJSON } = req.body;
//   const conn = await connection().catch(e => {});
//   const result = await query(conn, "INSERT INTO "+dbName+".`form` (id, formJSON) VALUES (?, ?)",
//   [id, formJSON]).catch((err) => {res.status(400).send(err);})
//   res.status(200).json({ Message: 'Got it' });
// });


route.post("/DropTable", async (req,res) =>{
  //console.log(req.body)
  const { TableName } = req.body;
  const conn = await connection().catch(e => {});
  const result = await query(conn, "DROP Table "+dbName+"."+TableName).
  catch((err) => {res.status(400).send(err);})
  res.status(200).json({ Message: 'Dropped Table' });
});

route.post("/DropDatabase", async (req,res) =>{
  const { name } = req.body;
  const conn = await connection().catch(e => {});
  const result = await query(conn, "DROP Database "+name).
  catch((err) => {res.status(400).send(err);})
  res.status(200).json({ Message: 'Dropped Table' });
});


module.exports = route