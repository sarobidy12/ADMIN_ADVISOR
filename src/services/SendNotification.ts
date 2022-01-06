import request from "request";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

interface INotification {
  title: string;
  body: string;
  isRedirectAdmin: boolean;
  to: string[];
}

const SendNotification = (data: INotification) => {
    
  const listTo = data.to.filter((item: any) => item !== null);

  const message = {
    data: { score: "850", time: "2:45" },
    tokens: listTo,
    notification: {
      title: data.title,
      body: data.body,
      icon: "https://admin-advisor.voirlemenu.fr/static/media/logo.8da5d5e8.png",
      click_action: data.isRedirectAdmin
        ? "https://admin-advisor.voirlemenu.fr/"
        : "https://advisor.voirlemenu.fr/",
    },
    priority: "high",
    android: {
      priority: "high",
    },
    apns: {
      headers: {
        "apns-priority": "5",
      },
    },
    webpush: {
      headers: {
        Urgency: "high",
      },
      notification: {
        title: data.title,
        body: data.body,
        icon: "https://admin-advisor.voirlemenu.fr/static/media/logo.8da5d5e8.png",
        click_action: data.isRedirectAdmin
          ? "https://admin-advisor.voirlemenu.fr/"
          : "https://advisor.voirlemenu.fr/",
      },
    },
  };

  (getMessaging() as any).sendMulticast(message).then((response: any) => {
    console.log(response.successCount + " messages were sent successfully");
  });

  // for (let i = 0; i < listTo.length; i++) {

  //     request.post({
  //         url: 'https://fcm.googleapis.com/fcm/send',
  //         headers: {
  //             'Content-Type': 'application/json',
  //             'Authorization': 'key=AAAAzkz8-xg:APA91bGHoGL6SyhcCmU01UdRdMKI6cKW5ZirZGsTuFHbq24POW6pFyGC0wQPbi5XirB6fh3ZJvfyNDxvN0PhuSHbTQIN1X_Hl8XH6I1waUqVe-INqixKh2dlKJhixW83iVWjZV4A5MN9'
  //         },
  //         body: JSON.stringify({
  //             to: listTo[i],
  //             notification: {
  //                 title: data.title,
  //                 body: data.body,
  //                 icon: "https://admin-advisor.voirlemenu.fr/static/media/logo.8da5d5e8.png",
  //                 click_action: data.isRedirectAdmin ? "https://admin-advisor.voirlemenu.fr/" : "https://advisor.voirlemenu.fr/",
  //             },
  //             priority: "high",
  //             android: {
  //                 priority: "high"
  //             },
  //             apns: {
  //                 headers: {
  //                     "apns-priority": "5"
  //                 }
  //             },
  //             webpush: {
  //                 headers: {
  //                     Urgency: "high"
  //                 },
  //                 notification: {
  //                     title: data.title,
  //                     body: data.body,
  //                     icon: "https://admin-advisor.voirlemenu.fr/static/media/logo.8da5d5e8.png",
  //                     click_action: data.isRedirectAdmin ? "https://admin-advisor.voirlemenu.fr/" : "https://advisor.voirlemenu.fr/",
  //                 },
  //             }
  //         })

  //     }, function (error: any, response: any, body: any) {
  //         console.log("body---->", body);
  //     })
};

export default SendNotification;
