"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newInfoLanding = exports.newResetPassTemplate = exports.newInvitationGuestTemplate = exports.newInvitationTemplate = exports.newIdSession = void 0;
const newIdSession = (id) => {
    return `
    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
    <html lang="es">
    
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title></title>
    </head>
    
    <body style="margin:0; padding:0; background-color:#FAFAFA;">
        <center>
            <table width="720" cellpadding="0" cellspacing="0" border="0" style="border-radius: 8px;" class="wrapper" bgcolor="#000d34">
                <tr>
                    <td height="10" style="font-size:10px; line-height:10px;">&nbsp;</td>
                </tr>
                <tr>
                    <td align="center" valign="top">
                        <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                            <tr>
                                <td align="center" valign="top">
                                    <h3 style="font-family:Helvetica; font-size:1.5rem;color:white;">Meeting code</h3>
                                </td>
                            </tr>
                            <tr>
                             <td align="center" valign="top">
                                 <img src="https://ocupath.fra1.digitaloceanspaces.com/app/Logo15x.svg" alt="">
                             </td>
                         </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td height="10" style="font-size:10px; line-height:10px;">&nbsp;</td>
                </tr>
                <tr>
                    <td align="center" valign="top">
                        <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                            <tr>
                                <td align="left" valign="top">
                                    <p style="font-family:Helvetica; font-size:1rem;font-weight:bold; color:white; line-height: 1.4;">Hello! It's a pleasure to greet you, </p>
                                    <p style=" margin-bottom:2rem;font-family:Helvetica; font-size:1rem; color:white; line-height: 1.4;"> 
                                        An user has invited you to a meeting:</p>
                                    <p style=" margin-bottom:2rem;font-family:Helvetica; font-size:1rem; color:white; line-height: 1.4;"> 
                                        Enter the followin code within the VR Multivrsity App and be part of the meeting.        
                                    </p>
                                   
                                </td>
                            </tr>
                            <tr>
                                <td align="center" valign="top">
                                    <p style="font-family:Helvetica; font-size:1.8rem;font-weight:bold; color:white; line-height: 1.4;">Meeting code: </p>
                                    <p style="font-family:Helvetica; font-size:1.8rem;font-weight:bold; color:white; line-height: 1.4;">${id}  </p>
                                    
                                </td>
                            </tr>
                            
                        </table>
                    </td>
                </tr>
                <tr>
                    <td height="30"
                        style="font-size:10px; line-height:10px; border-bottom: 2px solid #EAEAEA; padding-bottom: 9px;">
                        &nbsp;</td>
                </tr>
                <tr bgcolor="#000d34">
                    <td align="center" valign="top">
                        <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                            <tr>
    
                            </tr>
                        </table>
                    </td>
                </tr>
               
            </table>
        </center>
    </body>
    
    </html>
 `;
};
exports.newIdSession = newIdSession;
const newInvitationTemplate = (newInvitation) => {
    return `
    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
    <html lang="es">
    
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title></title>
    </head>
    
    <body style="margin:0; padding:0; background-color:#FAFAFA;">
        <center>
            <table width="640" cellpadding="0" cellspacing="0" border="0" style="border-radius: 8px;" class="wrapper" bgcolor="#000d34">
                <tr>
                    <td height="10" style="font-size:10px; line-height:10px;">&nbsp;</td>
                </tr>
                <tr>
                    <td align="center" valign="top">
                        <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                            <tr>
                                <td align="center" valign="top">
                                    <h3 style="font-family:Helvetica; font-size:1.5rem;color:white;">Welcome to</h3>
                                </td>
                            </tr>
                            <tr>
                             <td align="center" valign="top">
                                 <img src="https://ocupath.fra1.digitaloceanspaces.com/app/logo.png" alt="">
                             </td>
                         </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td height="10" style="font-size:10px; line-height:10px;">&nbsp;</td>
                </tr>
                <tr>
                    <td align="center" valign="top">
                        <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                            <tr>
                                <td align="left" valign="top">
                                    <p style="font-family:Helvetica; font-size:1rem;font-weight:bold; color:white; line-height: 1.4;">Hello! It's a pleasure to greet you, </p>
                                    <p style=" margin-bottom:2rem;font-family:Helvetica; font-size:1rem; color:white; line-height: 1.4;"> In response to your request we are sending you the personalized plan agreement which includes a total of ${newInvitation.invitations} invitations which you can send to the users of your choosing. </p>
                                    <p style=" margin-bottom:2rem;font-family:Helvetica; font-size:1rem; color:white; line-height: 1.4;"> The total cost will be $ ${newInvitation.cost} for the period from ${newInvitation.start} to ${newInvitation.finish} </p>
                                    <p style="font-family:Helvetica; font-size:1rem; color:white; line-height: 1.4;"> To complete the process please provide us with the following information: </p>
                                    <p style=" font-family:Helvetica; font-size:1rem; line-height: 1.4;"><a
                                     style="color:white;"
                                     href="https://ocupath-nine.vercel.app/register/${newInvitation.token}"
                                     target="_blank">Register</a></p>
                                </td>
                            </tr>
                            
                        </table>
                    </td>
                </tr>
                <tr>
                    <td height="30"
                        style="font-size:10px; line-height:10px; border-bottom: 2px solid #EAEAEA; padding-bottom: 9px;">
                        &nbsp;</td>
                </tr>
                <tr bgcolor="#000d34">
                    <td align="center" valign="top">
                        <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                            <tr>
    
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr bgcolor="#FAFAFA">
                    <td align="center" valign="top">
                        <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                            <tr>
                                <td align="left" valign="top" style="padding-top: 15px; text-align: center;">
                                    <em
                                        style="font-style: italic; font-family: Helvetica; font-size: 12px; color: #656565;">Copyright
                                        © 2021 Ocupath, All rights reserved.</em></td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </center>
    </body>
    
    </html>
 `;
};
exports.newInvitationTemplate = newInvitationTemplate;
const newInvitationGuestTemplate = (newInvitation) => {
    return `
    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="es">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title></title>
</head>

<body style="margin:0; padding:0; background-color:#FAFAFA;">
    <center>
        <table width="720" cellpadding="0" cellspacing="0" border="0" style="border-radius: 8px;" class="wrapper" bgcolor="#000d34">
            <tr>
                <td height="10" style="font-size:10px; line-height:10px;">&nbsp;</td>
            </tr>
            <tr>
                <td align="center" valign="top">
                    <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                        <tr>
                            <td align="center" valign="top">
                                <h3 style="font-family:Helvetica; font-size:1.5rem;color:white;">Welcome to</h3>
                            </td>
                        </tr>
                        <tr>
                         <td align="center" valign="top">
                             <img style="height:3.4rem" src="https://ocupath.fra1.digitaloceanspaces.com/app/Logo15x.svg" alt="">
                         </td>
                     </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td height="10" style="font-size:10px; line-height:10px;">&nbsp;</td>
            </tr>
            <tr>
                <td align="center" valign="top">
                    <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                        <tr>
                            <td align="left" valign="top">
                               
                                <p style="margin-bottom:1.5rem; font-family:Helvetica; font-size:1rem;font-weight:bold; color:white; line-height: 1.4;">Hello! It's a pleasure to greet you, </p>

                                <p style=" margin-bottom:1.5rem;font-family:Helvetica; font-size:1rem; color:white; line-height: 1.4;"> 
                                    We hereby invite you to become part of our team.
                                 </p>
                                <p style=" margin-bottom:2rem;font-family:Helvetica; font-size:1rem; color:white; line-height: 1.4;"> 
                                    <span style="margin-right:0.2rem">Please enter this link to complete your registration:</span>
                                    <a
                                    style="color:white;"
                                    href="https://ocupath-nine.vercel.app/register/${newInvitation.token}"
                                    target="_blank">Register</a>
                                 </p>
                            </td>
                        </tr>
                        
                    </table>
                </td>
            </tr>
            <tr>
                <td height="30"
                    style="font-size:10px; line-height:10px; border-bottom: 2px solid #EAEAEA; padding-bottom: 9px;">
                    &nbsp;</td>
            </tr>
            <tr bgcolor="#000d34">
                <td align="center" valign="top">
                    <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                        <tr>

                        </tr>
                    </table>
                </td>
            </tr>
            <tr bgcolor="#FAFAFA">
                <td align="center" valign="top">
                    <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                        <tr>
                            <td align="left" valign="top" style="padding-top: 15px; text-align: center;">
                                <em
                                    style="font-style: italic; font-family: Helvetica; font-size: 12px; color: #656565;">Copyright
                                    © 2021 Ocupath, All rights reserved.</em></td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </center>
</body>

</html>
 `;
};
exports.newInvitationGuestTemplate = newInvitationGuestTemplate;
const newResetPassTemplate = (token) => {
    return `
    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
    <html lang="es">
    
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title></title>
    </head>
    
    <body style="margin:0; padding:0; background-color:#FAFAFA;">
        <center>
            <table width="640" cellpadding="0" cellspacing="0" border="0" style="border-radius: 8px;" class="wrapper" bgcolor="#000d34">
                <tr>
                    <td height="10" style="font-size:10px; line-height:10px;">&nbsp;</td>
                </tr>
                <tr>
                    <td align="center" valign="top">
                        <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                            <tr>
                                <td align="center" valign="top">
                                    <h3 style="font-family:Helvetica; font-size:1.5rem;color:white;">Password recovery</h3>
                                </td>
                            </tr>
                            <tr>
                             <td align="center" valign="top">
                                 <img src="https://ocupath.fra1.digitaloceanspaces.com/app/Logo15x.svg" alt="">
                             </td>
                         </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td height="10" style="font-size:10px; line-height:10px;">&nbsp;</td>
                </tr>
                <tr>
                    <td align="center" valign="top">
                        <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                            <tr>
                                <td align="left" valign="top">
                                    <p style="font-family:Helvetica; font-size:1rem;font-weight:bold; color:white; line-height: 1.4;">Hello! It's a pleasure to greet you, </p>
                                    <p style=" margin-bottom:2rem;font-family:Helvetica; font-size:1rem; color:white; line-height: 1.4;"> In response to your request we send you the following link to update your password:</p>
    
                                   
                                    <p style="color:#45a0c5; font-family:Helvetica; font-size:1rem; line-height: 1.4;"><a
                                        style="color:#45a0c5;"
                                        href="https://ocupath-nine.vercel.app/recovery/${token}"
                                        target="_blank">Click here</a></p>
                                </td>
                            </tr>
                            
                        </table>
                    </td>
                </tr>
                <tr>
                    <td height="30"
                        style="font-size:10px; line-height:10px; border-bottom: 2px solid #EAEAEA; padding-bottom: 9px;">
                        &nbsp;</td>
                </tr>
                <tr bgcolor="#000d34">
                    <td align="center" valign="top">
                        <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                            <tr>
    
                            </tr>
                        </table>
                    </td>
                </tr>
               
            </table>
        </center>
    </body>
    
    </html>
 `;
};
exports.newResetPassTemplate = newResetPassTemplate;
const newInfoLanding = ({ name, company, email, phone }) => {
    return `
    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
    <html lang="es">
    
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title></title>
    </head>
    
    <body style="margin:0; padding:0; background-color:#FAFAFA;">
        <center>
            <table width="720" cellpadding="0" cellspacing="0" border="0" style="border-radius: 8px;" class="wrapper" bgcolor="#7A868F">
                <tr>
                    <td height="10" style="font-size:10px; line-height:10px;">&nbsp;</td>
                </tr>
                <tr>
                    <td align="center" valign="top">
                        <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                            <tr>
                                <td align="center" valign="top">
                                    <h3 style="font-family:Helvetica;font-weight: bold; font-size:1.5rem;color:white;">New request</h3>
                                </td>
                            </tr>
                            <tr>
                             <td align="center" valign="top">
                                 <img src="https://ocupath.fra1.digitaloceanspaces.com/app/Logo15x.svg" alt="">
                             </td>
                         </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td height="10" style="font-size:10px; line-height:10px;">&nbsp;</td>
                </tr>
                <tr>
                    <td align="center" valign="top">
                        <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                            <tr>
                                <td align="left" valign="top">
                                    <p style="font-family:Helvetica; font-size:1rem;font-weight:bold; color:white; line-height: 1.4;">Hello! You have received a new request for information. </p>
                                    <p style=" margin-bottom:2rem;font-family:Helvetica; font-size:1rem; color:white; line-height: 1.4;"> 
                                        We will respond as soon as possible to answer the customer's questions and offer one of our plans.</p>
                                    
                                   
                                </td>
                            </tr>
                            <tr>
                                <td align="left" valign="top">
                                    <p style="font-family:Helvetica; font-size:1rem;font-weight:bold; color:white; line-height: 1.4;">
                                        Customer Information
                                     </p>
                                     <p style="font-family:Helvetica; font-size:1rem;font-weight:bold; color:#242526; line-height: 1.4;">
                                        Name:
                                     </p>
                                     <p style="font-family:Helvetica; font-size:1rem; color:white; line-height: 1.4;">
                                        ${name}
                                     </p>
                                     <p style="font-family:Helvetica; font-size:1rem;font-weight:bold; color:#242526; line-height: 1.4;">
                                        Company:
                                     </p>
                                     <p style="font-family:Helvetica; font-size:1rem; color:white; line-height: 1.4;">
                                     ${company}
                                     </p>
                                     <p style="font-family:Helvetica; font-size:1rem;font-weight:bold; color:#242526; line-height: 1.4;">
                                        Email:
                                     </p>
                                     <p style="font-family:Helvetica; font-size:1rem; color:white; line-height: 1.4;">
                                     ${email}
                                     </p>
                                     <p style="font-family:Helvetica; font-size:1rem;font-weight:bold; color:#242526; line-height: 1.4;">
                                        Telephone number::
                                     </p>
                                     <p style="font-family:Helvetica; font-size:1rem; color:white; line-height: 1.4;">
                                     ${phone}
                                     </p>
                                    
                                    
                                </td>
                            </tr>
                            
                        </table>
                    </td>
                </tr>
                <tr>
                    <td height="30"
                        style="font-size:10px; line-height:10px; border-bottom: 2px solid #EAEAEA; padding-bottom: 9px;">
                        &nbsp;</td>
                </tr>
                <tr bgcolor="#000d34">
                    <td align="center" valign="top">
                        <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                            <tr>
    
                            </tr>
                        </table>
                    </td>
                </tr>
               
            </table>
        </center>
    </body>
    
    </html>
 `;
};
exports.newInfoLanding = newInfoLanding;
//# sourceMappingURL=templates.js.map