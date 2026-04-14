function doPost(e) {
  // Connect to the active sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Set up the headers if the sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp", "Name", "Email", "Age", "Weight (kg)", "Height (cm)", "BMI", "Primary Goal / Problem"]);
    // Freeze and bold the header row
    sheet.getRange(1, 1, 1, 8).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  // Parse the incoming JSON payload from the frontend
  if(e && e.postData && e.postData.contents) {
    try {
      var data = JSON.parse(e.postData.contents);
      
      // Map the payload data to the exact columns
      var rowData = [
        new Date(),             // Timestamp
        data.name || "",        // Name
        data.email || "",       // Email
        data.age || "",         // Age
        data.weight || "",      // Weight
        data.height || "",      // Height
        data.bmi || "",         // BMI
        data.problem || ""      // Primary Goal / Challenge
      ];
      
      // Append the new row to the Google Sheet
      sheet.appendRow(rowData);
      
      // Send an auto-reply email to the user (agle vale ko)
      if (data.email) {
        var subject = "Thank you for reaching us - Yoga.Fitx";
        var body = "Hi " + data.name + ",\n\nThank you for reaching us!\n\nHamari team aapse jaldi contact karegi to help you with your fitness journey.\n\nFor more details, please contact Mohnish Sir directly at: 8055492441.\n\nBest Regards,\nYoga.Fitx Team";
        
        try {
          MailApp.sendEmail({
            to: data.email,
            subject: subject,
            body: body,
            name: "Yoga.Fitx",
            replyTo: "yogadotfitxteam@gmail.com"
          });
        } catch (e) {
          // Ignore email error if the email address is invalid
        }
      }
      
      // Return a success JSON response
      return ContentService.createTextOutput(JSON.stringify({"status": "success", "message": "Lead captured successfully"}))
                           .setMimeType(ContentService.MimeType.JSON);
                           
    } catch(error) {
      // Handle parsing errors
      return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": error.toString()}))
                           .setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  // Fallback if no valid data was found
  return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": "No data received"}))
                       .setMimeType(ContentService.MimeType.JSON);
}

// Handle CORS preflight requests (Important for web forms)
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}

// RUN THIS FUNCTION ONCE IN THE EDITOR TO AUTHORIZE GMAIL
function authorizeEmail() {
  MailApp.sendEmail(Session.getActiveUser().getEmail(), "Yoga.Fitx Auth Test", "If you got this, the email permissions are working!");
}
