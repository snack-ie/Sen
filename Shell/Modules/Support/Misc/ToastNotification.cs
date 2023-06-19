﻿
using System.Diagnostics;
using System.Runtime.InteropServices;

namespace Sen.Shell.Modules.Support.Misc
{
    
    public abstract class Toast
    {

        public abstract void SendWindows(string title, string message);

        public abstract void SendMacintosh(string message, string title);

        public abstract void SendLinux(string message, string title);


    }

    
    public class ToastNotification : Toast
    {
        public override void SendMacintosh(string message,string title)
        {
            string notification = ($"display notification \\\"{(message)}\\\" with title \\\"{(title)}\\\"");
            Process.Start("osascript", $"-e \"{(notification)}\"");
            return;
        }

        public override void SendLinux(string message, string title)
        {
            string notification = ($"notify-send '{title}' '{message}'");
            Process.Start("bash", $"-c \"{notification}\"");
            return;
        }

        public override void SendWindows(string message, string title)
        {
            // Construct the PowerShell command
            string command = $"[Windows.UI.Notifications.ToastNotificationManager," +
                $" Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null; [Windows.UI.Notifications.ToastNotification, " +
                $"Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null; [Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument," +
                $" ContentType = WindowsRuntime] | Out-Null; $template =" +
                $" [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent([Windows.UI.Notifications.ToastTemplateType]::ToastText02); " +
                $"$toastXml = [Windows.Data.Xml.Dom.XmlDocument]::new(); $toastXml.LoadXml($template.GetXml()); $toastXml.GetElementsByTagName('text')[0].AppendChild($toastXml.CreateTextNode('{message}')) > $null; " +
                $"$toastXml.GetElementsByTagName('text')[1].AppendChild($toastXml.CreateTextNode('{message}')) > $null; $toast = [Windows.UI.Notifications.ToastNotification]::new($toastXml);" +
                $" [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier('{title}').Show($toast);";

            var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "powershell.exe",
                    Arguments = command,
                    RedirectStandardOutput = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                }
            };

            process.Start();

            process.WaitForExit();

            return;
        }


    }
}
