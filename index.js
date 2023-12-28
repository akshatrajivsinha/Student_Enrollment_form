
      $("#rollno").focus();
      $("#rollno").prop("disabled",false);
      $("#fullName").prop("disabled",true);
      $("#class").prop("disabled",true);
      $("#birthday").prop("disabled",true);
      $("#address").prop("disabled",true);
      $("#enrollmentdate").prop("disabled",true);

      function validateAndGetFormData() {

        var rollnoVar = $("#rollno").val();
        if (rollnoVar === "") {
          alert("Student Roll No Required");
          $("#rollno").focus();
          return "";
        }

        var fullNameVar = $("#fullName").val();
        if (fullNameVar === "") {
          alert("Student Name is Required");
          $("#fullName").focus();
          return "";
        }

        var classVar = $("#class").val();
        if (classVar === "") {
          alert("Student Class is Required");
          $("#class").focus();
          return "";
        }

        var birthdateVar = $("#birthdate").val();
        if (birthdateVar === "") {
          alert("Student Birth Day is Required");
          $("#birthdate").focus();
          return "";
        }

        var addressVar = $("#address").val();
        if (addressVar === "") {
          alert("Student Address is Required");
          $("#addresss").focus();
          return "";
        }

        var enrollmentdateVar = $("#enrollmentdate").val();
        if (enrollmentdateVar === "") {
          alert("Student Enrollment Date is Required");
          $("#enrollmentdate").focus();
          return "";
        }
        var jsonStrObj = {
          rollno: rollnoVar,
          fullName: fullNameVar,
          class: classVar,
          birthdate:birthdateVar,
          address:addressVar,
          enrollmentdate:enrollmentdateVar
        };
        return JSON.stringify(jsonStrObj);
      }


      // This method is used to create PUT Json request.
      function createPUTRequest(connToken, jsonObj, dbName, relName) {
        var putRequest =
          "{\n" +
          '"token" : "' +
          connToken +
          '",' +
          '"dbName": "' +
          dbName +
          '",\n' +
          '"cmd" : "PUT",\n' +
          '"rel" : "' +
          relName +
          '",' +
          '"jsonStr": \n' +
          jsonObj +
          "\n" +
          "}";
        return putRequest;
      }

      function executeCommand(reqString, dbBaseUrl, apiEndPointUrl) {
        var url = dbBaseUrl + apiEndPointUrl;
        var jsonObj;
     

        $.post(url, reqString, function (result) {
          jsonObj = JSON.parse(result);
        }).fail(function (result) {
          var dataJsonObj = result.responseText;
          jsonObj = JSON.parse(dataJsonObj);
        });
        return jsonObj;
      }


      function resetForm() {
        $("#rollno").val("");
        $("#fullName").val("");
        $("#class").val("");
        $("#birthdate").val("");
        $("#address").val("");
        $("#enrollmentdate").val("");
        $("#rollno").prop("disabled",false);
        $("#fullName").prop("disabled",true);
        $("#class").prop("disabled",true);
        $("#birthday").prop("disabled",true);
        $("#address").prop("disabled",true);
        $("#enrollmentdate").prop("disabled",true);
        $("#rollno").focus();
      }




      function savestudent() {
        var jsonStr = validateAndGetFormData();
        if (jsonStr === "") {
          return;
        }
        var putReqStr = createPUTRequest(
          "90931901|-31949300056406231|90960717",
          jsonStr,
          "SCHOOL-DB",
          "STUDENT-TABLE"
        );
        alert(putReqStr);
        jQuery.ajaxSetup({ async: false });
        var resultObj = executeCommand(
          putReqStr,
          "http://api.login2explore.com:5577",
          "/api/iml"
        );
        alert(JSON.stringify(resultObj));
        jQuery.ajaxSetup({ async: true });
        resetForm();
      }
  

      function getrollnoJsonObj(){
        var rollno = $("#rollno").val();
        var jsonStr = {
            rollno: rollno
        };
        return JSON.stringify(jsonStr)
      }

      function saveRecNo2LS(jsonObj){
        var lvData = JSON.parse(jsonObj.data);
        localStorage.setItem("recno", lvData.rec_no);
      }

      function fillDate(jsonObj){
        saveRecNo2LS(jsonObj);
        var data = JSON.parse(jsonObj.data).record;
        console.log(data)
        $("#fullName").val(data.fullName);
        $("#class").val(data.class);
        $("#birthdate").val(data.birthdate);
        $("#address").val(data.address);
        $("#enrollmentdate").val(data.enrollmentdate);
      
      }


      function getrollno(){
        var rollnoJsonObj = getrollnoJsonObj();
        var getRequest = createGET_BY_KEYRequest(
            "90931901|-31949300056406231|90960717",
            "SCHOOL-DB",
            "STUDENT-TABLE",
            rollnoJsonObj
            );
        jQuery.ajaxSetup({async: false});
        var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, "http://api.login2explore.com:5577" ,"/api/irl");
        jQuery.ajaxSetup({async: true});
        if(resJsonObj.status === 400){
            $("#save").prop('disabled',false);
            $("#reset").prop('disabled',false);

            $("#rollno").prop("disabled",false);
            $("#fullName").prop("disabled",false);
            $("#class").prop("disabled",false);
            $("#birthday").prop("disabled",false);
            $("#address").prop("disabled",false);
            $("#enrollmentdate").prop("disabled",false);

            $("#fullName").focus();
        }else if(resJsonObj.status === 200){
            $("#rollno").prop('disabled',true);
            fillDate(resJsonObj);

            $("#update").prop('disabled',false);
            $("#reset").prop('disabled',false);
            $("#rollno").prop("disabled",false);
            $("#fullName").prop("disabled",false);
            $("#class").prop("disabled",false);
            $("#birthday").prop("disabled",false);
            $("#address").prop("disabled",false);
            $("#enrollmentdate").prop("disabled",false);
            $("#fullName").focus();
            
        }

      }

      function updatestudent(){
        $("#update").prop("disabled",true);
        jsonChg = validateAndGetFormData();
        var updateRequest = createUPDATERecordRequest(
            "90931901|-31949300056406231|90960717",
            jsonChg,
            "SCHOOL-DB",
            "STUDENT-TABLE",
            localStorage.getItem("recno")
        );
        jQuery.ajaxSetup({async: false});
        var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, "http://api.login2explore.com:5577" ,"/api/iml");
        jQuery.ajaxSetup({async: true});
        resetForm();
        $("#rollno").focus();
      }