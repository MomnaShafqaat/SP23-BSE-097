

window.onload=function(){
    let gForm=document.getElementById("gform");
    gForm.onsubmit=handleSubmitBtn;
};
  //submit function
  function handleSubmitBtn(e){
    e.preventDefault();

    let errorMsg=document.getElementsByClassName("error-message");
    for(let index=0 ; index<errorMsg.length;index++){
        errorMsg[index].style.display="none";
    }

    let query=document.getElementById("query");
    if(!query.value.trim()){
        console.log("Invalid form");
        query.classList.add("error");
        errorMsg[0].style.display="inline";

    }else{        console.log("valid foam");

        query.classList.remove("error");


    }

    let query1=document.getElementById("query1");
    if(!query1.value.trim()){
        console.log("Invalid form");
        query1.classList.add("error");
        errorMsg[1].style.display="inline";
    }
    else{
        query1.classList.remove("error");

        console.log("valid form");

    }


    let query2=document.getElementById("query2");
    if(!query2.value.trim()){
        console.log("Invalid form");
        query2.classList.add("error");
        errorMsg[2].style.display="inline";
    }
    else{
        query2.classList.remove("error");
        console.log("valid form");

    }

    let query3=document.getElementById("query3");                                                
    if(!query3.value.trim()){ 
        console.log("Invalid form");
        query3.classList.add("error");
        errorMsg[3].style.display="inline";
     }
    else{  
        query3.classList.remove("error");
        console.log("valid form");
    }


  }