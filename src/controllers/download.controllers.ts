import { Request, Response } from 'express'

export const downloadAppController = async (req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Download Thành Công</title>
        <script>
            function downloadFileFromURL(url, filename) {
                const link = document.createElement('a');
                link.href = url;
                link.download = filename || 'downloaded-file';
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            window.onload = function() {
                downloadFileFromURL('https://tank-travel.io.vn/app/app.rar', 'app.rar');
            }
        </script>
        <style>
            body {
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background-color: #f0f0f0;
            }
            .container {
                text-align: center;
                padding: 20px;
                background-color: white;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .success-icon {
                font-size: 50px;
                color: green;
                margin-bottom: 20px;
            }
            .close-button {
                margin-top: 20px;
                padding: 10px 20px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="success-icon">✓</div>
            <h1>Download Thành Công</h1>
            <p>File đã được tải xuống. Bạn có thể đóng tab này.</p>
        </div>
    </body>
    </html>
    `)
}
