

export const newIdSession = (id:string)=>{

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
         <table width="640" cellpadding="0" cellspacing="0" border="0" class="wrapper" bgcolor="#FFFFFF">
             <tr>
                 <td height="10" style="font-size:10px; line-height:10px;">&nbsp;</td>
             </tr>
             <tr>
                 <td align="center" valign="top">
                     <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                         <tr>
                             <td align="center" valign="top">
                                 <h3 style="font-family:Helvetica; font-size:1.5rem;">Nuevo token de sesión.</h3>
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
                                 <p style="font-family:Helvetica; font-size:1rem; line-height: 1.4;">
                                     Has creado un nuevo id de sesión.</p>
                                     <h4> ${id} </h4>
                                 
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
             <tr bgcolor="#FAFAFA">
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
                                     © 2019 Bioderma, All rights reserved.</em></td>
                         </tr>
                     </table>
                 </td>
             </tr>
         </table>
     </center>
 </body>
 
 </html>
 `
}

export const newInvitationTemplate = (token:string)=>{

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
        <table width="640" cellpadding="0" cellspacing="0" border="0" class="wrapper" bgcolor="#FFFFFF">
            <tr>
                <td height="10" style="font-size:10px; line-height:10px;">&nbsp;</td>
            </tr>
            <tr>
                <td align="center" valign="top">
                    <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                        <tr>
                            <td align="center" valign="top">
                                <h3 style="font-family:Helvetica; font-size:1.5rem;">Has sido invitado a Ocupath.</h3>
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
                                <p style="font-family:Helvetica; font-size:1rem; line-height: 1.4;">
                                    Crea una cuenta accediendo a la siguiente ruta y disfruta de nuestra app movil.</p>
                                <p style="font-family:Helvetica; font-size:1rem; line-height: 1.4;"><a
                                        href="https://ocupath.netlify.app/register/${token}"
                                        
                                        target="_blank">Crear cuenta</a></p>
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
            <tr bgcolor="#FAFAFA">
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
                                    © 2019 Bioderma, All rights reserved.</em></td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </center>
</body>

</html>
 `
}

export const newResetPassTemplate = (token:string)=>{

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
        <table width="640" cellpadding="0" cellspacing="0" border="0" class="wrapper" bgcolor="#FFFFFF">
            <tr>
                <td height="10" style="font-size:10px; line-height:10px;">&nbsp;</td>
            </tr>
            <tr>
                <td align="center" valign="top">
                    <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                        <tr>
                            <td align="center" valign="top">
                                <h3 style="font-family:Helvetica; font-size:1.5rem;">Recuperación de contraseña.</h3>
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
                                <p style="font-family:Helvetica; font-size:1rem; line-height: 1.4;">
                                    Accede al siguiente enlace para recuperar tu contraseña.</p>
                                <p style="font-family:Helvetica; font-size:1rem; line-height: 1.4;"><a
                                        href="https://ocupath.netlify.app/recovery/${token}"
                                        target="_blank">Recuperar mi contraseña</a></p>
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
            <tr bgcolor="#FAFAFA">
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
 `
}